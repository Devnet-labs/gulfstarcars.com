import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', ...props }, ref) => {
    const baseStyles = 'font-medium rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
    
    const variants = {
      primary: 'bg-[#D4AF37] text-black hover:bg-[#C19B2E]',
      secondary: 'border border-[#404040] text-white hover:border-[#525252] hover:bg-[#1A1A1A]',
      ghost: 'text-white hover:bg-[#1A1A1A]',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
