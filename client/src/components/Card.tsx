import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
  glass = false,
}: CardProps) {
  const baseClasses = "rounded-xl border border-border transition-all duration-300";
  const glassClasses = glass ? "glass" : "bg-background/50";
  const hoverClasses = hover ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10" : "";

  return (
    <div className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

