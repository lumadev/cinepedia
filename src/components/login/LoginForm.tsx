"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/ToastContext";
import { signInWithEmailAndPassword } from "firebase/auth";

import { LoginInput } from "./LoginInput";

export const LoginForm = () => {
  const { showError } = useToast();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      const token = await user.getIdToken();

      document.cookie = `token=${token}; path=/; secure; samesite=strict`;

      // redirect to home page
      router.push("/");
    } catch (error: any) {
      showError("Credenciais inválidas");
    }
  };

  return (
    <div className="card w-full max-w-sm bg-base-200 shadow-xl relative">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center">
          🎬 Sistema de Filmes
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <LoginInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <LoginInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};
