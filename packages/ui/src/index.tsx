import * as React from "react";

// Premium Button Component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md cursor-pointer select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white hover:shadow-lg hover:shadow-indigo-500/25 border border-indigo-400/20",
    secondary: "bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 hover:text-white border border-slate-700/80 hover:border-slate-600",
    glass:
      "bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 hover:shadow-lg hover:shadow-white/10",
    danger: "bg-red-600/90 hover:bg-red-500 text-white hover:shadow-lg hover:shadow-red-500/25 border border-red-500/30",
    ghost: "bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800/60 hover:text-white hover:border-slate-600"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs font-semibold gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold gap-2",
    lg: "px-7 py-3.5 text-base font-bold gap-2.5",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Premium Glassmorphic Card
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl transition-all duration-300 ${
        hoverEffect ? "hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Styled Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/30 shadow-inner ${className}`}
      {...props}
    />
  );
};

// Styled Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full min-h-[120px] bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/30 shadow-inner resize-y ${className}`}
      {...props}
    />
  );
};

// Tone/Bias Badge Component
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "info" | "success" | "warning" | "error" | "neutral" | "purple" | "pink";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "neutral",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-300 select-none";

  const variants = {
    info: "bg-indigo-950/60 text-indigo-300 border-indigo-800/60 hover:border-indigo-500/40",
    success: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:border-emerald-500/40",
    warning: "bg-amber-950/60 text-amber-300 border-amber-800/60 hover:border-amber-500/40",
    error: "bg-red-950/60 text-red-300 border-red-800/60 hover:border-red-500/40",
    neutral: "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700",
    purple: "bg-purple-950/60 text-purple-300 border-purple-800/60 hover:border-purple-500/40",
    pink: "bg-pink-950/60 text-pink-300 border-pink-800/60 hover:border-pink-500/40",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

