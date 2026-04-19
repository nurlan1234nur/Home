interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 ${className}`}
    >
      {children}
    </div>
  );
}
