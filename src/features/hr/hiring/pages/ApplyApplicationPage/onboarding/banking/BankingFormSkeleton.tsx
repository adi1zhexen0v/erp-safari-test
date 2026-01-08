import { Skeleton } from "@/shared/ui";

export default function BankingFormSkeleton() {
  return (
    <div className="flex flex-col gap-7">
      <Skeleton height={32} width={220} />

      <div className="flex flex-col gap-4">
        <Skeleton height={48} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton height={48} />
          <Skeleton height={48} />
        </div>

        <Skeleton height={140} />
      </div>

      <div className="flex justify-end">
        <Skeleton height={44} width={180} />
      </div>
    </div>
  );
}
