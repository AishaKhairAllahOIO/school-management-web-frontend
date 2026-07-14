import { Languages } from "lucide-react";

import { useLocale } from "@/app/providers/locale";

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({
  className = "",
}: LanguageToggleProps) {
  const {
    language,
    setLanguage,
  } = useLocale();

  const nextLanguage =
    language === "en" ? "ar" : "en";

  function toggleLanguage() {
    setLanguage(nextLanguage);
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={
        language === "en"
          ? "Switch to Arabic"
          : "التبديل إلى الإنجليزية"
      }
      title={
        language === "en"
          ? "العربية"
          : "English"
      }
      className={className}
    >
      <Languages
        aria-hidden="true"
        size={17}
        strokeWidth={2.05}
      />

      <span className="sr-only">
        {nextLanguage.toUpperCase()}
      </span>
    </button>
  );
}