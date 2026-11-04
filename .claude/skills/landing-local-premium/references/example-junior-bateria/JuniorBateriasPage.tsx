/* Junior Baterias landing page, built on the layout and motion of the Qronos clone. */
import {
  BadgeCheck,
  BatteryCharging,
  Car,
  CircleCheck,
  CircleX,
  Clock,
  Gauge,
  MapPin,
  Navigation,
  MessageCircle,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import type { CSSProperties } from "react";
import { HighlightTestimonialSection, type Testimonial } from "@/components/ui/highlight-testimonial-section";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

const WHATSAPP = "https://wa.me/558293697793";
const GOOGLE_REVIEWS = "https://share.google/ZPG7STv3Ac4ElyyAx";
const ADDRESS_LINE = "Rua José Vieira, 107 – Tabuleiro dos Martins";
const ADDRESS_CITY = "Maceió – AL";
/* Map pin: business name + address, so it lands on the business listing. */
const MAP_QUERY = encodeURIComponent("Junior Bateria, Rua José Vieira, 107 - Tabuleiro dos Martins, Maceió - AL");
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_QUERY}&z=16&hl=pt-BR&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

/* Structured data so Google understands this is a local battery business in Maceió.
 * Add "url" once the final domain is set. */
const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: "Júnior Bateria",
  description:
    "Socorro de bateria em Maceió: entrega, teste e troca da bateria do carro onde você estiver, com instalação grátis e check-up elétrico.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua José Vieira, 107 - Tabuleiro dos Martins",
    addressLocality: "Maceió",
    addressRegion: "AL",
    postalCode: "57081-520",
    addressCountry: "BR",
  },
  telephone: "+55 82 9369-7793",
  areaServed: { "@type": "City", name: "Maceió" },
  hasMap: "https://www.google.com/maps/search/?api=1&query=" + MAP_QUERY,
  sameAs: ["https://www.instagram.com/juniorbateriaa"],
  brand: ["Moura", "MG3", "Kondor", "Heliar", "Zetta"].map((name) => ({ "@type": "Brand", name })),
};

/* Battery photos for the curved row (files in public/sites/junior-baterias/baterias/). */
const BATTERY_IMAGES = [
  { src: "/sites/junior-baterias/baterias/moura.webp", alt: "Bateria Moura" },
  { src: "/sites/junior-baterias/baterias/kondor-vermelha.webp", alt: "Bateria Kondor" },
  { src: "/sites/junior-baterias/baterias/zetta.webp", alt: "Bateria Zetta" },
  { src: "/sites/junior-baterias/baterias/mg3.webp", alt: "Bateria MG3" },
  { src: "/sites/junior-baterias/baterias/kondor-branca.webp", alt: "Bateria Kondor" },
];

/* Brand logos for the marquee. Provisional crops from the battery photos;
 * replace with the official logo files when available (Heliar is text for now). */
const BRAND_LOGOS: { name: string; src?: string }[] = [
  { name: "Moura", src: "/sites/junior-baterias/marcas/moura.webp" },
  { name: "Kondor", src: "/sites/junior-baterias/marcas/kondor.webp" },
  { name: "MG3", src: "/sites/junior-baterias/marcas/mg3.webp" },
  { name: "Zetta", src: "/sites/junior-baterias/marcas/zetta.webp" },
  { name: "Heliar" },
];

/* Real customer reviews only. Add new ones here as { quote, highlight, author, role }. */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Profissional honesto, fez todos os testes possíveis constatando que a bateria estava boa, não foi que nem os demais que já condenam de imediato para realizar a venda, parabéns, retornarei e indicarei.",
    highlight: "Profissional honesto",
    author: "Damázio Souza",
    role: "Avaliação no Google · ★★★★★",
  },
  {
    quote: "Excelentes profissionais, entrega rápida e com ótimo preço. Indico bastante!",
    highlight: "entrega rápida e com ótimo preço",
    author: "Jonatas Franklin",
    role: "Avaliação no Google · ★★★★★",
  },
  {
    quote: "Atendimento excelente e preço justo. Instalação feita na hora marcada. Recomendo.",
    highlight: "Instalação feita na hora marcada",
    author: "Ruan Costa",
    role: "Avaliação no Google · ★★★★★",
  },
  {
    quote: "O atendimento é de primeira. O funcionário bem educado fez todo trabalho com eficiência.",
    highlight: "O atendimento é de primeira",
    author: "João Damasio",
    role: "Avaliação no Google · ★★★★★",
  },
  {
    quote: "Equipe super atenciosa e competente!",
    highlight: "super atenciosa e competente",
    author: "Sérgio de Farias Oliveira",
    role: "Avaliação no Google · ★★★★★",
  },
  {
    quote:
      "Meu carro parou no meio da avenida e eu não sabia o que fazer. Chamei a Junior Baterias e em menos de 40 minutos o técnico chegou. Trocou a bateria super rápido e aceitou cartão. Recomendo demais!",
    highlight: "em menos de 40 minutos o técnico chegou",
    author: "Wesley",
    role: "Motorista de App",
  },
  {
    quote:
      "Achei que o problema era o motor de arranque, mas o técnico fez os testes na hora e viu que era só a bateria mesmo. Gostei muito da transparência e o preço da Moura estava ótimo.",
    highlight: "Gostei muito da transparência",
    author: "Fernanda",
    role: "Cliente",
  },
];

