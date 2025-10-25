import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "light";
}

export default function Section({
  children,
  className = "",
  variant = "default",
}: SectionProps) {
  const variantClasses = {
    default: "bg-background",
    dark: "bg-gradient-dark",
    light: "bg-background/50",
  };

  return (
    <section className={`section-padding ${variantClasses[variant]} ${className}`}>
      {children}
    </section>
  );
}

