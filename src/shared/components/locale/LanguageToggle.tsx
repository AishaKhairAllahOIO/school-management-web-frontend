import { useLocale } from "@/app/providers/locale";

export function LanguageToggle() {
  const { language, setLanguage } = useLocale();

  function toggleLanguage() {
    setLanguage(language === "en" ? "ar" : "en");
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="
        flex h-[44px] w-[44px]
        items-center justify-center
        rounded-[14px]
        bg-white/92
        text-[#111232]
        shadow-[0_16px_38px_rgba(46,38,108,0.10)]
        ring-1 ring-[#EEF0FA]
        backdrop-blur-xl
        transition duration-200
        hover:-translate-y-0.5
        hover:bg-white
      "
    >
      <span className="text-[12px] font-bold uppercase tracking-tight">
        {language}
      </span>
    </button>
  );
}