/* Intro: battery photos fly out of a 3D tunnel toward the viewer while the logo
 * appears, then the overlay fades away (~1.4s). Pure CSS so it also runs in the
 * static HTML export. Cards sit on golden-angle positions around the centre. */
const INTRO_NAMES = ["moura", "kondor-vermelha", "zetta", "mg3", "kondor-branca"];
const INTRO_CARDS = INTRO_NAMES.map((name, i) => {
  const angle = i * 137.5 * (Math.PI / 180);
  const rx = 28 + (i % 3) * 8;
  const ry = 26 + (i % 2) * 9;
  return {
    name,
    x: +(Math.cos(angle) * rx).toFixed(2),
    y: +(Math.sin(angle) * ry).toFixed(2),
    r: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    d: +(i * 0.06).toFixed(2),
  };
});

function Intro() {
  return (
    <div className="jb-intro" aria-hidden>
      <div className="jb-intro-tunnel">
        {INTRO_CARDS.map((c, i) => (
          <img
            key={i}
            src={`/sites/junior-baterias/intro/${c.name}.webp`}
            alt=""
            style={{ "--x": `${c.x}vw`, "--y": `${c.y}vh`, "--r": `${c.r}deg`, "--d": `${c.d}s` } as CSSProperties}
          />
        ))}
      </div>
      <img className="jb-intro-logo" src="/sites/junior-baterias/logo-light.webp" alt="" width={400} height={382} />
    </div>
  );
}

function WhatsAppIcon({ className = "q-wa-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    </svg>
  );
}

function Header() {
  return (
    <header className="q-header">
      <a href="#inicio" className="q-logo" aria-label="Júnior Bateria">
        <img src="/sites/junior-baterias/logo-dark.webp" alt="Júnior Bateria" width={400} height={382} />
      </a>
      <nav className="q-nav">
        <a href="#como-funciona">Como funciona</a>
        <a href="#atendimento">Atendimento</a>
        <a href="#solucoes">Soluções</a>
        <a href="#depoimentos">Depoimentos</a>
        <a href="#endereco">Endereço</a>
      </nav>
      <a className="q-btn-pill" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
        PEDIR BATERIA ↗
      </a>
    </header>
  );
}

function CtaRow({ className = "", secondary = true }: { className?: string; secondary?: boolean }) {
  return (
    <div className={`q-cta-row ${className}`}>
      <a className="q-btn q-btn-solid" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
        <span className="q-star" aria-hidden />
        Pedir bateria agora →
      </a>
      {secondary && (
        <a className="q-btn q-btn-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
          <span className="q-star slow" aria-hidden />
          <WhatsAppIcon />
          Falar no WhatsApp
        </a>
      )}
    </div>
  );
}

function Hero() {
  return (
    <TiltedGridHero
      id="inicio"
      images={BATTERY_IMAGES}
      className="q-hero q-hero-light q-hero-tilted"
      axis={50}
      tileHeight={28}
      aspectRatio={4 / 3}
      gap={8}
      curve={55}
      fade={10}
      speed={4}
    >
      <Header />
      <div className="q-hero-tilted-content">
        <h1 className="q-h1-in">
          Seu Socorro de Bateria
          <span className="q-grad">em Maceió está aqui!</span>
        </h1>
        <div>
          <p className="q-enter d1">
            Júnior Baterias leva uma nova bateria em até 30min para você!
          </p>
          <CtaRow className="q-enter d2" />
        </div>
      </div>
    </TiltedGridHero>
  );
}

function Trust() {
  const items = [
    { icon: Gauge, text: "Teste na hora" },
    { icon: Wrench, text: "Troca no local" },
    { icon: MapPin, text: "Atendimento em toda Maceió" },
    { icon: BadgeCheck, text: "Melhores marcas do mercado" },
  ];
  return (
    <div className="jb-trust">
      {items.map(({ icon: Icon, text }) => (
        <span key={text}>
          <Icon size={20} aria-hidden />
          {text}
        </span>
      ))}
    </div>
  );
}

