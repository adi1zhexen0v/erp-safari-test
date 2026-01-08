import { Skeleton } from "@/shared/ui";

export default function LeaveApplicationsPageSkeleton() {
  function renderSkeletonCard(_: unknown, idx: number) {
    return (
      <div
        key={idx}
        className="flex flex-col gap-4 radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex flex-col gap-2">
          <Skeleton width={120} height={24} />
          <Skeleton width={150} height={20} />
        </div>

        <div className="border-t surface-base-stroke"></div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Skeleton width={60} height={14} />
            <Skeleton width={100} height={24} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Skeleton width={70} height={14} />
            <div className="flex items-center gap-1.5">
              <Skeleton width={16} height={16} />
              <Skeleton width={120} height={16} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Skeleton width={80} height={14} />
            <Skeleton width={60} height={16} />
          </div>
        </div>

        <div className="pt-3 border-t surface-base-stroke">
          <Skeleton width="100%" height={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
      {Array.from({ length: 8 }).map(renderSkeletonCard)}
    </div>
  );
}
