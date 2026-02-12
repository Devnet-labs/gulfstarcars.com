// Design System Tokens - Enterprise Automotive Theme

export const designTokens = {
  // Refined Color System
  colors: {
    gold: {
      accent: '#D4AF37', // Refined gold for CTAs
      hover: '#C19B2E',
      light: '#F5E6C8',
    },
    charcoal: {
      bg: '#0A0A0A',
      card: '#141414',
      border: '#262626',
      text: {
        primary: '#FFFFFF',
        secondary: '#A3A3A3',
        muted: '#737373',
      }
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
  },

  // Typography Scale
  typography: {
    h1: 'text-5xl font-semibold tracking-tight',
    h2: 'text-3xl font-semibold tracking-tight',
    h3: 'text-xl font-semibold',
    body: 'text-base',
    small: 'text-sm',
    tiny: 'text-xs',
  },

  // Spacing System (8px base)
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem',  // 64px
  },

  // Border Radius (Subtle)
  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
  },

  // Shadows (Refined)
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },

  // Animation (Subtle)
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    }
  }
};

// Utility Classes
export const uiClasses = {
  // Container
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Card
  card: 'bg-[#141414] border border-[#262626] rounded-lg',
  cardHover: 'hover:border-[#404040] transition-colors duration-250',
  
  // Button Primary
  btnPrimary: 'bg-[#D4AF37] text-black font-medium px-6 py-2.5 rounded-lg hover:bg-[#C19B2E] transition-colors duration-250',
  
  // Button Secondary
  btnSecondary: 'border border-[#404040] text-white font-medium px-6 py-2.5 rounded-lg hover:border-[#525252] hover:bg-[#1A1A1A] transition-colors duration-250',
  
  // Input
  input: 'bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white placeholder:text-[#737373] focus:border-[#D4AF37] focus:outline-none transition-colors',
  
  // Section
  section: 'py-16 lg:py-24',
  
  // Grid
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
};
