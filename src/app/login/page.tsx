import { LoginForm } from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <main
      data-theme="dark"
      className="min-h-screen flex items-center justify-center bg-base-100 text-base-content"
    >
      <LoginForm />
    </main>
  );
}