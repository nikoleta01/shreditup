const TONES = {
  default: {
    backgroundColor: "var(--chip)",
    color: "var(--chip-foreground)",
  },
  bonfire: {
    backgroundColor: "var(--chip-bonfire)",
    color: "var(--chip-bonfire-foreground)",
  },
} as const;

export function WaveChip({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-block rounded-sm px-2.5 py-0.5 font-bold leading-tight${
        className ? ` ${className}` : ""
      }`}
      style={{
        fontFamily: "var(--font-barlow-condensed)",
        ...TONES[tone],
      }}
    >
      {children}
    </span>
  );
}
