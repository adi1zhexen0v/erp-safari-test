import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Add, ArrowDown2, Import } from "iconsax-react";
import { Breadcrumbs, Button, Dropdown, DropdownItem } from "@/shared/ui";

export default function EmployeesHeader() {
  const { t } = useTranslation("EmployeesPage");
  const [downloadIsOpen, setDownloadIsOpen] = useState(false);

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.hr") }, { label: t("breadcrumbs.employees") }]} />
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-display-xs content-base-primary">{t("header.title")}</h1>

        <div className="flex justify-end gap-2 pr-0.5">
          <Dropdown open={downloadIsOpen} onClose={() => setDownloadIsOpen(false)}>
            <Button variant="secondary" onClick={() => setDownloadIsOpen((p) => !p)}>
              <Import size={16} color="currentColor" />
              <span>{t("header.download")}</span>
              <ArrowDown2 size={16} color="currentColor" />
            </Button>

            <DropdownItem>{t("header.downloadPdf")}</DropdownItem>
            <DropdownItem>{t("header.downloadCsv")}</DropdownItem>
          </Dropdown>

          <Button variant="primary">
            <Add size={18} color="currentColor" />
            {t("header.newEmployee")}
          </Button>
        </div>
      </div>
    </>
  );
}
