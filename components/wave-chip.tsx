export function WaveChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-sm bg-secondary px-2.5 py-0.5 font-bold leading-tight text-black${
        className ? ` ${className}` : ""
      }`}
      style={{
        fontFamily: "var(--font-barlow-condensed)",
      }}
    >
      {children}
    </span>
  );
}
