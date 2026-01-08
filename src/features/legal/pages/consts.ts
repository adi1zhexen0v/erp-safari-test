export const TRUSTME_STATUS = {
  DRAFT: null,
  SIGNED: 3,
} as const;

export const LOCALES = {
  RU: "ru",
  KK: "kk",
} as const;

export const LEGAL_TEMPLATES = [
  {
    id: "vehicleRent",
    titleKey: "templates.vehicleRent.title",
    subtitleKey: "templates.vehicleRent.subtitle",
  },
  {
    id: "commercialPremiseRent",
    titleKey: "templates.commercialPremiseRent.title",
    subtitleKey: "templates.commercialPremiseRent.subtitle",
  },
  {
    id: "serviceContract",
    titleKey: "templates.serviceContract.title",
    subtitleKey: "templates.paidService.subtitle",
  },
  {
    id: "paidService",
    titleKey: "templates.paidService.title",
    subtitleKey: "templates.serviceContract.subtitle",
  },
  {
    id: "supplyContract",
    titleKey: "templates.supplyContract.title",
    subtitleKey: "templates.supplyContract.subtitle",
  },
] as const;

export type LegalTemplateId = (typeof LEGAL_TEMPLATES)[number]["id"];
