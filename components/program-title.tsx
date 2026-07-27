"use client";

import { useLang } from "@/components/language-provider";
import type { ProgramItem } from "@/lib/data";

export function ProgramTitle({ p }: { p: ProgramItem }) {
  const { tr } = useLang();
  const title = tr(p.title);
  if (!p.link) return <>{title}</>;
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline transition-opacity active:opacity-60"
    >
      {title}
    </a>
  );
}
