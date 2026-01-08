import type { PayrollStatus, TaxCategory } from "./types";

export const PAYROLL_STATUS_ORDER: Record<PayrollStatus, number> = {
  draft: 0,
  calculated: 1,
  approved: 2,
  paid: 3,
};

export const TAX_CATEGORY_LABELS: Record<TaxCategory, { ru: string; en: string; kk: string }> = {
  standard: { ru: "Стандартный", en: "Standard", kk: "Стандартты" },
  pensioner: { ru: "Пенсионер", en: "Pensioner", kk: "Зейнеткер" },
  disabled_1_2_permanent: { ru: "Инвалид 1-2 гр. (бессрочно)", en: "Disabled 1-2 (permanent)", kk: "Мүгедек 1-2 топ (тұрақты)" },
  disabled_1_2_temporary: { ru: "Инвалид 1-2 гр. (временно)", en: "Disabled 1-2 (temporary)", kk: "Мүгедек 1-2 топ (уақытша)" },
  disabled_3: { ru: "Инвалид 3 группы", en: "Disabled group 3", kk: "Мүгедек 3 топ" },
  parent_disabled_child: { ru: "Родитель ребенка-инвалида", en: "Parent of disabled child", kk: "Мүгедек баланың ата-анасы" },
  student: { ru: "Студент", en: "Student", kk: "Студент" },
  large_family: { ru: "Многодетная семья", en: "Large family", kk: "Көп балалы отбасы" },
  non_resident: { ru: "Нерезидент", en: "Non-resident", kk: "Резидент емес" },
  astana_hub: { ru: "Astana Hub", en: "Astana Hub", kk: "Astana Hub" },
};


