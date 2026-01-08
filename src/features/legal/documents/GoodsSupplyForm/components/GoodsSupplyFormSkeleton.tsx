import { Skeleton } from "@/shared/ui";

export default function GoodsSupplyFormSkeleton() {
  return (
    <div className="flex flex-col justify-between min-h-[640px] gap-7">
      <div className="flex flex-col gap-7">
        <Skeleton height={28} width={200} />

        <div className="flex flex-col gap-4">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <Skeleton height={16} width={140} />
              <Skeleton height={44} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        <Skeleton height={44} width={120} />
      </div>
    </div>
  );
}

