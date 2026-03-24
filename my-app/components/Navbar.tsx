"use client"
import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import picselLogo from "@/assets/picsel-logo.png";
import { Instagram, Linkedin, Github } from "lucide-react";

const menuItems = [
  { name: "Home", path: "/" },
  {
    name: "About",
    path: "/about",
    dropdown: [
      { name: "About Us", path: "/about", description: "Learn about our mission and team." },
      { name: "Contact", path: "/contact", description: "Get in touch with us." },
    ],
  },
  {
    name: "Events",
    path: "/events",
    dropdown: [
      { name: "Upcoming Events", path: "/events", description: "See what's next on our calendar." },
      { name: "Successful Events", path: "/xevents", description: "Browse our past events gallery." },
    ],
  },
  { name: "Team", path: "/team" },
  { name: "Faculty", path: "/faculty" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout>>();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleMouseEnter = (name: string) => {
    clearTimeout(leaveTimeout.current);
    const item = menuItems.find((i) => i.name === name);
    if (item?.dropdown) setActiveDropdown(name);
    else setActiveDropdown(null);
  };

  const handleMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const currentDropdown = menuItems.find((i) => i.name === activeDropdown)?.dropdown;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden md:block">
      <div className="flex items-center justify-center pt-5">
        <div
          className="flex items-center gap-5 rounded-full border border-border bg-card/80 px-4 py-2.5 backdrop-blur-xl shadow-card"
          onMouseLeave={handleMouseLeave}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={picselLogo} alt="PICSEL Club" className="h-9 w-9 rounded-full object-cover" />
            <div className="leading-none">
              <span className="block text-sm font-extrabold tracking-tight text-foreground font-heading">PICSEL</span>
              <span className="block text-[9px] font-medium uppercase tracking-[2px] text-muted-foreground">KDKCE</span>
            </div>
          </Link>

          {/* Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-full border border-border px-6 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 font-button tracking-wider ${isOpen ? "max-w-0 overflow-hidden opacity-0 px-0 border-0" : "opacity-100"
              }`}
          >
            MENU
          </button>

          {/* Nav links */}
          <div
            className={`flex items-center gap-1 overflow-hidden transition-all duration-500 ${isOpen ? "max-w-[700px] opacity-100" : "max-w-0 opacity-0"
              }`}
          >
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onMouseEnter={() => handleMouseEnter(item.name)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {item.name}
              </Link>
            ))}
            {/* Social icons in nav */}
            <div className="flex items-center gap-1 ml-2 border-l border-border pl-3">
              {[
                { icon: Instagram, url: "#" },
                { icon: Linkedin, url: "#" },
                { icon: Github, url: "#" },
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <s.icon size={15} />
                </a>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" /><path d="M6 6L18 18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop dropdown */}
      {currentDropdown && (
        <div
          className="absolute left-1/2 top-20 -translate-x-1/2 w-[500px] max-w-[90vw] rounded-2xl border border-border bg-card/95 p-5 backdrop-blur-xl shadow-card animate-[fadeIn_0.2s_ease-out]"
          onMouseEnter={() => clearTimeout(leaveTimeout.current)}
          onMouseLeave={handleMouseLeave}
        >
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground font-heading">{activeDropdown}</h4>
          <div className="grid grid-cols-2 gap-2">
            {currentDropdown.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="rounded-xl p-4 transition-colors hover:bg-muted/50"
              >
                <span className="block text-sm font-medium text-foreground">{item.name}</span>
                <span className="block text-xs text-muted-foreground mt-1">{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
