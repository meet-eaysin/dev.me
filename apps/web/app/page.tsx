import Shell from '@/components/shell';

export default function Page() {
  return (
    <Shell
      heading={<>Mind Stack</>}
      subtitle="Your private AI knowledge system"
      CTA={
        <button className="bg-brand text-brand-contrast rounded-md px-4 py-2 text-sm font-semibold">
          Add Document
        </button>
      }
    >
      <div className="bg-default border-subtle mt-6 rounded-md border p-6">
        <h2 className="text-emphasis font-semibold text-lg mb-2">
          Dashboard Overview
        </h2>
        <p className="text-subtle text-sm">
          Visual shell mapped from your docs: documents, folders, tags, notes,
          search, graph, review, analytics, integrations, and settings.
        </p>
      </div>
    </Shell>
  );
}
