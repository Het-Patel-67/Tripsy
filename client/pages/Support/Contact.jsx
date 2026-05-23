const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-dm       { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up   { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation-delay: 0.07s; }
  .fade-up-2 { animation-delay: 0.14s; }
  .fade-up-3 { animation-delay: 0.21s; }

  .contact-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .contact-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(28,25,23,0.1);
    border-color: rgba(217,119,6,0.4);
  }
`;

const CONTACT_EMAIL = "tripsy.contact@gmail.com";
const topics = [
  {
    icon: "🐛",
    title: "Bug Reports",
    body:  "Found something broken? Tell us exactly what happened and we'll fix it.",
    subject: "Bug Report — Tripsy",
  },
  {
    icon: "💡",
    title: "Feature Requests",
    body:  "Have an idea that would make Tripsy better? We'd love to hear it.",
    subject: "Feature Request — Tripsy",
  },
  {
    icon: "🔒",
    title: "Privacy & Data",
    body:  "Questions about your personal data, account deletion, or our privacy policy.",
    subject: "Privacy Inquiry — Tripsy",
  },
  {
    icon: "⚖️",
    title: "Legal & Terms",
    body:  "Questions about our Terms & Conditions or legal matters.",
    subject: "Legal Inquiry — Tripsy",
  },
  {
    icon: "🤝",
    title: "Partnerships",
    body:  "Interested in collaborating with or sponsoring Tripsy?",
    subject: "Partnership Inquiry — Tripsy",
  },
  {
    icon: "💬",
    title: "General",
    body:  "Anything else — we read every email and reply as soon as we can.",
    subject: "General Inquiry — Tripsy",
  },
];

const faqs = [
  {
    q: "How long does it take to get a reply?",
    a: "We aim to reply within 1–2 business days. Complex queries may take a little longer.",
  },
  {
    q: "Can I request my data to be deleted?",
    a: "Yes. Email us with the subject 'Data Deletion Request' and we will delete your account and all associated data within 7 days.",
  },
  {
    q: "Why is there a weekly generation limit?",
    a: "Itinerary generation uses paid third-party APIs (SerpAPI, Cloudinary). The limit of 2 per week helps us keep Tripsy free for everyone.",
  },
  {
    q: "I found a bug — what information should I include?",
    a: "Please include: what you were doing, what you expected to happen, what actually happened, your browser and device, and a screenshot if possible.",
  },
];

export default function Contact() {
  return (
    <>
      <style>{styles}</style>
      <div className="font-dm min-h-screen bg-[#F5EFE6] text-[#1C1917]">

        {/* ── Hero banner ── */}
        <div
          className="relative overflow-hidden px-8 pt-24 pb-14"
          style={{ background: "linear-gradient(135deg, #1C1917 0%, #292524 60%, #1C3557 100%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(217,119,6,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.1) 0%, transparent 40%)",
            }}
          />
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute right-12 top-12 h-44 w-44 rounded-full border border-amber-500/10" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm">
              <a href="/" className="text-white/35 transition-colors hover:text-white/60">Home</a>
              <span className="text-white/20">/</span>
              <span className="text-amber-400/80">Contact</span>
            </div>
            <span className="mb-4 inline-block rounded-full border border-amber-400/35 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
              Get in touch
            </span>
            <h1 className="font-playfair fade-up text-4xl font-bold text-white md:text-5xl">
              We'd love to{" "}
              <em className="italic text-amber-400">hear from you</em>
            </h1>
            <p className="fade-up fade-up-1 mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50">
              Whether you've spotted a bug, have a suggestion, or just want to say hello —
              drop us an email and we'll get back to you.
            </p>

            {/* Main email CTA */}
            <div className="fade-up fade-up-2 mt-8 flex justify-center">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-7 py-4 backdrop-blur-sm transition-all hover:border-amber-400/50 hover:bg-white/12"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-lg group-hover:bg-amber-500/30 transition-colors">
                  ✉️
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    Email us at
                  </p>
                  <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {CONTACT_EMAIL}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="mx-auto max-w-3xl px-6 py-14 pb-24">

          {/* What to email us about */}
          <div className="mb-14">
            <h2 className="font-playfair mb-2 text-2xl font-bold text-[#1C1917]">
              What can we help with?
            </h2>
            <p className="mb-8 text-sm text-stone-400">
              Click a topic to open a pre-filled email — no copy-pasting needed.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic, i) => (
                <a
                  key={i}
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(topic.subject)}`}
                  className="contact-card fade-up flex flex-col gap-3 rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-5 shadow-[0_2px_10px_rgba(28,25,23,0.05)]"
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                 
                  <div>
                    <h3 className="font-playfair mb-1 text-sm font-bold text-[#1C1917]">
                      {topic.title}
                    </h3>
                    <p className="text-[12px] leading-relaxed text-stone-500">{topic.body}</p>
                  </div>
                  <span className="mt-auto text-[11px] font-semibold text-amber-600">
                    Email us →
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E7DDD0]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-300">
              FAQs
            </span>
            <div className="h-px flex-1 bg-[#E7DDD0]" />
          </div>

          {/* FAQ accordion (static — no JS needed) */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] px-5 py-4 shadow-[0_1px_6px_rgba(28,25,23,0.04)] open:border-amber-200 transition-all"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-playfair text-sm font-bold text-[#1C1917]">
                    {faq.q}
                  </span>
                  <span className="shrink-0 text-amber-500 transition-transform group-open:rotate-45 text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-500 border-t border-[#E7DDD0] pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* Response time note */}
          <div className="mt-12 rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] px-6 py-5">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)" }}
              >
                ⏱️
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C1917]">Response time</p>
                <p className="text-[12px] leading-relaxed text-stone-400">
                  We typically reply within <strong className="text-amber-600">1–2 business days</strong>.
                  We read every email personally — no support tickets, no bots.
                </p>
              </div>
            </div>
          </div>

          {/* Links to other legal pages */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-[12px] text-stone-400">
            <a href="/privacy" className="hover:text-amber-600 transition-colors">Privacy Policy</a>
            <span className="text-stone-300">·</span>
            <a href="/terms" className="hover:text-amber-600 transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </>
  );
}