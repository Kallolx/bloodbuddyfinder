
import { cn } from '@/lib/utils';

// Animation variants for elements
export const fadeIn = (delay: number = 0) => cn(
  "opacity-0 translate-y-4 transition-all duration-700",
  delay > 0 ? `delay-[${delay}ms]` : ""
);

export const fadeInVisible = cn(
  "opacity-100 translate-y-0"
);

// Animation for staggered items
export const staggered = (index: number, baseDelay: number = 100) => cn(
  "opacity-0 translate-y-4 transition-all duration-500",
  `delay-[${baseDelay + (index * 100)}ms]`
);

// Animation for cards
export const cardAnimation = cn(
  "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
);

// Animation for buttons
export const buttonAnimation = cn(
  "transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
);

// Animation for hover links
export const linkAnimation = cn(
  "relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
);
