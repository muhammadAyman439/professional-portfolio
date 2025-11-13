import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X, Linkedin } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMerzaOverlayOpen, setIsMerzaOverlayOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCustomCursor, setShowCustomCursor] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const handleMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
      setShowCustomCursor(true);
    };

    const handleLeave = () => setShowCustomCursor(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    if (!isMerzaOverlayOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMerzaOverlayOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMerzaOverlayOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground cursor-auto md:cursor-none">
      {showCustomCursor && (
        <div
          className="pointer-events-none fixed z-[80] hidden md:block transition-transform duration-150 ease-out"
          style={{ transform: `translate3d(${cursorPosition.x - 15}px, ${cursorPosition.y - 15}px, 0)` }}
        >
          <div className="h-8 w-8 rounded-full bg-white/70 border border-slate-300/70 shadow-[0_0_16px_rgba(148,163,184,0.35)]" />
        </div>
      )}

      {isMerzaOverlayOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-background/70 backdrop-blur-3xl px-6 py-12"
          onClick={() => setIsMerzaOverlayOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full text-center text-muted-foreground/95"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsMerzaOverlayOpen(false)}
                aria-label="Close Merza Group teaser"
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="space-y-6 text-lg md:text-xl px-2 pb-2">
              <p className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                A new legacy is being engineered.
              </p>
              <p>Merza Group is preparing its breakthrough —</p>
              <p>and what comes next will speak for itself.</p>
              <p className="text-sm tracking-[0.3em] uppercase text-primary/80">
                Watch this space — closely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="container flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-display font-bold text-gradient hover:opacity-80 transition-opacity">
          Mohamed Salah Merza
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            <Button
              className="h-auto px-4 py-2.5 rounded-full bg-white text-black shadow-[0_10px_25px_rgba(15,23,42,0.15)] hover:scale-[1.02] transition-transform duration-200 flex flex-col items-center gap-[2px]"
              onClick={() => setIsMerzaOverlayOpen(true)}
            >
              <span className="text-[8px] uppercase tracking-[0.35em] text-slate-500">Soon</span>
              <span className="text-xs font-semibold">Merza Group</span>
            </Button>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950">
                Get in Touch
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="container py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium hover:text-primary transition-colors block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className="h-auto px-4 py-2.5 rounded-full bg-white text-black shadow-[0_10px_25px_rgba(15,23,42,0.15)] hover:scale-[1.02] transition-transform duration-200 flex flex-col items-center gap-[2px]"
                onClick={() => {
                  setIsMerzaOverlayOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <span className="text-[8px] uppercase tracking-[0.35em] text-slate-500">Soon</span>
                <span className="text-xs font-semibold">Merza Group</span>
              </Button>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <h3 className="text-2xl font-display font-bold text-gradient mb-4">
                Mohamed Salah Merza
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
              Proposals Leader | Bid Management Expert | Growth Advisor
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4">
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="md:col-span-4">
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://www.linkedin.com/in/mohamedsalahmerza/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Mohamed Salah Merza. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

