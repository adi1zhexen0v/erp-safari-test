import { InfoCircle, TagUser, Clock } from "iconsax-react";
import { Skeleton } from "@/shared/ui";
import FillContractHeader from "./FillContractHeader";

export default function FillContractPageSkeleton() {
  const sections = [
    { id: "basic_info", icon: InfoCircle },
    { id: "position_duties", icon: TagUser },
    { id: "work_schedule", icon: Clock },
  ];

  return (
    <>
      <FillContractHeader />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div className="h-full overflow-auto page-scroll">
          <div className="p-7 rounded-[28px] surface-base-fill flex items-start justify-between gap-7">
            <div className="w-xs">
              <aside className="relative flex gap-2">
                <div className="flex flex-col mt-1.5 gap-1.5 items-center">
                  {sections.map((_, index) => (
                    <div key={index} className="flex flex-col items-center gap-1.5">
                      <Skeleton circle width={24} height={24} />
                      {index < sections.length - 1 && <Skeleton height={6} width={1} />}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-0.5">
                  {sections.map((section, index) => (
                    <div key={section.id} className="px-3 py-2.5 radius-xs flex items-center gap-2">
                      <Skeleton width={16} height={16} />
                      <Skeleton height={20} width={index === 0 ? 180 : 200} />
                    </div>
                  ))}
                </div>
              </aside>
            </div>

            <div className="flex-1 p-7 radius-lg border surface-base-stroke flex flex-col justify-between">
              <div className="flex flex-col gap-7">
                <Skeleton height={28} width={240} />

                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                  <div className="flex flex-col gap-1">
                    <Skeleton height={16} width={140} />
                    <Skeleton height={44} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Skeleton height={16} width={120} />
                    <Skeleton height={44} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Skeleton height={16} width={200} />
                    <Skeleton height={44} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Skeleton height={16} width={200} />
                    <Skeleton height={44} />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end items-center gap-3">
                <Skeleton height={44} width={120} borderRadius={12} />
                <Skeleton height={44} width={180} borderRadius={12} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
