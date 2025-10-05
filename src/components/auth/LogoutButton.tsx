"use client";

import { Button } from "@/components/ui/Button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/ToastContext";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const { showError } = useToast();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      document.cookie = "token=; path=/; max-age=0; secure; samesite=strict";

      router.push("/login");
    } catch (err) {
      showError("Erro ao fazer o logout");
    }
  };

  return (
    <span
      onClick={handleLogout}
      className="cursor-pointer text-white-600 hover:underline font-medium"
    >
      Sair
    </span>
  );
};
