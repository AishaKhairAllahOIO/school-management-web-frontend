import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-4 text-lg text-muted-foreground">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-xl bg-primary px-5 py-2 text-primary-foreground"
      >
        Back to Home
      </Link>
    </div>
  );
}