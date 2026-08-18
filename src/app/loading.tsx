export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero skeleton */}
      <div className="h-[500px] w-full animate-pulse bg-muted" />
      {/* Content skeletons */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
