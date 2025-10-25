import { ReactNode } from "react";

interface HeroProps {
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}

export default function Hero({ title, subtitle, children }: HeroProps) {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

