import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { practiceModules, getModule } from '@/data/practice';
import { TestRunner } from '@/components/practice/TestRunner';

export function generateStaticParams() {
  return practiceModules.map((m) => ({ moduleId: m.id }));
}

export default async function PracticeModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 max-w-3xl">
      <Link
        href="/mock-tests"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Semua modul
      </Link>
      <TestRunner module={mod} />
    </div>
  );
}
