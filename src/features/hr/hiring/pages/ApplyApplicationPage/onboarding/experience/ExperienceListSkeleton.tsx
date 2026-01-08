import { Skeleton } from "@/shared/ui";

export default function ExperienceListSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Skeleton width={180} height={28} />
        <Skeleton width={120} height={36} />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center pb-4 border-b surface-base-stroke">
            <Skeleton width={180} height={22} />
            <Skeleton circle width={24} height={24} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton height={48} />
            <Skeleton height={48} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton height={48} />
            <Skeleton height={48} />
          </div>

          <Skeleton height={32} width={150} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center pb-4 border-b surface-base-stroke">
            <Skeleton width={200} height={22} />
            <Skeleton circle width={24} height={24} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton height={48} />
            <Skeleton height={48} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton height={48} />
            <Skeleton height={48} />
          </div>

          <Skeleton height={32} width={150} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton width={240} height={22} />
        <Skeleton height={180} />

        <div className="flex justify-end">
          <Skeleton width={200} height={44} />
        </div>
      </div>
    </div>
  );
}
