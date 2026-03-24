"use client"
const sponsors = [
  { name: "Google", logo: "" },
  { name: "Microsoft", logo: "" },
  { name: "GitHub", logo: "" },
  { name: "Notion", logo: "" },
  { name: "Vercel", logo: "" },
  { name: "AWS", logo: "" },
  { name: "DigitalOcean", logo: "" },
  { name: "JetBrains", logo: "" },
];

const SponsorsSection = () => {
  return (
    <section className="relative bg-background px-4 py-14 sm:px-6 sm:py-20 md:px-10 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 sm:mb-12 text-center">
          <span className="mb-3 sm:mb-4 inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[2px] sm:tracking-[3px] text-primary font-heading">
            Ecosystem
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Our Sponsors & Partners
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-lg text-sm sm:text-base text-muted-foreground">
            Empowering our vision through their generous support and collaboration.
          </p>
        </div>

        {/* Infinite scroll marquee */}
        <div className="relative overflow-hidden py-4 sm:py-8">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="flex animate-[marquee_20s_linear_infinite] gap-4 sm:gap-8">
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <div
                key={index}
                className="flex h-14 w-28 sm:h-20 sm:w-44 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-border/50 bg-card/50 transition-all hover:border-primary/30 hover:shadow-glow"
              >
                {sponsor.logo ? (
                  <img src={sponsor.logo} alt={sponsor.name} className="h-6 sm:h-8 w-auto opacity-40 grayscale transition-all hover:opacity-80 hover:grayscale-0" loading="lazy" />
                ) : (
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground/60 hover:text-foreground transition-colors font-heading">
                    {sponsor.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-dashed border-border/50 bg-card/30 px-5 sm:px-8 py-4 sm:py-5">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-foreground">Want to sponsor PICSEL?</p>
              <p className="text-xs text-muted-foreground">Partner with the best tech community at KDKCE</p>
            </div>
            <a href="mailto:picsel@kdkce.edu" className="hidden md:block">
              <button className="valorant-btn-cyan text-xs py-2 px-4">Get in Touch</button>
            </a>
            <a href="mailto:picsel@kdkce.edu" className="md:hidden">
              <button className="btn-mobile-primary text-xs py-2 px-4">Contact</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
