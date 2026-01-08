import { ArrowDown2,ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { Button } from "@/shared/ui";

interface Props {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onClickLabel: () => void;
}

export default function CalendarHeader({ label, onPrev, onNext, onClickLabel }: Props) {
  return (
    <div className="flex items-center justify-between mb-2">
      <Button
        type="button"
        onClick={onPrev}
        variant="secondary"
        className="p-1! m-1 text-grey-950 dark:text-grey-200 rounded-md!">
        <ArrowLeft2 size={16} color="currentColor" />
      </Button>

      <button
        type="button"
        onClick={onClickLabel}
        className="text-label-sm text-grey-950 dark:text-grey-200 flex items-center gap-1 cursor-pointer">
        {label}
        <span className="icon-secondary">
          <ArrowDown2 size={16} color="currentColor" />
        </span>
      </button>

      <Button
        type="button"
        onClick={onNext}
        variant="secondary"
        className="p-1! m-1 text-grey-950 dark:text-grey-200 rounded-md!">
        <ArrowRight2 size={16} color="currentColor" />
      </Button>
    </div>
  );
}
