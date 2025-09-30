"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ToastItem } from "./ToastItem";

interface Toast {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

interface ToastContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "error" | "success" | "info") => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        showError: (msg) => addToast(msg, "error"),
        showSuccess: (msg) => addToast(msg, "success"),
        showInfo: (msg) => addToast(msg, "info"),
      }}
    >
      {children}

      {/* Container de toasts fixo na parte inferior da tela */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
