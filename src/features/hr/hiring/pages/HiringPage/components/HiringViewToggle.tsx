import { useTranslation } from "react-i18next";
import { Element4, Grid6 } from "iconsax-react";
import { ButtonGroup } from "@/shared/ui";

interface Props {
  view: "table" | "cards";
  onChange: (view: "table" | "cards") => void;
  amountOfApplications: number;
}

export default function HiringViewToggle({ view, onChange, amountOfApplications }: Props) {
  const { t: tHiringPage } = useTranslation("HiringPage");
  const { t: tPagination } = useTranslation("Pagination");

  return (
    <div className="my-5 flex justify-between items-center">
      <p className="text-label-xs content-action-neutral">
        <span className="content-base-primary">{amountOfApplications}</span>{" "}
        {tPagination("results", { count: amountOfApplications }).split(" ")[1]}
      </p>

      <ButtonGroup
        options={[
          {
            label: (
              <>
                <Grid6 size={16} color="currentColor" />
                {tHiringPage("view.table")}
              </>
            ),
            value: "table",
          },
          {
            label: (
              <>
                <Element4 size={16} color="currentColor" />
                {tHiringPage("view.cards")}
              </>
            ),
            value: "cards",
          },
        ]}
        value={view}
        onChange={(value) => onChange(value as "table" | "cards")}
      />
    </div>
  );
}
