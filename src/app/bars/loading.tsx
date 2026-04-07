import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Loading state for the bars listing page.
 *
 * @returns Skeleton UI.
 */
export default function BarsLoading() {
  return (
    <main className="ppbn-page mx-auto w-full max-w-6xl px-4 py-10">
      <header className="space-y-2">
        <div className="ppbn-skeleton h-8 w-40" />
        <div className="ppbn-skeleton h-4 w-72" />
      </header>

      <div className="mt-6 grid gap-3">
        <div className="ppbn-skeleton h-11 w-full" />
        <div className="flex flex-wrap gap-2">
          <div className="ppbn-skeleton h-11 w-20" />
          <div className="ppbn-skeleton h-11 w-24" />
          <div className="ppbn-skeleton h-11 w-28" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Card key={index} className="ppbn-card overflow-hidden">
            <div className="ppbn-skeleton h-40" />
            <CardHeader>
              <div className="ppbn-skeleton h-5 w-40" />
              <div className="ppbn-skeleton h-4 w-28" />
            </CardHeader>
            <CardContent>
              <div className="ppbn-skeleton h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
