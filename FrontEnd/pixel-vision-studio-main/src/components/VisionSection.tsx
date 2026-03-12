import vision1 from "@/assets/vision1.jpg";
import vision2 from "@/assets/vision2.jpg";
import vision3 from "@/assets/vision3.jpg";
import ScrollReveal from "@/components/ScrollReveal";

const images = [vision1, vision2, vision3];

const visionData = [
  { id: 1, number: "01", title: "Face Challenges", description: "The PICSEL committee envisions empowering engineering students to confidently navigate the challenges encountered throughout their academic journey." },
  { id: 2, number: "02", title: "Culture of Innovation", description: "The PICSEL committee aims to foster a culture of innovation among students by providing opportunities for research, idea exploration, and peer collaboration." },
  { id: 3, number: "03", title: "Diversity", description: "The PICSEL committee is dedicated to promoting inclusivity within the student community. Our vision is to cultivate an environment where students from all backgrounds thrive." },
];

const VisionSection = () => {
  return (
    <section className="relative bg-background px-4 pt-10 pb-0 sm:px-6 sm:pt-12 md:px-10 lg:px-16">
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <ScrollReveal scale>
          <div className="flex min-h-[35vh] sm:min-h-[45vh] md:min-h-[60vh] flex-col items-center justify-center text-center">
            <span className="mb-4 sm:mb-8 rounded-full border border-border px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-[2px] sm:tracking-[3px] text-muted-foreground font-heading">
              The Future
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold md:text-7xl lg:text-8xl text-foreground">
              OUR VISION
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              Building the future, one pixel at a time.
            </p>
          </div>
        </ScrollReveal>

        {/* Sticky Cards */}
        <div className="relative mx-auto max-w-[1300px]">
          {visionData.map((item, index) => (
            <div
              key={item.id}
              className="sticky mb-[4vh] sm:mb-[6vh] overflow-hidden rounded-2xl sm:rounded-card border border-border bg-card shadow-card h-[55vh] sm:h-[70vh]"
              style={{
                top: `calc(12vh + ${index * 24}px)`,
              }}
            >
              <div className="grid h-full grid-cols-1 md:grid-cols-[45%_55%]">
                <div className="border-b border-border p-5 sm:p-8 md:border-b-0 md:border-r md:p-12 lg:p-16">
                  <span className="font-heading text-3xl sm:text-5xl lg:text-6xl text-primary font-bold">
                    {item.number}
                  </span>
                  <h3 className="mt-2 sm:mt-4 font-heading text-xl sm:text-3xl lg:text-4xl text-foreground font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-2 sm:mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                  <div className="h-48 sm:h-64 md:h-full w-full overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[40px]">
                    <img
                      src={images[index]}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="h-[20vh] sm:h-[40vh] md:h-[60vh]" />
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
