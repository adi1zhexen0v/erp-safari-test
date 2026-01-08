"use client";
import { useTranslation } from "react-i18next";
import { Element4, Grid6 } from "iconsax-react";
import { ButtonGroup } from "@/shared/ui";

interface Props {
  view: "table" | "cards";
  onChange: (view: "table" | "cards") => void;
  amountOfLeaves: number;
}

export default function LeaveApplicationsViewToggle({ view, onChange, amountOfLeaves }: Props) {
  const { t: tLeaveApplicationsPage } = useTranslation("LeaveApplicationsPage");
  const { t: tPagination } = useTranslation("Pagination");

  function handleViewChange(value: string) {
    onChange(value as "table" | "cards");
  }

  return (
    <div className="my-5 flex justify-between items-center">
      <p className="text-label-xs content-action-neutral">
        <span className="content-base-primary">{amountOfLeaves}</span>{" "}
        {tPagination("results", { count: amountOfLeaves }).split(" ")[1]}
      </p>
      <ButtonGroup
        options={[
          {
            label: (
              <>
                <Grid6 size={16} color="currentColor" />
                {tLeaveApplicationsPage("view.table")}
              </>
            ),
            value: "table",
          },
          {
            label: (
              <>
                <Element4 size={16} color="currentColor" />
                {tLeaveApplicationsPage("view.cards")}
              </>
            ),
            value: "cards",
          },
        ]}
        value={view}
        onChange={handleViewChange}
      />
    </div>
  );
}
