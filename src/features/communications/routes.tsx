import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// 1. التحميل الكسول للصفحة لتحسين الأداء (Code Splitting)
const CommunicationsPage = lazy(() =>
  import("@/features/communications/pages/CommunicationsPage").then((module) => ({
    default: module.CommunicationsPage,
  }))
);

// 2. مكون التحميل المؤقت أثناء جلب الصفحة من السيرفر
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full text-primary">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

// 3. تصدير مسارات التواصل والإشعارات
export const communicationsRoutes = [
  {
    path: "communications",
    children: [
      // التوجيه الافتراضي إلى التبويب الأول (التعاميم)
      {
        index: true,
        element: <Navigate to="announcements" replace />,
      },
      // مسار التعاميم والإعلانات
      {
        path: "announcements",
        element: (
          <Suspense fallback={<PageFallback />}>
            <CommunicationsPage />
          </Suspense>
        ),
      },
      // مسار الأنشطة والرحلات المدرسية
      {
        path: "activities",
        element: (
          <Suspense fallback={<PageFallback />}>
            <CommunicationsPage />
          </Suspense>
        ),
      },
    ],
  },
] satisfies RouteObject[];