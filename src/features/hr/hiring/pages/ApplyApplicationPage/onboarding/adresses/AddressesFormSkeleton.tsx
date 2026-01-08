import { Skeleton } from "@/shared/ui";

export default function AddressesFormSkeleton() {
  return (
    <div className="flex flex-col justify-between min-h-[520px] gap-7">
      <div className="flex flex-col gap-7">
        <Skeleton height={28} width={220} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={180} />
            <Skeleton height={44} />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={180} />
            <Skeleton height={44} />
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
