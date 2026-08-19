// components/UserAvatar.tsx
import type { ReactNode } from "react";
import { useState } from "react"; // ← أضف هذا
import { User } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  rounded?: "full" | "lg" | "md";
}

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
  "2xl": "w-24 h-24 text-2xl",
};

const roundedClasses = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
};

export function UserAvatar({
  src,
  alt = "",
  className,
  fallback,
  size = "md",
  rounded = "full",
}: UserAvatarProps) {
  const sizeClass = sizeClasses[size];
  const roundedClass = roundedClasses[rounded];
  const [hasError, setHasError] = useState(false); // ← استخدم state بدلاً من DOM manipulation

  // استخراج الأحرف الأولى من الاسم
  const initials = alt
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  // إذا كان هناك خطأ أو لا يوجد src، اعرض الفولباك
  if (!src || hasError) {
    // إذا كان هناك فولباك مخصص
    if (fallback) {
      return <>{fallback}</>;
    }

    // الفولباك الافتراضي
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/40 text-muted-foreground select-none",
          sizeClass,
          roundedClass,
          className
        )}
      >
        {initials ? (
          <span className="font-medium">{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2" strokeWidth={1.5} />
        )}
      </div>
    );
  }

  // عرض الصورة
  return (
    <img
      src={src}
      alt={alt || "User avatar"}
      className={cn(
        "object-cover border border-border/50",
        sizeClass,
        roundedClass,
        className
      )}
      loading="lazy"
      onError={() => setHasError(true)} // ← ببساطة حدد hasError
    />
  );
}