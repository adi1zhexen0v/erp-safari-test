import { Skeleton } from "@/shared/ui";

export default function SocialCategoriesListSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Skeleton height={28} width={220} />
        <Skeleton height={44} width={180} />
      </div>

      <div className="flex flex-col gap-4 pb-6 border-b surface-base-stroke">
        <div className="flex justify-between items-center">
          <Skeleton height={20} width={180} />
          <div className="flex items-center gap-2">
            <Skeleton height={24} width={24} borderRadius={6} />
            <Skeleton height={24} width={24} borderRadius={6} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-6 border-b surface-base-stroke">
        <div className="flex justify-between items-center">
          <Skeleton height={20} width={200} />
          <div className="flex items-center gap-2">
            <Skeleton height={24} width={24} borderRadius={6} />
            <Skeleton height={24} width={24} borderRadius={6} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton height={44} width={180} />
      </div>
    </div>
  );
}

