"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  id: string;
  message: string;
  type?: "error" | "success" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

export const ToastItem = ({
  id,
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => onClose(id), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, id, onClose]);

  const bgColor =
    type === "error"
      ? "bg-red-400"
      : type === "success"
      ? "bg-green-600"
      : "bg-blue-600";

  return (
    <div
      className={`max-w-sm w-full px-6 py-4 rounded-lg text-white shadow-lg transform transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${bgColor} mb-2 flex justify-between items-center pointer-events-auto`}
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-4 font-bold text-white hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  );
};
