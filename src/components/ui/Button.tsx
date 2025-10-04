"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export const Button = ({ children, variant = "primary", className, ...props }: ButtonProps) => {
  const baseClasses = "btn font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "btn-primary bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
    secondary: "btn-secondary bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300",
    outline: "btn-outline border border-gray-400 text-gray-800 hover:bg-gray-100",
    ghost: "btn-ghost text-gray-300 border-gray-600 hover:text-gray-400 hover:border-gray-500"
  };

  return (
    <button className={clsx(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};