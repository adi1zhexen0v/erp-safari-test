import { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import { ConsultationHeader, CreateConsultationForm, ConsultationCardsView } from "./components";

export default function LegalConsultationsPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const [CreateConsultationFormOpen, setCreateConsultationFormOpen] = useState(false);
  const { t } = useTranslation("LegalConsultationsPage");

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        {CreateConsultationFormOpen && <CreateConsultationForm onClose={() => setCreateConsultationFormOpen(false)} />}
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <ConsultationHeader onOpenForm={() => setCreateConsultationFormOpen(true)} />
          <ConsultationCardsView />
        </div>
      </section>
    </>
  );
}
