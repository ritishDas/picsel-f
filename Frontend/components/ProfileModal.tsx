"use client"
import { X, Instagram, Linkedin, Github, Twitter, Mail, Phone } from "lucide-react";

interface Social {
  [key: string]: string;
}

interface ProfileData {
  name: string;
  role: string;
  description?: string;
  message?: string;
  image?: string;
  imageUrl?: string;
  email?: string;
  mobile?: string;
  social?: Social;
  socials?: Social;
  department?: string;
  specialization?: string;
}

interface ProfileModalProps {
  profile: ProfileData | null;
  onClose: () => void;
}

const iconMap: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
};

const ProfileModal = ({ profile, onClose }: ProfileModalProps) => {
  if (!profile) return null;

  const social = profile.social || profile.socials || {};
  const img = profile.image || profile.imageUrl || "";
  const initials = profile.name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md p-4" onClick={onClose}>
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-card animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative h-32 bg-gradient-to-br from-primary/20 via-accent-purple/10 to-card">
          <div className="absolute inset-0 bg-dot-pattern opacity-20" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/50 text-foreground backdrop-blur-sm transition-colors hover:bg-accent-red"
          >
            <X size={16} />
          </button>
          {/* Avatar overlapping */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-card bg-muted shadow-glow">
              {img ? (
                <img src={img} alt={profile.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary font-heading">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-16 pb-6 text-center">
          <span className="mb-1 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            {profile.role}
          </span>
          <h2 className="mt-2 text-xl font-bold text-foreground font-heading">{profile.name}</h2>

          {profile.department && (
            <p className="mt-1 text-xs text-muted-foreground">{profile.department}</p>
          )}
          {profile.specialization && (
            <p className="text-xs text-accent-yellow">{profile.specialization}</p>
          )}

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {profile.description || profile.message || ""}
          </p>

          {/* Contact */}
          <div className="mt-4 flex flex-col items-center gap-2">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-xs text-primary hover:underline">
                <Mail size={14} /> {profile.email}
              </a>
            )}
            {profile.mobile && (
              <a href={`tel:${profile.mobile}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
                <Phone size={14} /> {profile.mobile}
              </a>
            )}
          </div>

          {/* Social icons */}
          {Object.keys(social).length > 0 && (
            <div className="mt-5 flex justify-center gap-3">
              {Object.entries(social).map(([key, url]) => {
                if (!url || url === "#") return null;
                const Icon = iconMap[key.toLowerCase()];
                if (!Icon) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-glow"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
