function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-3xl bg-card p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        This page content appears inside the dashboard container.
      </p>
    </div>
  );
}

export const financeRoutes = {
  path: "finance",
  children: [
    { index: true, element: <PlaceholderPage title="Fees" /> },
    { path: "fees", element: <PlaceholderPage title="Fees" /> },
    { path: "payments", element: <PlaceholderPage title="Payments" /> },
    { path: "installments", element: <PlaceholderPage title="Installments" /> },
    { path: "salaries", element: <PlaceholderPage title="Salaries" /> },
    { path: "deductions", element: <PlaceholderPage title="Deductions" /> },
  ],
};