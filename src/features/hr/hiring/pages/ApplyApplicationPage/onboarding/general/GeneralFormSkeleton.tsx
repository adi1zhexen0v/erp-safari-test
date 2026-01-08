import { Skeleton } from "@/shared/ui";

export default function GeneralFormSkeleton() {
  return (
    <div className="flex flex-col justify-between min-h-[640px] gap-7">
      <div className="flex flex-col gap-7">
        <Skeleton height={28} width={240} />

        <div className="flex flex-col gap-4">
          <Skeleton height={180} />

          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={140} />
            <Skeleton height={44} />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={140} />
            <Skeleton height={44} />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={140} />
            <Skeleton height={44} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={100} />
              <Skeleton height={44} />
            </div>

            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={120} />
              <Skeleton height={44} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={110} />
            <Skeleton height={44} />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={160} />
            <Skeleton height={44} />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={160} />
            <Skeleton height={44} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={160} />
              <Skeleton height={44} />
            </div>

            <div className="flex flex-col gap-1">
              <Skeleton height={16} width={160} />
              <Skeleton height={44} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        <Skeleton height={44} width={180} />
        <Skeleton height={44} width={120} />
      </div>
    </div>
  );
}
