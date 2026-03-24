"use client";

import { useState, useEffect } from "react";
import { Instagram, Linkedin, Github, Twitter } from "lucide-react";
import ProfileModal from "@/components/ProfileModal";
import AnimatedBackground from "@/components/AnimatedBackground";
import ScrollReveal from "@/components/ScrollReveal";
import { API } from "@/config/api";

const socialIconMap: Record<string, any> = {
  instagram: Instagram, linkedin: Linkedin, github: Github, twitter: Twitter,
};

interface TeamMember {
  id: number; name: string; role: string; description: string; mobile: string;
  email: string; tokenNo: number; imageUrl: string;
  socials: { linkedin: string; instagram: string; twitter: string };
}

const SocialRow = ({ social }: { social: Record<string, string> }) => (
  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2">
    {Object.entries(social || {}).map(([key, url]) => {
      const Icon = socialIconMap[key.toLowerCase()];
      if (!Icon || !url) return null;
      return (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
          className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-all hover:border-primary hover:text-primary">
          <Icon size={11} />
        </a>
      );
    })}
  </div>
);

const TeamPage = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(API.TEAM);
        if (res.ok) setTeam(await res.json());
      } catch (err) { console.error("Failed to fetch team:", err); }
      finally { setLoading(false); }
    };
    fetchTeam();
  }, []);

  const president = team.filter(m => m.tokenNo === 1);
  const coreTeam = team.filter(m => m.tokenNo === 2);
  const members = team.filter(m => m.tokenNo === 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Loading team...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background pb-mobile-nav pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-8 lg:px-16">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
      <div className="relative z-10">
        <ScrollReveal direction="up" scale>
          <div className="mb-8 sm:mb-12 text-center">
            <span className="mb-3 inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[3px] text-primary font-heading">The Squad</span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Our Team</h1>
            <p className="mx-auto mt-2 sm:mt-3 max-w-md text-sm sm:text-base text-muted-foreground">The passionate minds powering PICSEL Club.</p>
          </div>
        </ScrollReveal>

        {/* President(s) */}
        {president.length > 0 && (
          <ScrollReveal scale delay={100}>
            <div className="mx-auto mb-10 sm:mb-14 max-w-2xl">
              {president.map((p) => (
                <div key={p.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-8 md:p-10 transition-all hover:border-primary/30 hover:shadow-glow cursor-pointer active:scale-[0.99] mb-4"
                  onClick={() => setSelectedProfile(p)}>
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent-purple to-accent-red" />
                  <div className="flex flex-col items-center text-center md:flex-row md:text-left md:gap-8">
                    <div className="mb-4 sm:mb-6 h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full border-2 border-primary/30 bg-muted md:mb-0 md:h-32 md:w-32 flex-shrink-0">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl font-bold text-primary font-heading bg-primary/5">{p.name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <span className="mb-2 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary">{p.role}</span>
                      <h2 className="mt-2 font-heading text-xl sm:text-2xl text-foreground md:text-3xl font-bold">{p.name}</h2>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                      <SocialRow social={p.socials || {}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Core Team */}
        {coreTeam.length > 0 && (
          <div className="mx-auto mb-10 sm:mb-14 max-w-5xl">
            <h3 className="mb-5 sm:mb-6 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground font-heading">Core Team</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {coreTeam.map((member, index) => (
                <ScrollReveal key={member.id} delay={index * 80} direction="up">
                  <div onClick={() => setSelectedProfile(member)}
                    className="group overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-5 transition-all hover:border-primary/25 hover:shadow-glow cursor-pointer active:scale-[0.98]">
                    <div className="mx-auto mb-3 h-14 w-14 sm:h-18 sm:w-18 overflow-hidden rounded-full border border-border bg-muted">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg sm:text-xl font-bold text-muted-foreground group-hover:text-primary transition-colors font-heading">{member.name.charAt(0)}</div>
                      )}
                    </div>
                    <h3 className="text-center text-xs sm:text-sm font-bold text-foreground">{member.name}</h3>
                    <p className="text-center text-[10px] sm:text-xs font-medium text-primary mt-0.5">{member.role}</p>
                    <p className="mt-1.5 text-center text-[10px] sm:text-xs leading-relaxed text-muted-foreground line-clamp-2 hidden sm:block">{member.description}</p>
                    <SocialRow social={member.socials || {}} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Members */}
        {members.length > 0 && (
          <div className="mx-auto max-w-6xl mb-6 sm:mb-8">
            <h3 className="mb-4 sm:mb-6 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground font-heading">Members</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
              {members.map((member, index) => (
                <ScrollReveal key={member.id} delay={index * 40} direction="up">
                  <div onClick={() => setSelectedProfile(member)}
                    className="group flex flex-col items-center rounded-lg border border-border/50 bg-card/60 p-2.5 sm:p-4 transition-all hover:border-primary/20 hover:bg-card cursor-pointer active:scale-[0.97]">
                    <div className="mb-2 sm:mb-3 h-10 w-10 sm:h-14 sm:w-14 overflow-hidden rounded-full border border-border bg-muted">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors font-heading">{member.name.charAt(0)}</div>
                      )}
                    </div>
                    <h4 className="text-center text-[10px] sm:text-xs font-semibold text-foreground leading-tight">{member.name}</h4>
                    <p className="text-center text-[9px] sm:text-[10px] text-primary mt-0.5">{member.role}</p>
                    <div className="hidden sm:block"><SocialRow social={member.socials || {}} /></div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {team.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-heading font-bold">No team members found</p>
          </div>
        )}
      </div>
      <ProfileModal profile={selectedProfile ? { ...selectedProfile, image: selectedProfile.imageUrl, social: selectedProfile.socials } : null} onClose={() => setSelectedProfile(null)} />
    </div>
  );
};

export default TeamPage;
