import { Skeleton } from "@/shared/ui";

export default function IdDocumentsSkeleton() {
  return (
    <div className="flex flex-col justify-between min-h-[640px] gap-7">
      <div className="flex flex-col gap-7">
        <Skeleton height={28} width={240} />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center pb-3 border-b surface-base-stroke">
            <Skeleton height={20} width={200} />
            <Skeleton height={24} width={24} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={180} />
              <Skeleton height={44} />
            </div>

            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={160} />
              <Skeleton height={44} />
            </div>

            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={120} />
              <Skeleton height={44} />
            </div>

            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={140} />
              <Skeleton height={44} />
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <Skeleton height={16} width={200} />
              <Skeleton height={48} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center pb-3 border-b surface-base-stroke">
            <Skeleton height={20} width={200} />
            <Skeleton height={24} width={24} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={220} />
              <Skeleton height={48} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        <Skeleton height={44} width={180} />
        <Skeleton height={44} width={140} />
      </div>
    </div>
  );
}
