import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";

function DashboardPage()
{
  return (<div></div>);
}

export function AppRouter() 
{
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}