import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Toast, Table } from "@/shared/ui";
import type { TimesheetEntryResponse } from "../../../types";
import { getInitials, isValidCellValue, getCellStyle } from "../../../utils";

interface EntryStats {
  work_days: number;
  work_hours: number;
  annual_leave_days: number;
  medical_leave_days: number;
  overtime_hours: number;
}

interface Props {
  entries: TimesheetEntryResponse[];
  daysInMonth: string[];
  year: number;
  month: number;
  canEdit: boolean;
  getCellValue: (entryId: number, day: string) => string;
  onCellChange: (entryId: number, day: string, code: string) => void;
  getEntryStats: (entryId: number) => EntryStats;
}

export default function TimesheetEditableTable({
  entries,
  daysInMonth,
  year,
  month,
  canEdit,
  getCellValue,
  onCellChange,
  getEntryStats,
}: Props) {
  const { t } = useTranslation("TimesheetsPage");
  const [editingCell, setEditingCell] = useState<{ entryId: number; day: string } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [toast, setToast] = useState<{ text: string } | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const cmp = a.worker.full_name.localeCompare(b.worker.full_name, "ru");
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [entries, sortDirection]);

  const totals = useMemo(() => {
    return sortedEntries.reduce(
      (acc, entry) => {
        const stats = getEntryStats(entry.id);
        return {
          work_days: acc.work_days + stats.work_days,
          work_hours: acc.work_hours + stats.work_hours,
          overtime_hours: acc.overtime_hours + stats.overtime_hours,
          annual_leave_days: acc.annual_leave_days + stats.annual_leave_days,
          medical_leave_days: acc.medical_leave_days + stats.medical_leave_days,
        };
      },
      { work_days: 0, work_hours: 0, overtime_hours: 0, annual_leave_days: 0, medical_leave_days: 0 },
    );
  }, [sortedEntries, getEntryStats]);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  function toggleSort() {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  function handleCellClick(entryId: number, day: string) {
    if (!canEdit) return;
    const currentValue = getCellValue(entryId, day);
    if (!isValidCellValue(currentValue)) return;
    setEditingCell({ entryId, day });
    setInputValue(currentValue);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>, entryId: number, day: string) {
    if (e.key === "Enter") {
      handleInputBlur(entryId, day);
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setInputValue("");
    }
  }

  function handleInputBlur(entryId: number, day: string) {
    const value = inputValue.trim();

    if (value === "") {
      setEditingCell(null);
      setInputValue("");
      return;
    }

    if (isValidCellValue(value)) {
      onCellChange(entryId, day, value);
      setEditingCell(null);
      setInputValue("");
    } else {
      setToast({ text: t("detail.invalidCode") });
      setTimeout(() => setToast(null), 3000);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLTableCellElement>, entryId: number, day: string) {
    if (!canEdit) return;
    const currentValue = getCellValue(entryId, day);
    if (!isValidCellValue(currentValue)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDrop(e: React.DragEvent<HTMLTableCellElement>, entryId: number, day: string) {
    if (!canEdit) return;
    const currentValue = getCellValue(entryId, day);
    if (!isValidCellValue(currentValue)) return;
    e.preventDefault();
    const code = e.dataTransfer.getData("text/plain");
    if (isValidCellValue(code)) {
      onCellChange(entryId, day, code);
    }
  }

  function getDayOfWeek(day: number, year: number, month: number): string {
    const date = new Date(year, month - 1, day);
    const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return t(`detail.weekDays.${dayKeys[date.getDay()]}`);
  }

  return (
    <div className="w-full min-w-0 relative">
      <div className="overflow-x-auto overflow-y-hidden page-scroll pb-2">
        <Table.Table rounded={false}>
          <Table.Header variant="plain">
            <Table.Row className="border-none">
              <Table.HeadCell
                sticky
                sortable
                sortDirection={sortDirection}
                onSort={toggleSort}
                className="whitespace-nowrap">
                {t("detail.worker")}
              </Table.HeadCell>
              {daysInMonth.map((day) => {
                const dayNum = parseInt(day, 10);
                const dayOfWeek = getDayOfWeek(dayNum, year, month);
                return (
                  <Table.HeadCell key={day} width="w-10" align="center" className="p-2!">
                    <div className="flex flex-col gap-1">
                      <span className="text-label-sm content-base-primary">{day}</span>
                      <span className="text-label-xs content-base-low">{dayOfWeek}</span>
                    </div>
                  </Table.HeadCell>
                );
              })}
              <Table.HeadCell align="center" className="whitespace-nowrap">
                {t("detail.workDays")}
              </Table.HeadCell>
              <Table.HeadCell align="center" className="whitespace-nowrap">
                {t("detail.workHours")}
              </Table.HeadCell>
              <Table.HeadCell align="center" className="whitespace-nowrap">
                {t("detail.overtimeHours")}
              </Table.HeadCell>
              <Table.HeadCell align="center" className="whitespace-nowrap">
                {t("detail.annualLeave")}
              </Table.HeadCell>
              <Table.HeadCell align="center" className="whitespace-nowrap">
                {t("detail.medicalLeave")}
              </Table.HeadCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedEntries.map((entry) => {
              const stats = getEntryStats(entry.id);
              return (
                <Table.Row key={entry.id} className="border-none">
                  <Table.Cell sticky className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 aspect-square rounded-full flex items-center justify-center bg-grey-50 dark:bg-grey-950 shrink-0">
                        <span className="content-action-brand text-body-bold-xs">
                          {getInitials(entry.worker.full_name)}
                        </span>
                      </div>
                      <span className="text-label-sm content-base-primary">{entry.worker.full_name}</span>
                    </div>
                  </Table.Cell>
                  {daysInMonth.map((day) => {
                    const value = getCellValue(entry.id, day);
                    const isEditing = editingCell?.entryId === entry.id && editingCell?.day === day;
                    const isValid = isValidCellValue(value);
                    const style = getCellStyle(value);

                    return (
                      <Table.Cell
                        key={day}
                        width="w-10"
                        align="center"
                        className={`p-2! ${canEdit && isValid ? "cursor-pointer" : ""}`}
                        onDragOver={
                          !isValid
                            ? undefined
                            : (e: React.DragEvent<HTMLTableCellElement>) => handleDragOver(e, entry.id, day)
                        }
                        onDrop={
                          !isValid
                            ? undefined
                            : (e: React.DragEvent<HTMLTableCellElement>) => handleDrop(e, entry.id, day)
                        }
                        onClick={!isValid ? undefined : () => handleCellClick(entry.id, day)}>
                        {isEditing ? (
                          <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={(e) => handleInputKeyDown(e, entry.id, day)}
                            onBlur={() => handleInputBlur(entry.id, day)}
                            className="w-10 aspect-square bg-transparent border-0 outline-none text-center text-label-sm font-medium content-base-primary"
                            maxLength={2}
                          />
                        ) : !isValid || !style ? (
                          <div className="w-10 aspect-square" />
                        ) : (
                          <div
                            className={`w-10 aspect-square flex items-center justify-center radius-xs ${style.className}`}>
                            <span className="text-label-sm font-medium">{value}</span>
                          </div>
                        )}
                      </Table.Cell>
                    );
                  })}
                  <Table.Cell isBold align="center">
                    {stats.work_days}
                  </Table.Cell>
                  <Table.Cell isBold align="center">
                    {stats.work_hours}
                  </Table.Cell>
                  <Table.Cell isBold align="center">
                    {stats.overtime_hours}
                  </Table.Cell>
                  <Table.Cell isBold align="center">
                    {stats.annual_leave_days}
                  </Table.Cell>
                  <Table.Cell isBold align="center">
                    {stats.medical_leave_days}
                  </Table.Cell>
                </Table.Row>
              );
            })}
            <Table.Row className="border-none bg-surface-base-stroke/50">
              <Table.Cell sticky className="whitespace-nowrap">
                <span className="text-label-sm font-semibold content-base-primary">{t("detail.total")}</span>
              </Table.Cell>
              {daysInMonth.map((day) => (
                <Table.Cell key={day} width="w-10" align="center" className="p-2!">
                  <div className="w-10 aspect-square" />
                </Table.Cell>
              ))}
              <Table.Cell isBold align="center">
                {totals.work_days}
              </Table.Cell>
              <Table.Cell isBold align="center">
                {totals.work_hours}
              </Table.Cell>
              <Table.Cell isBold align="center">
                {totals.overtime_hours}
              </Table.Cell>
              <Table.Cell isBold align="center">
                {totals.annual_leave_days}
              </Table.Cell>
              <Table.Cell isBold align="center">
                {totals.medical_leave_days}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </div>
      {toast && (
        <div className="absolute bottom-4 left-4 z-50">
          <Toast color="notice" text={toast.text} onClose={() => setToast(null)} autoClose={true} />
        </div>
      )}
    </div>
  );
}

