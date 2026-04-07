import { barService } from "@/services/barService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

export default async function BarsPage() {
  const bars = await barService.listApprovedBars();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Bars</h1>

      {bars.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No bars available yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {bars.map((bar) => (
            <Card key={bar.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-4">
                  <span>{bar.name}</span>
                  {bar.isFeatured ? (
                    <span className="text-xs text-muted-foreground">
                      Featured
                    </span>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Area</dt>
                    <dd>{bar.area}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd>{bar.category}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
