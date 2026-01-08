import { Skeleton } from "@/shared/ui";

export default function LegalTemplatesPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-7">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-3 radius-lg border surface-base-stroke surface-base-fill p-5">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <Skeleton circle width={40} height={40} />
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton height={24} width={180} />
              <Skeleton height={16} width={240} />
            </div>

            <div className="flex flex-col gap-1.5 border-t surface-base-stroke pt-3">
              <Skeleton height={16} width={140} />
              <div className="flex items-center gap-1.5">
                <Skeleton circle width={16} height={16} />
                <Skeleton height={16} width={100} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton height={40} width={"100%"} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
