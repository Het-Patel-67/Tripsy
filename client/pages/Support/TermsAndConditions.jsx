const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-dm       { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up   { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.12s; }
  .fade-up-3 { animation-delay: 0.19s; }

  .prose-section {
    border-left: 2px solid rgba(217,119,6,0.25);
    padding-left: 1.25rem;
    margin-bottom: 2rem;
  }
  .prose-section:hover {
    border-left-color: rgba(217,119,6,0.6);
    transition: border-color 0.2s ease;
  }
`;

const LAST_UPDATED = "June 1, 2025";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By creating an account or using Tripsy in any way, you confirm that you have read, understood, and agreed to these Terms and Conditions.",
      "If you do not agree to these terms, please do not use Tripsy.",
      "We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance.",
    ],
  },
  {
    title: "2. Use of the Service",
    content: [
      "Tripsy is a trip planning tool that generates personalised itineraries using third-party data sources including the Google Search API via SerpAPI.",
      "You must be at least 13 years old to use Tripsy.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree not to use Tripsy for any unlawful purpose or in a way that could damage, disable, or impair the service.",
      "You may not attempt to bypass usage limits, scrape data, or reverse-engineer any part of Tripsy.",
    ],
  },
  {
    title: "3. Free Usage Limits",
    content: [
      "Tripsy currently offers itinerary generation free of charge, subject to a weekly limit of 2 generations per account.",
      "This limit exists to manage costs associated with third-party APIs. We reserve the right to adjust limits at any time.",
      "Attempting to circumvent limits by creating multiple accounts is a violation of these terms and may result in account suspension.",
    ],
  },
  {
    title: "4. Accuracy of Information",
    content: [
      "Itineraries, hotel recommendations, and place information are generated from third-party sources and may not always be accurate, complete, or up to date.",
      "Tripsy does not guarantee the availability, pricing, or quality of any place, hotel, or attraction shown.",
      "Always verify important details (opening hours, prices, bookings) independently before travelling.",
      "Tripsy is a planning aid — it is not a substitute for your own research and judgment.",
    ],
  },
  {
    title: "5. Intellectual Property",
    content: [
      "The Tripsy name, logo, design, and software are the intellectual property of Tripsy and may not be reproduced without permission.",
      "Itineraries you generate are for your personal, non-commercial use.",
      "Place data, images, and descriptions are sourced from third parties (Google, Cloudinary, SerpAPI) and are subject to their respective terms.",
    ],
  },
  {
    title: "6. Account Termination",
    content: [
      "You may delete your account at any time by contacting us.",
      "We reserve the right to suspend or terminate accounts that violate these terms, abuse the service, or engage in fraudulent behaviour.",
      "Upon termination, your saved itineraries and account data will be deleted.",
    ],
  },
  {
    title: "7. Disclaimer of Warranties",
    content: [
      "Tripsy is provided 'as is' without warranties of any kind, either express or implied.",
      "We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.",
      "We are not responsible for any loss or damage resulting from your use of — or inability to use — Tripsy.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, Tripsy and its creators shall not be liable for any indirect, incidental, special, or consequential damages.",
      "Our total liability to you for any claim arising from these terms or your use of Tripsy shall not exceed the amount you paid us in the past 12 months (which, for free accounts, is ₹0).",
    ],
  },
  {
    title: "9. Governing Law",
    content: [
      "These terms are governed by the laws of India.",
      "Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of India.",
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <>
      <style>{styles}</style>
      <div className="font-dm min-h-screen bg-[#F5EFE6] text-[#1C1917]">

        {/* ── Hero banner ── */}
        <div
          className="relative overflow-hidden px-8 pt-24 pb-12"
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
                "radial-gradient(ellipse at 80% 40%, rgba(14,165,233,0.1) 0%, transparent 50%), radial-gradient(ellipse at 15% 60%, rgba(217,119,6,0.15) 0%, transparent 45%)",
            }}
          />
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute right-12 top-12 h-44 w-44 rounded-full border border-amber-500/10" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-sm">
              <a href="/" className="text-white/35 transition-colors hover:text-white/60">Home</a>
              <span className="text-white/20">/</span>
              <span className="text-amber-400/80">Terms & Conditions</span>
            </div>
            <span className="mb-4 inline-block rounded-full border border-amber-400/35 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
              Legal
            </span>
            <h1 className="font-playfair fade-up text-4xl font-bold text-white md:text-5xl">
              Terms &amp; <em className="italic text-amber-400">Conditions</em>
            </h1>
            <p className="fade-up fade-up-1 mt-3 text-sm text-white/45">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="mx-auto max-w-3xl px-6 py-14 pb-24">

          {/* Intro card */}
          <div className="fade-up fade-up-2 mb-10 rounded-2xl border border-sky-200 bg-sky-50 px-6 py-5">
            <p className="text-sm leading-relaxed text-sky-900">
              These Terms and Conditions govern your use of <strong>Tripsy</strong>, a trip planning
              platform. By using Tripsy you agree to be bound by these terms. Please read them carefully
              before using the service.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, i) => (
            <div key={i} className={`fade-up prose-section fade-up-${Math.min(i + 2, 6)}`}>
              <h2 className="font-playfair mb-3 text-lg font-bold text-[#1C1917]">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.content.map((line, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-stone-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Footer note */}
          <div className="mt-10 rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] px-6 py-5 text-center">
            <p className="text-sm text-stone-400">
              Questions about these terms?{" "}
              <a href="/contact" className="font-semibold text-amber-600 hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}