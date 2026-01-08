import { DocumentText1 } from "iconsax-react";
import cn from "classnames";
import { Skeleton, ModalForm } from "@/shared/ui";

interface Props {
  onClose: () => void;
  hasBackground?: boolean;
}

export default function CompletionActDetailModalSkeleton({ onClose, hasBackground = true }: Props) {
  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false} hasBackground={hasBackground}>
      <div className="flex flex-col gap-6 h-full min-h-0">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
          <Skeleton height={24} width={200} />
        </div>

        <div className="flex-1 overflow-auto min-h-0 p-1">
          <div className="flex flex-col">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={cn("py-3 flex items-center gap-3", i < 6 && "border-b surface-base-stroke")}>
                <Skeleton height={16} width={16} className="shrink-0" />
                <Skeleton height={16} width={140} />
                <Skeleton height={18} width={200} className="ml-auto" />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 radius-sm surface-component-fill">
            <Skeleton height={14} width={120} className="mb-1" />
            <Skeleton height={16} width="100%" className="mb-1" />
            <Skeleton height={16} width="90%" />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t surface-base-stroke p-1">
          <Skeleton height={44} width="100%" />
          <Skeleton height={44} width="100%" />
        </div>
      </div>
    </ModalForm>
  );
}

