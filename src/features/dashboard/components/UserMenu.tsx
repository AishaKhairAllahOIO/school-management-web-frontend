export function UserMenu() {
  return (
    <button
      type="button"
      className="hidden items-center gap-3 rounded-2xl border bg-card px-3 py-2 transition hover:bg-muted sm:flex"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        AD
      </div>

      <div className="text-left">
        <p className="text-sm font-semibold text-foreground">Admin User</p>
        <p className="text-xs text-muted-foreground">Super Admin</p>
      </div>
    </button>
  );
}