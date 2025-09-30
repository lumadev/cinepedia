"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/ToastContext";

import { LoginInput } from "./LoginInput";


export const LoginForm = () => {
  const { showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuário logado:", userCredential.user);
      
    } catch (error: any) {
      showError("Ocorreu um erro ao tentar logar");
    }
  };

  return (
    <div className="card w-full max-w-sm bg-base-200 shadow-xl relative">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center">🎬 Sistema de Filmes</h2>
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
