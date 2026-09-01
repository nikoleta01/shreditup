import { CHIP_TONE, type ChipTone } from "@/lib/location-chip";

export function WaveChip({
  children,
  className,
  tone = "default",
  href,
  style: styleOverride,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: ChipTone;
  href?: string;
  style?: React.CSSProperties;
}) {
  const classes = `inline-block rounded-sm px-2.5 py-0.5 font-bold leading-tight${
    className ? ` ${className}` : ""
  }`;
  const style = {
    fontFamily: "var(--font-barlow-condensed)",
    ...CHIP_TONE[tone],
    ...styleOverride,
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}
