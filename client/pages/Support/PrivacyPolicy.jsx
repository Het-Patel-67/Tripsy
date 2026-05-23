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

const LAST_UPDATED = "May 1, 2026";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "When you register, we collect your name, email address, and mobile number.",
      "When you generate an itinerary, we store your destination preferences, travel dates, and selected interests to personalise your experience.",
      "We collect usage data such as pages visited and features used to improve the service.",
      "We do not collect payment information — Tripsy is currently free to use.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To generate personalised trip itineraries based on your inputs.",
      "To save and display your itineraries under your account.",
      "To enforce fair-use limits (e.g. weekly generation quotas) and prevent abuse.",
      "To send important account-related emails such as password resets. We do not send marketing emails without your explicit consent.",
      "To analyse usage patterns and improve the quality of recommendations.",
    ],
  },
  {
    title: "3. Data Storage & Security",
    content: [
      "Your data is stored securely in MongoDB Atlas with encryption at rest.",
      "Passwords are hashed using bcrypt and are never stored in plain text.",
      "Authentication uses short-lived JWT access tokens and long-lived refresh tokens stored in httpOnly cookies, making them inaccessible to JavaScript.",
      "Place images are processed through Cloudinary, which applies its own security and access controls.",
      "We retain your account data for as long as your account is active. You may request deletion at any time.",
    ],
  },
  {
    title: "4. Third-Party Services",
    content: [
      "Tripsy uses the SerpAPI to fetch real-time place and hotel data from Google search results.",
      "Cloudinary is used to store and optimise place images.",
      "These services have their own privacy policies and we encourage you to review them.",
      "We do not sell your personal data to any third party.",
    ],
  },
  {
    title: "5. Cookies",
    content: [
      "We use httpOnly cookies to store your authentication tokens. These cookies are essential for the service to function and cannot be disabled without logging out.",
      "We do not use advertising cookies or third-party tracking cookies.",
      "You can clear cookies at any time through your browser settings, which will log you out of Tripsy.",
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      "You may request a copy of all personal data we hold about you.",
      "You may request correction of inaccurate data.",
      "You may request deletion of your account and all associated data.",
      "To exercise any of these rights, contact us at the email on our Contact page.",
    ],
  },
  {
    title: "7. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. When we do, we will update the 'Last updated' date at the top of this page.",
      "Continued use of Tripsy after changes are posted constitutes your acceptance of the revised policy.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <style>{styles}</style>
      <div className="font-dm min-h-screen bg-[#F5EFE6] text-[#1C1917]">

        {/* ── Hero banner ── */}
        <div
          className="relative overflow-hidden px-8 pt-24 pb-12"
          style={{ background: "linear-gradient(135deg, #1C1917 0%, #292524 60%, #1C3557 100%)" }}
        >
          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Amber glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 15% 60%, rgba(217,119,6,0.18) 0%, transparent 50%)",
            }}
          />
          {/* Rings */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute right-12 top-12 h-44 w-44 rounded-full border border-amber-500/10" />

          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-sm">
              <a href="/" className="text-white/35 transition-colors hover:text-white/60">Home</a>
              <span className="text-white/20">/</span>
              <span className="text-amber-400/80">Privacy Policy</span>
            </div>

            <span className="mb-4 inline-block rounded-full border border-amber-400/35 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
              Legal
            </span>
            <h1 className="font-playfair fade-up text-4xl font-bold text-white md:text-5xl">
              Privacy <em className="italic text-amber-400">Policy</em>
            </h1>
            <p className="fade-up fade-up-1 mt-3 text-sm text-white/45">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="mx-auto max-w-3xl px-6 py-14 pb-24">

          {/* Intro card */}
          <div className="fade-up fade-up-2 mb-10 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
            <p className="text-sm leading-relaxed text-amber-900">
              At <strong>Tripsy</strong>, your privacy matters. This policy explains what personal
              information we collect when you use our trip planning service, how we use it, and
              the choices you have. Please read it carefully.
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
              Questions about this policy?{" "}
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