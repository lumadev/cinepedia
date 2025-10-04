"use client";

import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const baseStyle =
      "w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const combinedClass = `${baseStyle} ${className}`;

    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-gray-300">{label}</label>}
        <input ref={ref} className={combinedClass} {...props} />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
