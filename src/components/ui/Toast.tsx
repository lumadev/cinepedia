"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

const typeClasses: Record<ToastProps["type"], string> = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
  warning: "alert-warning",
};

export const Toast = ({ message, type = "info", onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast toast-start z-50">
      <div
        className={`alert ${typeClasses[type]} shadow-lg`}
        role="alert"
      >
        <span>{message}</span>
        <button
          type="button"
          className="ml-4 btn btn-sm btn-ghost"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
