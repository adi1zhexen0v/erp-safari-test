interface Props {
  currentYear: number;
  onSelect: (y: number) => void;
}

export default function CalendarYears({ currentYear, onSelect }: Props) {
  const start = currentYear - 6;
  const years = Array.from({ length: 12 }, (_, i) => start + i);

  return (
    <div className="grid grid-cols-4 gap-2">
      {years.map((y) => (
        <button
          type="button"
          key={y}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(y);
          }}
          className={`
            w-14 h-9 flex items-center justify-center radius-xs text-body-regular-sm
            text-grey-950 dark:text-grey-200 cursor-pointer
            ${y === currentYear ? "bg-primary-500 text-white" : "hover:bg-black/5"}
          `}>
          {y}
        </button>
      ))}
    </div>
  );
}
