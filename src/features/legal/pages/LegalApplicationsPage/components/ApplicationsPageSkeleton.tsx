import { Skeleton } from "@/shared/ui";

export default function ApplicationsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-7">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-4 radius-lg border surface-base-stroke surface-base-fill p-5">
          <Skeleton height={24} width={120} />
          <Skeleton height={20} width={160} />

          <div className="flex flex-col border-t border-b surface-base-stroke py-3 gap-3">
            <Skeleton height={16} width={180} />
            <Skeleton height={16} width={150} />
            <Skeleton height={16} width={150} />
          </div>

          <Skeleton height={16} width={120} />

          <div className="flex flex-col gap-2 pt-3 border-t surface-base-stroke">
            <Skeleton height={32} width={"100%"} />
            <Skeleton height={32} width={"100%"} />
            <Skeleton height={32} width={"100%"} />
          </div>
        </div>
      ))}
    </div>
  );
}
