type AuthBrandLogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
};

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-24 w-24",
};

export function AuthBrandLogo({
  size = "md",
  variant = "dark",
  className = "",
}: AuthBrandLogoProps) {
  const isLight = variant === "light";

  return (
    <div className={["inline-flex", sizeClasses[size], className].join(" ")}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="logoMain" x1="24" y1="12" x2="96" y2="108">
            <stop stopColor={isLight ? "#FFFFFF" : "#8B5CF6"} />
            <stop offset="1" stopColor={isLight ? "#DDD6FE" : "#5B4FC7"} />
          </linearGradient>
        </defs>

        <path
          d="M60 10L96 25.5V54C96 79.5 81.2 99.2 60 110C38.8 99.2 24 79.5 24 54V25.5L60 10Z"
          fill={isLight ? "rgba(255,255,255,0.1)" : "#F5F3FF"}
          stroke="url(#logoMain)"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <path
          d="M38 44C46.2 42.7 53.3 45.2 58 50V82C52.5 77.1 45.5 74.8 38 76V44Z"
          fill="url(#logoMain)"
          opacity={isLight ? "0.95" : "1"}
        />

        <path
          d="M82 44C73.8 42.7 66.7 45.2 62 50V82C67.5 77.1 74.5 74.8 82 76V44Z"
          fill="url(#logoMain)"
          opacity={isLight ? "0.95" : "1"}
        />

        <path
          d="M60 24L63.1 30.3L70 31.3L65 36.2L66.2 43L60 39.8L53.8 43L55 36.2L50 31.3L56.9 30.3L60 24Z"
          fill="url(#logoMain)"
        />

        <path
          d="M36 88C44.8 88 51.7 91.2 57 96"
          stroke="url(#logoMain)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <path
          d="M84 88C75.2 88 68.3 91.2 63 96"
          stroke="url(#logoMain)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}