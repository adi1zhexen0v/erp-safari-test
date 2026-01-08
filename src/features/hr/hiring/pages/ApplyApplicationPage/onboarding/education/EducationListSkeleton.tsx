import { Skeleton } from "@/shared/ui";

export default function EducationListSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton height={28} width={220} />

      <div className="flex flex-col gap-4 pb-6 border-b surface-base-stroke">
        <div className="flex justify-between items-center">
          <Skeleton height={20} width={180} />
          <Skeleton height={24} width={24} borderRadius={6} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Skeleton height={48} />
          <Skeleton height={48} />
          <Skeleton height={48} />
          <Skeleton height={48} />
        </div>

        <div className="mt-4">
          <Skeleton height={150} />
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-6 border-b surface-base-stroke">
        <div className="flex justify-between items-center">
          <Skeleton height={20} width={220} />
          <Skeleton height={24} width={24} borderRadius={6} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Skeleton height={48} />
          <Skeleton height={48} />
          <Skeleton height={48} />
          <Skeleton height={48} />
        </div>

        <div className="mt-4">
          <Skeleton height={150} />
        </div>
      </div>

      <div className="w-40">
        <Skeleton height={44} />
      </div>
    </div>
  );
}
