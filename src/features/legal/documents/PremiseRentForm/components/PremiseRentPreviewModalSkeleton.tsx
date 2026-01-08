import { DocumentText1 } from "iconsax-react";
import { Skeleton, ModalForm } from "@/shared/ui";

interface Props {
  onClose: () => void;
  hasBackground?: boolean;
}

export default function PremiseRentPreviewModalSkeleton({ onClose, hasBackground = false }: Props) {
  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize hasBackground={hasBackground}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <Skeleton height={24} width={300} />
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary bg-white">
            <div className="text-center mb-6">
              <Skeleton height={32} width={400} className="mx-auto mb-2" />
              <div className="flex justify-between text-sm mt-4">
                <Skeleton height={20} width={150} />
                <Skeleton height={20} width={120} />
              </div>
            </div>

            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="mb-6">
                <Skeleton height={28} width={300} className="mx-auto mb-4" />
                {Array.from({ length: 3 + Math.floor(Math.random() * 3) }).map((_, j) => (
                  <Skeleton key={j} height={20} width="100%" className="mb-2" />
                ))}
              </div>
            ))}

            <div className="mb-6">
              <Skeleton height={28} width={200} className="mx-auto mb-4" />
              <div className="flex justify-between mt-6">
                <div className="flex-1">
                  <Skeleton height={20} width={120} className="mb-2" />
                  <Skeleton height={20} width={200} className="mb-1" />
                  <Skeleton height={1} width={192} className="mt-8 mb-2" />
                  <Skeleton height={20} width={180} className="mb-1" />
                  <Skeleton height={16} width={120} />
                </div>
                <div className="flex-1 text-right">
                  <Skeleton height={20} width={120} className="mb-2 ml-auto" />
                  <Skeleton height={20} width={200} className="mb-1 ml-auto" />
                  <Skeleton height={1} width={192} className="mt-8 mb-2 ml-auto" />
                  <Skeleton height={20} width={180} className="mb-1 ml-auto" />
                  <Skeleton height={16} width={120} className="ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pb-1">
          <Skeleton height={44} width={120} />
        </div>
      </div>
    </ModalForm>
  );
}
