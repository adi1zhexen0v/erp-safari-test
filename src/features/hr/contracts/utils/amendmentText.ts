export function getAmendmentText(sectionNumber: string, t: (key: string, options?: Record<string, unknown>) => string): string {
  switch (sectionNumber) {
    case "1.1":
      return t("cards.amendmentPrefix.position");
    case "1.3":
      return t("cards.amendmentPrefix.workFormat");
    case "4.1":
      return t("cards.amendmentPrefix.workSchedule");
    case "4.12":
      return t("cards.amendmentPrefix.salary");
    default:
      return t("cards.amendmentPrefix.clause", { section_number: sectionNumber });
  }
}

