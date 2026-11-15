/** @type {import('next').NextConfig} */
export default {
  serverExternalPackages: ["playwright", "unpdf", "@anthropic-ai/sdk"],
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
};
