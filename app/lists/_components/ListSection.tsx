// app/lists/_components/ListSection.tsx
import { cn } from "./ui";

export default function ListSection({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-3">
        <div className="text-xl font-semibold">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-zinc-400">{subtitle}</div> : null}
      </div>
      <div className={cn("space-y-3")}>{children}</div>
    </section>
  );
}
