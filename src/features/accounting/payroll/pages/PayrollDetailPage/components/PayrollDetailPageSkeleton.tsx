import cn from "classnames";
import { Skeleton } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";

export default function PayrollDetailPageSkeleton() {
  const { scrollRef, hasScroll } = useScrollDetection();

  return (
    <>
      <title>Загрузка...</title>
      <meta name="description" content="Загрузка..." />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
        <div className="h-full min-w-0 flex flex-col">
          <div className="shrink-0 mb-7">
            <Skeleton height={24} width={400} className="mb-2" />
            <div className="flex items-center gap-4 mt-2">
              <Skeleton height={32} width={250} />
              <Skeleton height={28} width={100} borderRadius={12} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-7 shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 radius-lg border surface-base-stroke flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Skeleton height={16} width={120} />
                  <Skeleton height={32} width={32} borderRadius={4} />
                </div>
                <Skeleton height={28} width={150} />
              </div>
            ))}
          </div>

          <div ref={scrollRef} className={cn("flex-1 min-h-0 overflow-y-auto page-scroll", hasScroll && "pr-5")}>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Skeleton height={40} width={40} borderRadius={8} />
                  <div>
                    <Skeleton height={20} width={200} className="mb-1" />
                    <Skeleton height={14} width={300} />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Skeleton height={18} width={150} />
                  <div className="border surface-base-stroke radius-lg overflow-hidden">
                    <div className="p-4 border-b surface-base-stroke">
                      <div className="grid grid-cols-7 gap-4">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <Skeleton key={i} height={16} width={80} />
                        ))}
                      </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-4 border-b surface-base-stroke last:border-b-0">
                        <div className="grid grid-cols-7 gap-4 items-center">
                          <div className="flex items-center gap-3">
                            <Skeleton circle height={32} width={32} />
                            <div>
                              <Skeleton height={14} width={120} className="mb-1" />
                              <Skeleton height={12} width={80} />
                            </div>
                          </div>
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Skeleton key={j} height={14} width={70} />
                          ))}
                          <Skeleton height={32} width={32} borderRadius={4} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Skeleton height={40} width={40} borderRadius={8} />
                  <div>
                    <Skeleton height={20} width={200} className="mb-1" />
                    <Skeleton height={14} width={300} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-5 radius-lg border surface-base-stroke">
                      <Skeleton height={20} width={150} className="mb-4" />
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-3 gap-4 pb-2 border-b border-alpha-black-10">
                          <Skeleton height={14} width={80} />
                          <Skeleton height={14} width={60} />
                          <Skeleton height={14} width={80} className="ml-auto" />
                        </div>
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="grid grid-cols-3 gap-4">
                            <Skeleton height={14} width={100} />
                            <Skeleton height={14} width={50} />
                            <Skeleton height={14} width={80} className="ml-auto" />
                          </div>
                        ))}
                        <div className="pt-2 border-t border-alpha-black-10">
                          <div className="grid grid-cols-3 gap-4">
                            <Skeleton height={16} width={100} />
                            <Skeleton height={16} width={50} />
                            <Skeleton height={16} width={100} className="ml-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Skeleton height={40} width={40} borderRadius={8} />
                  <div>
                    <Skeleton height={20} width={200} className="mb-1" />
                    <Skeleton height={14} width={300} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-5 radius-lg border surface-base-stroke flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <Skeleton height={40} width={40} borderRadius={8} />
                        <Skeleton height={16} width={120} />
                      </div>
                      <Skeleton height={24} width={150} className="mb-2" />
                      <Skeleton height={14} width={200} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Skeleton height={40} width={40} borderRadius={8} />
                  <div>
                    <Skeleton height={20} width={200} className="mb-1" />
                    <Skeleton height={14} width={300} />
                  </div>
                </div>
                <div className="border surface-base-stroke radius-lg overflow-hidden">
                  <div className="p-4 border-b surface-base-stroke">
                    <div className="grid grid-cols-6 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} height={16} width={100} />
                      ))}
                    </div>
                  </div>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 border-b surface-base-stroke last:border-b-0">
                      <div className="grid grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <Skeleton key={j} height={14} width={90} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t surface-base-stroke shrink-0">
            <Skeleton height={44} width={120} />
            <Skeleton height={44} width={140} />
          </div>
        </div>
      </section>
    </>
  );
}
