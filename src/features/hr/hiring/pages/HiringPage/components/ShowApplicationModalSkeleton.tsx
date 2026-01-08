import cn from "classnames";
import { Profile } from "iconsax-react";
import { ModalForm, Skeleton } from "@/shared/ui";

interface Props {
  onClose: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  hasScroll: boolean;
}

export default function ShowApplicationModalSkeleton({ onClose, scrollRef, hasScroll }: Props) {
  return (
    <ModalForm icon={Profile} onClose={onClose} resize>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke pt-2">
          <Skeleton height={28} width={180} />
        </div>

        <div className="flex items-center gap-4 py-5 border-b surface-base-stroke">
          <Skeleton circle height={56} width={56} />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton height={20} width="50%" />
            <Skeleton height={16} width="30%" />
          </div>
        </div>

        <div className="py-5 border-b surface-base-stroke">
          <Skeleton height={32} width="100%" />
        </div>

        <div ref={scrollRef} className={cn("flex-1 py-4 page-scroll", hasScroll && "pr-5")}>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton height={16} width="40%" />
                <Skeleton height={32} />
                <Skeleton height={1} className="surface-base-stroke w-full" />
              </div>
            ))}

            <div className="flex justify-end items-center gap-3 pt-6 border-t surface-base-stroke">
              <Skeleton height={40} width={120} />
              <Skeleton height={40} width={160} />
              <Skeleton height={40} width={120} />
            </div>
          </div>
        </div>
      </div>
    </ModalForm>
  );
}
