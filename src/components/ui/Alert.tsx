"use client";

import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  type?: "success" | "error" | "info" | "warning";
}

export const Alert = ({ children, type = "info" }: AlertProps) => {
  return (
    <div className={`alert alert-${type} shadow-lg`}>
      <div>
        <span>{children}</span>
      </div>
    </div>
  );
};
