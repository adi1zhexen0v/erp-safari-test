import Skeleton from "@/shared/ui/Skeleton";

export default function TimesheetDetailSkeleton() {
  const DAYS_COUNT = 31;
  const EMPLOYEES_COUNT = 5;
  const LEGEND_COUNT = 9;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-7">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton width={100} height={16} />
            <Skeleton width={8} height={16} />
            <Skeleton width={60} height={16} />
            <Skeleton width={8} height={16} />
            <Skeleton width={120} height={16} />
          </div>
          <Skeleton width={200} height={36} />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton width={150} height={40} borderRadius={8} />
          <Skeleton width={32} height={32} borderRadius={8} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-7">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 radius-lg border surface-base-stroke flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <Skeleton width={100} height={16} />
              <Skeleton width={32} height={32} borderRadius={6} />
            </div>
            <Skeleton width={60} height={40} />
          </div>
        ))}
      </div>

      <div className="mb-7">
        <Skeleton width={120} height={20} className="mb-3" />
        <div className="flex flex-wrap gap-2 mb-5">
          {Array.from({ length: LEGEND_COUNT }).map((_, i) => (
            <div
              key={i}
              className="radius-sm p-1 surface-container-fill border surface-base-stroke flex items-center gap-2">
              <Skeleton width={28} height={28} borderRadius={4} />
              <Skeleton width={80 + Math.random() * 40} height={14} />
            </div>
          ))}
        </div>
        <Skeleton height={56} borderRadius={8} />
      </div>

      <div className="flex-1 min-h-0">
        <div className="w-full min-w-0">
          <div className="overflow-x-auto page-scroll pb-2">
            <div className="border surface-base-stroke rounded-[20px] min-w-full w-fit">
              <table className="border-collapse text-sm leading-5 w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-3 xl:py-3 xl:px-4 first:rounded-tl-[20px]">
                      <div className="flex items-center gap-1">
                        <Skeleton width={80} height={14} />
                        <Skeleton width={12} height={12} />
                      </div>
                    </th>
                    {Array.from({ length: DAYS_COUNT }).map((_, i) => (
                      <th key={i} className="p-2">
                        <div className="flex flex-col items-center gap-1">
                          <Skeleton width={16} height={14} />
                          <Skeleton width={16} height={10} />
                        </div>
                      </th>
                    ))}
                    <th className="py-2 px-3 xl:py-3 xl:px-4">
                      <Skeleton width={50} height={14} className="mx-auto" />
                    </th>
                    <th className="py-2 px-3 xl:py-3 xl:px-4">
                      <Skeleton width={60} height={14} className="mx-auto" />
                    </th>
                    <th className="py-2 px-3 xl:py-3 xl:px-4">
                      <Skeleton width={50} height={14} className="mx-auto" />
                    </th>
                    <th className="py-2 px-3 xl:py-3 xl:px-4 last:rounded-tr-[20px]">
                      <Skeleton width={70} height={14} className="mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: EMPLOYEES_COUNT }).map((_, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 1 ? "bg-grey-50 dark:bg-grey-900" : ""}>
                      <td
                        className={`py-2 px-3 xl:py-3 xl:px-4 ${rowIndex === EMPLOYEES_COUNT - 1 ? "[tr:last-child>&:first-child]:rounded-bl-[20px]" : ""}`}>
                        <div className="flex items-center gap-2">
                          <Skeleton width={32} height={32} borderRadius="50%" />
                          <Skeleton width={120 + Math.random() * 60} height={14} />
                        </div>
                      </td>
                      {Array.from({ length: DAYS_COUNT }).map((_, dayIndex) => (
                        <td key={dayIndex} className="p-2">
                          <Skeleton width={40} height={40} borderRadius={4} />
                        </td>
                      ))}
                      <td className="py-2 px-3 xl:py-3 xl:px-4 text-center">
                        <Skeleton width={24} height={14} className="mx-auto" />
                      </td>
                      <td className="py-2 px-3 xl:py-3 xl:px-4 text-center">
                        <Skeleton width={32} height={14} className="mx-auto" />
                      </td>
                      <td className="py-2 px-3 xl:py-3 xl:px-4 text-center">
                        <Skeleton width={20} height={14} className="mx-auto" />
                      </td>
                      <td
                        className={`py-2 px-3 xl:py-3 xl:px-4 text-center ${rowIndex === EMPLOYEES_COUNT - 1 ? "[tr:last-child>&:last-child]:rounded-br-[20px]" : ""}`}>
                        <Skeleton width={20} height={14} className="mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-7 pt-5 border-t surface-base-stroke">
        <Skeleton width={180} height={44} borderRadius={10} />
        <Skeleton width={140} height={44} borderRadius={10} />
      </div>
    </div>
  );
}
