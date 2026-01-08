import { Trans, useTranslation } from "react-i18next";
import cn from "classnames";

interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
  fromItem: number;
  toItem: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  fromItem,
  toItem,
  onPageChange,
  className,
}: Props) {
  useTranslation("Pagination");

  if (totalPages <= 1) {
    return (
      <div className={cn("flex items-center justify-between mt-5", className)}>
        <p className="text-label-xs content-action-neutral">
          <Trans
            i18nKey="shown"
            ns="Pagination"
            values={{ from: fromItem, to: toItem, total }}
            components={{ 0: <span className="content-base-primary" /> }}
          />
        </p>
      </div>
    );
  }

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className={cn("flex items-center justify-between mt-4", className)}>
      <p className="text-label-xs content-action-neutral">
        <Trans
          i18nKey="shown"
          ns="Pagination"
          values={{ from: fromItem, to: toItem, total }}
          components={{ 0: <span className="content-base-primary" /> }}
        />
      </p>

      <div className="flex items-center border surface-base-stroke radius-xs">
        <button
          type="button"
          onClick={() => goTo(currentPage - 1)}
          className={cn(
            "w-8 aspect-square flex justify-center items-center content-base-primary text-body-bold-xs border-r surface-base-stroke cursor-pointer hover:bg-black/5",
            currentPage === 1 && "opacity-40 cursor-default",
          )}>
          {"<"}
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="w-8 aspect-square flex justify-center items-center text-body-bold-xs content-base-low border-r surface-base-stroke cursor-pointer hover:bg-black/5">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => goTo(p)}
              className={cn(
                (className =
                  "w-8 aspect-square flex justify-center items-center text-body-bold-xs border-r surface-base-stroke cursor-pointer hover:bg-black/5"),
                p === currentPage ? "content-base-primary" : "content-base-low",
              )}>
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goTo(currentPage + 1)}
          className={cn(
            "w-8 aspect-square flex justify-center items-center content-base-primary text-body-bold-xs cursor-pointer hover:bg-black/5",
            currentPage === totalPages && "opacity-40 cursor-default",
          )}>
          {">"}
        </button>
      </div>
    </div>
  );
}
