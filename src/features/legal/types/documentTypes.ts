export const LegalDocumentType = {
  VEHICLE_RENTAL: "vehicle_rental",
  PREMISES_LEASE: "premises_lease",
  SERVICE_AGREEMENT_INDIVIDUAL: "service_agreement_individual",
  SERVICE_AGREEMENT_MSB: "service_agreement_msb",
  GOODS_SUPPLY: "goods_supply",
  VEHICLE_HANDOVER: "vehicle_handover",
  PREMISES_HANDOVER: "premises_handover",
} as const;

export type LegalDocumentType = (typeof LegalDocumentType)[keyof typeof LegalDocumentType];

export const ALL_LEGAL_TYPES = Object.values(LegalDocumentType);

export type LegalDocumentTypeKey = `${LegalDocumentType}`;

