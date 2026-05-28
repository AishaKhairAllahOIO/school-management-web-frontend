import { Globe2 } from "lucide-react";

import { useLocale } from "@/app/providers/locale";

export function LanguageToggle() {
  const { language, setLanguage } = useLocale();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border border-border/60 bg-card/80 px-3 text-foreground shadow-soft transition hover:bg-muted"
    >
      <Globe2 size={16} />

      <span className="text-[11px] font-bold uppercase">
        {language}
      </span>
    </button>
  );
}