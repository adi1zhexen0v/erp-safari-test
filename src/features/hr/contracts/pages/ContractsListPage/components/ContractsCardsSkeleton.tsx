import { Skeleton } from "@/shared/ui";

export default function ContractsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4 radius-lg border surface-base-stroke surface-base-fill p-5">
          <div className="flex flex-col gap-2">
            <Skeleton width={120} height={24} borderRadius={6} />
            <Skeleton width={180} height={20} />
          </div>

          <div className="p-2 radius-sm border surface-base-stroke flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton circle width={32} height={32} />
              <div className="flex flex-col gap-1">
                <Skeleton width={140} height={14} />
                <Skeleton width={100} height={12} />
              </div>
            </div>
            <Skeleton width={20} height={20} />
          </div>

          <div className="flex flex-col gap-3 py-3 border-t border-b surface-base-stroke">
            <div className="flex flex-col gap-1.5">
              <Skeleton width={150} height={14} />
              <Skeleton width={110} height={14} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton width={150} height={14} />
              <Skeleton width={110} height={14} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Skeleton width={120} height={14} />
            <Skeleton width={110} height={14} />
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t surface-base-stroke">
            <Skeleton width={"100%"} height={40} borderRadius={12} />
          </div>
        </div>
      ))}
    </div>
  );
}
