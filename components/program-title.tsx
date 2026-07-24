import type { ProgramItem } from "@/lib/data";

export function ProgramTitle({ p }: { p: ProgramItem }) {
  if (!p.link) return <>{p.title}</>;
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline transition-opacity active:opacity-60"
    >
      {p.title}
    </a>
  );
}
