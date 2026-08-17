import { CHIP_TONE, type ChipTone } from "@/lib/location-chip";

export function WaveChip({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: ChipTone;
}) {
  return (
    <span
      className={`inline-block rounded-sm px-2.5 py-0.5 font-bold leading-tight${
        className ? ` ${className}` : ""
      }`}
      style={{
        fontFamily: "var(--font-barlow-condensed)",
        ...CHIP_TONE[tone],
      }}
    >
      {children}
    </span>
  );
}
