import dns from "node:dns/promises";
import net from "node:net";

const PRIVATE_V4 = [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16],
  ["172.16.0.0", 12], ["192.168.0.0", 16], ["198.18.0.0", 15], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const;

function v4ToInt(ip: string) {
  return ip.split(".").reduce((a, o) => (a << 8) + Number(o), 0) >>> 0;
}
export function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const n = v4ToInt(ip);
    return PRIVATE_V4.some(([base, bits]) => (n >>> (32 - bits)) === (v4ToInt(base) >>> (32 - bits)));
  }
  const l = ip.toLowerCase();
  if (l.startsWith("::ffff:")) return isPrivateIp(l.slice(7));
  return l === "::1" || l === "::" || l.startsWith("fc") || l.startsWith("fd") || l.startsWith("fe80") || l.startsWith("ff");
}

/** Validates a user URL and rejects anything resolving to internal/sensitive networks (SSRF guard). */
export async function assertPublicUrl(raw: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new Error("URL inválida");
  }
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("Apenas http(s) é permitido");
  if (u.username || u.password) throw new Error("URLs com credenciais não são aceitas");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Porta não permitida");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (/^(localhost|.*\.local|.*\.internal|metadata\.google\.internal)$/i.test(host)) throw new Error("Host interno bloqueado");
  const addrs = net.isIP(host) ? [host] : (await dns.lookup(host, { all: true }).catch(() => [])).map((a) => a.address);
  // When DNS is delegated to an egress proxy the lookup may fail; the proxy then enforces policy. Literal IPs are always checked.
  if (addrs.some(isPrivateIp)) throw new Error("Destino em rede interna bloqueado");
  return u;
}

export const MAX_PDF_BYTES = 20 * 1024 * 1024;
export function assertPdf(buf: Buffer, name: string) {
  if (buf.length > MAX_PDF_BYTES) throw new Error("PDF acima de 20 MB");
  if (!/\.pdf$/i.test(name) || buf.subarray(0, 5).toString() !== "%PDF-") throw new Error("O arquivo não é um PDF válido");
}

/** Strips third-party scripts/trackers from source-derived text: source content is data, never instructions. */
export function fenceUntrusted(label: string, text: string) {
  return `<untrusted_source label="${label}">\n${text.replace(/<\/?untrusted_source[^>]*>/g, "")}\n</untrusted_source>`;
}
