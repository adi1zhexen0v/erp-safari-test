import { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import { CreateConsultationForm } from "../LegalConsultationsPage/components";
import { CasesCardsView, CasesHeader } from "./components";

export default function LegalCasesPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const [consultationFormOpen, setConsultationFormOpen] = useState(false);
  const { t } = useTranslation("LegalCasesPage");
  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        {consultationFormOpen && <CreateConsultationForm onClose={() => setConsultationFormOpen(false)} />}
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <CasesHeader onOpenForm={() => setConsultationFormOpen(true)} />
          <CasesCardsView />
        </div>
      </section>
    </>
  );
}
