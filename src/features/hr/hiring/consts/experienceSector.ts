export interface ExperienceSectorOption {
  value: string;
  labelKey: string;
}

export const EXPERIENCE_SECTOR_OPTIONS: ExperienceSectorOption[] = [
  { value: "Административный персонал", labelKey: "administrative_staff" },
  { value: "Высший и средний менеджмент", labelKey: "management" },
  { value: "Добыча сырья", labelKey: "mining" },
  { value: "Закупки", labelKey: "procurement" },
  { value: "Информационные технологии", labelKey: "it" },
  { value: "Искусство, массмедиа", labelKey: "arts_media" },
  { value: "Маркетинг, реклама, PR", labelKey: "marketing" },
  { value: "Медицина, фармацевтика", labelKey: "medicine" },
  { value: "Миграция населения", labelKey: "migration" },
  { value: "Наука, образование", labelKey: "science_education" },
  { value: "Проектное управление", labelKey: "project_management" },
  { value: "Производство, сервисное обслуживание", labelKey: "production_service" },
  { value: "Рабочий персонал", labelKey: "manual_labor" },
  { value: "Торговля", labelKey: "trade" },
  { value: "Сельское хозяйство", labelKey: "agriculture" },
  { value: "Службы безопасности", labelKey: "security" },
  { value: "Социально-трудовая сфера", labelKey: "social_labor" },
  { value: "Стратегия, инвестиции, консалтинг", labelKey: "strategy_consulting" },
  { value: "Страхование", labelKey: "insurance" },
  { value: "Строительство, недвижимость", labelKey: "construction_real_estate" },
  { value: "Транспортные услуги", labelKey: "transport" },
  { value: "Сфера обслуживания", labelKey: "service" },
  { value: "Управление персоналом, тренинги", labelKey: "hr_training" },
  { value: "Финансы, бухгалтерия", labelKey: "finance_accounting" },
  { value: "Юристы", labelKey: "legal" },
];

