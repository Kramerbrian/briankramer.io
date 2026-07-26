export default function Loading() {
  return (
    <section className="container-page py-24" aria-label="Loading page">
      <div className="max-w-3xl animate-pulse space-y-6">
        <div className="h-3 w-28 rounded-full bg-line" />
        <div className="h-12 w-full max-w-2xl rounded-xl bg-line" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded-full bg-line" />
          <div className="h-4 w-5/6 rounded-full bg-line" />
          <div className="h-4 w-2/3 rounded-full bg-line" />
        </div>
      </div>
    </section>
  );
}
