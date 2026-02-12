import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({ hover = false, children, className = '', ...props }: CardProps) {
  const baseStyles = 'bg-[#141414] border border-[#262626] rounded-lg';
  const hoverStyles = hover ? 'hover:border-[#404040] transition-colors duration-250' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardMotion({ hover = true, children, className = '', ...props }: CardProps) {
  const baseStyles = 'bg-[#141414] border border-[#262626] rounded-lg';
  const hoverStyles = hover ? 'hover:border-[#404040] transition-colors duration-250' : '';
  
  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className} animate-in fade-in slide-in-from-bottom-2 duration-250`}
      {...props}
    >
      {children}
    </div>
  );
}