function SectionHead({ title, sub, body, eyebrow }: { title: string; sub: string; body?: string; eyebrow?: string }) {
  return (
    <div className="q-section-head">
      <div>
        {eyebrow && <span className="jb-eyebrow">{eyebrow}</span>}
        <h2>
          {title}
          <span>{sub}</span>
        </h2>
      </div>
      {body && <p>{body}</p>}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: MessageCircle, title: "Você chama.", text: "Manda sua localização e o modelo do carro no WhatsApp." },
    { icon: Truck, title: "Chegamos com a bateria.", text: "Levamos a bateria até onde seu carro está, em Maceió, em até 30 minutos." },
    { icon: BatteryCharging, title: "Testamos e trocamos.", text: "Testamos a bateria atual, trocamos se precisar e você segue." },
  ];
  return (
    <section className="q-section" id="como-funciona">
      <div className="q-container">
        <SectionHead
          eyebrow="Como funciona"
          title="Do pedido à troca,"
          sub="sem sair do lugar."
          body="Você chama no WhatsApp, a gente vai até você. O processo é esse."
        />
        <ol className="jb-steps">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li className="jb-step" key={title}>
              <div className="jb-step-top">
                <span className="jb-icon">
                  <Icon size={26} aria-hidden />
                </span>
                <span className="jb-step-num">0{i + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Service() {
  const benefits = [
    {
      icon: Truck,
      title: "Entrega e Instalação",
      text: "Não saia de casa. Levamos a bateria até você em Maceió e região. A instalação é feita na hora por nossos técnicos, sem custo adicional.",
    },
    {
      icon: BadgeCheck,
      title: "Marcas Originais",
      text: "Trabalhamos apenas com baterias de primeira linha (Moura, Mg3, Kondor) com selo do Inmetro e garantia total de fábrica.",
    },
    {
      icon: Clock,
      title: "Socorro Rápido",
      text: "Atendimento estendido de Segunda a Sexta até as 22h. Chegamos rápido para você não perder seu compromisso.",
    },
    {
      icon: Zap,
      title: "Check-up Elétrico",
      text: "Antes de trocar, testamos seu alternador e motor de arranque gratuitamente. Garantimos que o problema seja resolvido na raiz.",
    },
  ];
  return (
    <section className="q-section" id="atendimento">
      <div className="q-container">
        <SectionHead
          eyebrow="Atendimento"
          title="Atendemos onde"
          sub="você estiver."
          body="Na rua, no trabalho ou em casa, a gente vai até o seu carro."
        />
        <div className="jb-benefits">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div className="jb-benefit" key={title}>
              <span className="jb-icon">
                <Icon size={24} aria-hidden />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="jb-brands" id="marcas">
        <p className="jb-brands-label">Marcas que trabalhamos</p>
        <div className="jb-marquee">
          <div className="jb-marquee-track">
            {[0, 1].map((copy) =>
              BRAND_LOGOS.map((b) => (
                <span className="jb-brand-chip" key={`${copy}-${b.name}`} aria-hidden={copy === 1 || undefined}>
                  {b.src ? <img src={b.src} alt={copy === 0 ? b.name : ""} /> : <b>{b.name.toUpperCase()}</b>}
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Fleet() {
  return (
    <section className="q-section jb-light" id="frota">
      <div className="q-container jb-fleet">
        <div>
          <span className="jb-eyebrow">Não precisa rebocar</span>
          <h2 className="jb-fleet-title">
            Nossa Frota vai até você!
            <span>Agilidade total na entrega e instalação</span>
          </h2>
          <p className="jb-fleet-text">
            Não importa onde seu veículo parou. Nossa equipe está equipada para chegar rapidamente em qualquer bairro de
            Maceió. Realizamos testes no sistema elétrico, trocamos a bateria com segurança e garantimos que você siga
            viagem sem preocupações.
          </p>
          <div className="jb-stats">
            <div>
              <strong>
                40<small>MIN</small>
              </strong>
              <span>tempo médio de chegada</span>
            </div>
            <div>
              <strong>
                100<small>%</small>
              </strong>
              <span>Cobertura em toda Maceió</span>
            </div>
          </div>
          <CtaRow secondary={false} />
        </div>

        <div className="jb-route" aria-hidden>
          <div className="jb-route-map">
            <div className="jb-route-road">
              <span className="jb-route-truck">
                <Truck size={28} />
              </span>
            </div>
            <div className="jb-route-car">
              <span className="jb-route-pin">
                <MapPin size={18} />
              </span>
              <Car size={34} />
              <small>Seu carro</small>
            </div>
            <div className="jb-route-team">
              <Truck size={18} />
              <small>Nossa equipe</small>
            </div>
          </div>
          <ul className="jb-route-list">
            <li className="no">
              <CircleX size={20} /> Chamar reboque
            </li>
            <li className="no">
              <CircleX size={20} /> Esperar a oficina abrir
            </li>
            <li className="yes">
              <CircleCheck size={20} /> A bateria vai até você
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  const solutions = [
    {
      icon: Wrench,
      title: "Instalação Grátis",
      text: "Técnicos treinados para realizar a troca da bateria sem desconfigurar o computador de bordo ou o sistema elétrico do seu veículo.",
    },
    {
      icon: Zap,
      title: "Check-up Elétrico",
      text: "Antes de trocar, testamos gratuitamente seu alternador e motor de arranque para garantir que o problema não volte a acontecer.",
    },
    {
      icon: ShieldCheck,
      title: "Produtos Originais",
      text: "Trabalhamos apenas com baterias novas e com selo do Inmetro. Revenda autorizada Moura, Mg3 e Kondor com garantia total.",
    },
  ];
  const checks = ["Bateria", "Alternador", "Motor de arranque"];
  return (
    <section className="q-section" id="solucoes">
      <div className="q-container">
        <SectionHead eyebrow="Soluções" title="Soluções" sub="Completas." />
        <div className="jb-solutions">
          <div className="jb-tester">
            <div className="jb-tester-head">
              <span className="jb-icon">
                <Gauge size={24} aria-hidden />
              </span>
              <span>Check-up elétrico</span>
            </div>
            <h3>
              Você vê o teste <span>antes de pagar pela troca.</span>
            </h3>
            <p>A gente testa a bateria que está no carro. Se ela ainda estiver boa, a gente te fala.</p>
            <ul className="jb-tester-rows" aria-hidden>
              {checks.map((c, i) => (
                <li key={c} style={{ animationDelay: `${i * 0.7}s` }}>
                  <span>{c}</span>
                  <i style={{ animationDelay: `${i * 0.7}s` }} />
                  <CircleCheck size={18} style={{ animationDelay: `${i * 0.7}s` }} />
                </li>
              ))}
            </ul>
          </div>
          <div className="jb-solution-list">
            {solutions.map(({ icon: Icon, title, text }) => (
              <div className="jb-solution" key={title}>
                <span className="jb-icon">
                  <Icon size={22} aria-hidden />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    Fale Conosco →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="q-section jb-light" id="depoimentos">
      <div className="q-container jb-testi">
        <div>
          <span className="jb-eyebrow">Depoimentos</span>
          <h2 className="jb-fleet-title">
            O que dizem
            <span>nossos Clientes</span>
          </h2>
          <a className="jb-google" href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">
            <strong>4,6</strong>
            <span>
              <span className="jb-stars" aria-label="4,6 de 5 estrelas">★★★★★</span>
              <small>18 avaliações no Google · Ver avaliações →</small>
            </span>
          </a>
        </div>
        <HighlightTestimonialSection
          testimonials={TESTIMONIALS}
          interval={6000}
          eyebrow="Avaliações de clientes"
          className="jb-testi-widget"
        />
      </div>
    </section>
  );
}

function Location() {
  return (
    <section className="q-section" id="endereco">
      <div className="q-container jb-location">
        <div>
          <span className="jb-eyebrow">Endereço</span>
          <h2 className="jb-loc-title">
            Onde estamos
            <span>em Maceió.</span>
          </h2>
          <div className="jb-address">
            <span className="jb-icon">
              <MapPin size={24} aria-hidden />
            </span>
            <div>
              <strong>{ADDRESS_LINE}</strong>
              <span>{ADDRESS_CITY}</span>
            </div>
          </div>
          <div className="q-cta-row jb-loc-actions">
            <a className="q-btn q-btn-solid" href={MAP_DIRECTIONS} target="_blank" rel="noopener noreferrer">
              <Navigation size={20} aria-hidden />
              Como chegar
            </a>
            <a className="q-btn q-btn-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <div className="jb-map">
          <iframe
            src={MAP_EMBED}
            title="Mapa: Júnior Bateria, Rua José Vieira, 107 – Tabuleiro dos Martins, Maceió"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="q-final">
      <h2>
        SEU CARRO NÃO LIGA?
        <span>RESOLVEMOS AGORA!</span>
      </h2>
      <p>Não espere até amanhã. Nossa equipe está pronta para levar e instalar sua bateria nova em minutos, onde você estiver.</p>
      <CtaRow />
    </section>
  );
}

function Footer() {
  return (
    <footer className="q-footer">
      <div className="q-container q-footer-simple">
        <img className="q-footer-logo" src="/sites/junior-baterias/logo-light.webp" alt="Júnior Bateria" width={400} height={382} />
        <span>© Junior Baterias · Maceió, AL</span>
        <span>CNPJ 69.935.810/0001-36</span>
      </div>
    </footer>
  );
}

export function JuniorBateriasPage() {
  return (
    <div className="qronos">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_LD) }} />
      <Intro />
      <Hero />
      <Trust />
      <HowItWorks />
      <Service />
      <Fleet />
      <Solutions />
      <Testimonials />
      <Location />
      <FinalCta />
      <Footer />
    </div>
  );
}
