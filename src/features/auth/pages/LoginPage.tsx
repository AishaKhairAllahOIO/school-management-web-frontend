import { AuthFormShell } from "../components/AuthFormShell";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <AuthLayout>
      <AuthFormShell
        title="Welcome back"
        description="Sign in to continue to your school dashboard."
      >
        <LoginForm />
      </AuthFormShell>
    </AuthLayout>
  );
}
