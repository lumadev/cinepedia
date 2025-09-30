"use client";

import React from "react";

interface LoginInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const LoginInput = ({
  type,
  placeholder,
  value,
  onChange,
  required = false,
}: LoginInputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="input input-bordered w-full"
      value={value}
      onChange={onChange}
      required={required}
    />
  );
};
