"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    console.log(userCredential.user)

    // console.log("Login attempt:", { email, password });
  };

  return (
    <div className="card w-full max-w-sm bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center">🎬 Sistema de Filmes</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
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
