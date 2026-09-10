import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Check, Menu, Upload, X } from "lucide-react";
import { z } from "zod";

import heroImage from "@/assets/private-automotive-hero.jpg";
import philosophyImage from "@/assets/private-automotive-philosophy.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Private Automotive | Exceptional Cars" },
      {
        name: "description",
        content: "A private automotive house for exceptional luxury cars, supercars and hypercars in Indonesia.",
      },
      { property: "og:title", content: "Private Automotive | Exceptional Cars" },
      {
        property: "og:description",
        content: "Exceptional cars, privately curated through discreet acquisition, sales and consignment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  whatsapp: z.string().trim().min(5, "Please enter a valid WhatsApp number.").max(30),
  email: z.string().trim().email("Please enter a valid email.").max(255),
  inquiry_type: z.enum(["acquire", "sell", "consignment", "general"]),
  message: z.string().trim().min(1, "Please tell us how we can assist.").max(2000),
});

type Inquiry = z.infer<typeof inquirySchema>;

const services = [
  { number: "01", title: "Acquisition", text: "Private sourcing of exceptional automobiles based on individual requirements." },
  { number: "02", title: "Sales", text: "Discreet representation of selected automobiles to qualified prospective buyers." },
  { number: "03", title: "Consignment", text: "Private-market representation for owners of exceptional automobiles." },
];

const steps = [
  { number: "01", title: "Discover", text: "Understanding what you are looking for." },
  { number: "02", title: "Source", text: "Accessing selected automobiles through our network." },
  { number: "03", title: "Connect", text: "Arranging a discreet introduction and private viewing." },
];

function useBrandLogo() {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    setLogo(window.localStorage.getItem("private-automotive-logo"));
  }, []);

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !["image/png", "image/svg+xml"].includes(file.type) || file.size > 2_000_000) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      window.localStorage.setItem("private-automotive-logo", reader.result);
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return { logo, upload };
}

function BrandMark({ logo, className = "h-8 max-w-52" }: { logo: string | null; className?: string }) {
  if (logo) return <img src={logo} alt="Private Automotive" className={`${className} w-auto object-contain`} />;
  return <span className="brand-wordmark">Private Automotive</span>;
}

function LogoUpload({ upload, compact = false }: { upload: (event: ChangeEvent<HTMLInputElement>) => void; compact?: boolean }) {
  return (
    <label className={compact ? "logo-upload logo-upload-compact" : "logo-upload"}>
      <Upload aria-hidden="true" />
      <span>{compact ? "Official logo" : "Upload official logo"}</span>
      <input type="file" accept="image/png,image/svg+xml" onChange={upload} className="sr-only" />
    </label>
  );
}

