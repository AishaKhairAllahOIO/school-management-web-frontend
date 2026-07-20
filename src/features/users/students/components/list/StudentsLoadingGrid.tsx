export function StudentsLoadingGrid() {
  return (
    <div className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4">
      {Array.from({
        length: 10,
      }).map((_, index) => (
        <div
          key={index}
          className={[
            "mb-5 break-inside-avoid animate-pulse rounded-[28px] bg-white p-5 shadow-sm",
            index % 4 === 0
              ? "h-[390px]"
              : index % 3 === 0
                ? "h-[340px]"
                : "h-[305px]",
          ].join(" ")}
        >
          <div className="mx-auto h-28 w-28 rounded-[26px] bg-slate-100" />

          <div className="mx-auto mt-5 h-5 w-2/3 rounded-full bg-slate-100" />

          <div className="mx-auto mt-3 h-4 w-1/3 rounded-full bg-slate-100" />

          <div className="mt-6 space-y-3">
            <div className="h-11 rounded-2xl bg-slate-100" />
            <div className="h-11 rounded-2xl bg-slate-100" />
            <div className="h-11 rounded-2xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}