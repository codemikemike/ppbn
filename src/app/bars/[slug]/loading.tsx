import { Card, CardContent } from "@/components/ui/card";

/**
 * Loading state for the bar detail page.
 *
 * @returns Skeleton UI.
 */
export default function BarDetailLoading() {
  return (
    <main className="ppbn-page">
      <section aria-label="Bar hero" className="relative">
        <div className="ppbn-skeleton h-80 w-full" />
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="-mt-10 rounded-2xl border border-border/70 bg-card/90 p-5 shadow-(--glow-red) backdrop-blur-md">
            <div className="ppbn-skeleton h-6 w-52" />
            <div className="mt-2 ppbn-skeleton h-4 w-44" />
            <div className="mt-4 flex gap-2">
              <div className="ppbn-skeleton h-4 w-24" />
              <div className="ppbn-skeleton h-4 w-28" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
        <Card className="ppbn-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-2">
              <div className="ppbn-skeleton h-11" />
              <div className="ppbn-skeleton h-11" />
              <div className="ppbn-skeleton h-11" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="ppbn-skeleton h-4 w-2/3" />
              <div className="ppbn-skeleton h-4 w-1/2" />
              <div className="ppbn-skeleton h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