function Index() {
  const { logo, upload } = useBrandLogo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = inquirySchema.safeParse(Object.fromEntries(form.entries()));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setSending(true);
    const { error: submitError } = await supabase.from("private_inquiries").insert(parsed.data);
    setSending(false);
    if (submitError) {
      setError("Your inquiry could not be sent. Please try again.");
      return;
    }
    formRef.current?.reset();
    setSent(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <div className="loading-screen" aria-hidden="true">
        <BrandMark logo={logo} className="h-16 max-w-72" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6">
        <nav className="glass-nav mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-7" aria-label="Main navigation">
          <a href="#top" aria-label="Private Automotive home" className="flex min-w-0 items-center">
            <BrandMark logo={logo} />
          </a>
          <div className="hidden items-center gap-9 md:flex">
            <a className="nav-link" href="#about">About</a>
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#contact">Contact</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <LogoUpload upload={upload} compact />
            <Button asChild className="h-10 rounded-full px-6 text-[11px] uppercase tracking-[0.18em]">
              <a href="#contact">Private inquiry</a>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </nav>
        {menuOpen && (
          <div className="glass-panel mx-auto mt-2 max-w-7xl p-6 md:hidden">
            <div className="flex flex-col gap-5">
              <BrandMark logo={logo} className="h-10 max-w-56" />
              {[["About", "#about"], ["Services", "#services"], ["Contact", "#contact"]].map(([label, href]) => (
                <a key={href} href={href} onClick={closeMenu} className="nav-link border-b border-border pb-4">{label}</a>
              ))}
              <LogoUpload upload={upload} />
              <Button asChild className="h-12 rounded-full uppercase tracking-[0.18em]"><a href="#contact" onClick={closeMenu}>Private inquiry</a></Button>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="hero-section relative flex min-h-[96svh] items-end">
        <img src={heroImage} alt="Sculptural automotive silhouette in a private studio" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-shade absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-36 md:px-10 md:pb-20">
          <div className="hero-content max-w-4xl">
            <div className="mb-10 flex min-h-16 items-center"><BrandMark logo={logo} className="h-20 max-w-[18rem] md:h-24 md:max-w-md" /></div>
            <p className="eyebrow">Private Automotive · Indonesia</p>
            <h1 className="mt-5 text-5xl font-light uppercase leading-[0.98] md:text-8xl lg:text-9xl">Exceptional Cars.<br />Privately Curated.</h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-muted-foreground md:text-base">A private automotive house for exceptional luxury cars, supercars and hypercars.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-full px-8 uppercase tracking-[0.18em]"><a href="#contact">Private inquiry <ArrowRight /></a></Button>
              <Button asChild variant="outline" size="lg" className="h-13 rounded-full border-border bg-transparent px-8 uppercase tracking-[0.18em]"><a href="#about">Discover more <ArrowDown /></a></Button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-space border-t border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="reveal grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <p className="eyebrow">Our distinction</p>
              <h2 className="display-title mt-6">Not a showroom.<br />A private automotive house.</h2>
            </div>
            <p className="body-copy">Private Automotive connects discerning collectors with exceptional automobiles through a discreet, carefully curated approach.</p>
          </div>

          <div id="services" className="mt-28 md:mt-40">
            <div className="reveal mb-10 flex items-end justify-between border-b border-border pb-6">
              <h2 className="text-2xl font-light uppercase md:text-3xl">Private services</h2>
              <span className="eyebrow hidden sm:block">By appointment only</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {services.map((service, index) => (
                <article key={service.number} className="service-card reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                  <span className="service-number">{service.number}</span>
                  <h3 className="mt-20 text-xl font-light uppercase md:mt-28">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="philosophy-section relative min-h-[78svh] overflow-hidden">
        <img src={philosophyImage} alt="Abstract carbon-fiber automotive body detail" width={1920} height={1088} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="philosophy-shade absolute inset-0" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-7xl items-center px-6 py-24 md:px-10">
          <div className="glass-panel reveal max-w-3xl p-7 md:p-12">
            <p className="eyebrow">Our philosophy</p>
            <h2 className="display-title mt-6">Curated.<br />Discreet.<br />Exceptional.</h2>
            <p className="body-copy mt-8 max-w-xl">Every automobile has its own character. Our approach is simple: find exceptional cars, connect them with the right people, and make the process as private as the automobile itself.</p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">The experience</p>
            <h2 className="display-title mt-6">A considered process.<br />A private connection.</h2>
          </div>
          <div className="mt-16 grid border-y border-border md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.number} className="reveal process-step" style={{ transitionDelay: `${index * 100}ms` }}>
                <span className="service-number">{step.number}</span>
                <h3 className="mt-12 text-xl font-light uppercase">{step.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-space border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="reveal">
            <p className="eyebrow">Private inquiry</p>
            <h2 className="display-title mt-6">Looking for something exceptional?</h2>
            <p className="body-copy mt-7 max-w-lg">Whether you are searching for a particular automobile or looking to privately represent your vehicle, speak with Private Automotive.</p>
            <div className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
              <p>Indonesia · By Appointment Only</p>
              <a href="https://instagram.com/private.automotive" target="_blank" rel="noreferrer" className="mt-3 inline-block text-foreground">@private.automotive</a>
            </div>
          </div>

          <form ref={formRef} onSubmit={submitInquiry} className="glass-panel reveal grid gap-5 p-6 md:grid-cols-2 md:p-10">
            <label className="field-label">Name<Input name="name" maxLength={100} required placeholder="Your name" className="field-input" /></label>
            <label className="field-label">WhatsApp<Input name="whatsapp" maxLength={30} required placeholder="+62" className="field-input" /></label>
            <label className="field-label md:col-span-2">Email<Input name="email" type="email" maxLength={255} required placeholder="you@email.com" className="field-input" /></label>
            <label className="field-label md:col-span-2">Inquiry type
              <select name="inquiry_type" defaultValue="acquire" className="field-select">
                <option value="acquire">I'm looking to acquire</option>
                <option value="sell">I'm looking to sell</option>
                <option value="consignment">I'm interested in consignment</option>
                <option value="general">General inquiry</option>
              </select>
            </label>
            <label className="field-label md:col-span-2">Message<Textarea name="message" maxLength={2000} required placeholder="Tell us what you are looking for" className="field-input min-h-32 resize-none" /></label>
            <div className="md:col-span-2">
              {error && <p className="mb-4 text-sm text-destructive" role="alert">{error}</p>}
              {sent && <p className="mb-4 flex items-center gap-2 text-sm text-success" role="status"><Check className="size-4" /> Your private inquiry has been received.</p>}
              <Button disabled={sending} type="submit" size="lg" className="h-13 w-full rounded-full uppercase tracking-[0.18em]">{sending ? "Sending…" : "Submit private inquiry"}</Button>
            </div>
          </form>
        </div>
      </section>

      <section className="final-cta border-t border-border px-6 py-24 text-center md:py-32">
        <div className="reveal mx-auto flex max-w-3xl flex-col items-center">
          <div className="mb-10 flex min-h-16 items-center"><BrandMark logo={logo} className="h-20 max-w-xs md:h-24 md:max-w-md" /></div>
          <p className="eyebrow">Private Automotive</p>
          <h2 className="mt-5 text-4xl font-light uppercase leading-tight md:text-6xl">Exceptional Cars.<br />Privately Curated.</h2>
          <Button asChild size="lg" className="mt-10 h-13 rounded-full px-9 uppercase tracking-[0.18em]"><a href="tel:+6281996425517">Contact Private Automotive</a></Button>
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">Indonesia · By Appointment Only</p>
          <a className="mt-3 text-sm text-foreground" href="https://instagram.com/private.automotive" target="_blank" rel="noreferrer">@private.automotive</a>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <BrandMark logo={logo} className="h-10 max-w-64" />
            <p className="mt-4 text-xs text-muted-foreground">Exceptional Cars. Privately Curated.</p>
          </div>
          <div className="text-xs leading-6 text-muted-foreground md:text-right">
            <p>© 2026 Private Automotive</p><p>+62 819 9642 5517 · Indonesia</p><p>@private.automotive</p>
          </div>
        </div>
      </footer>
    </main>
  );
}