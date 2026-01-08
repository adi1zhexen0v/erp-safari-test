export interface Holiday {
  id: number;
  month: number;
  day: number;
  name_ru: string;
  name_kk: string;
  name_en: string;
}

export const HOLIDAYS: Holiday[] = [
  {
    id: 1,
    month: 1,
    day: 1,
    name_ru: "Новый год",
    name_kk: "Жаңа жыл",
    name_en: "New Year",
  },
  {
    id: 2,
    month: 1,
    day: 2,
    name_ru: "Новый год",
    name_kk: "Жаңа жыл",
    name_en: "New Year",
  },
  {
    id: 3,
    month: 1,
    day: 7,
    name_ru: "Рождество",
    name_kk: "Рождество",
    name_en: "Christmas",
  },
  {
    id: 4,
    month: 3,
    day: 8,
    name_ru: "Международный женский день",
    name_kk: "Халықаралық әйелдер күні",
    name_en: "International Women's Day",
  },
  {
    id: 5,
    month: 3,
    day: 21,
    name_ru: "Наурыз мейрамы",
    name_kk: "Наурыз мейрамы",
    name_en: "Nauryz",
  },
  {
    id: 6,
    month: 3,
    day: 22,
    name_ru: "Наурыз мейрамы",
    name_kk: "Наурыз мейрамы",
    name_en: "Nauryz",
  },
  {
    id: 7,
    month: 3,
    day: 23,
    name_ru: "Наурыз мейрамы",
    name_kk: "Наурыз мейрамы",
    name_en: "Nauryz",
  },
  {
    id: 8,
    month: 5,
    day: 1,
    name_ru: "Праздник единства народа Казахстана",
    name_kk: "Қазақстан халқының бірлігі күні",
    name_en: "Day of Unity of the People of Kazakhstan",
  },
  {
    id: 9,
    month: 5,
    day: 7,
    name_ru: "День защитника Отечества",
    name_kk: "Отан қорғаушы күні",
    name_en: "Defender of the Fatherland Day",
  },
  {
    id: 10,
    month: 5,
    day: 9,
    name_ru: "День Победы",
    name_kk: "Жеңіс күні",
    name_en: "Victory Day",
  },
  {
    id: 11,
    month: 7,
    day: 6,
    name_ru: "День Столицы",
    name_kk: "Астана күні",
    name_en: "Capital Day",
  },
  {
    id: 12,
    month: 8,
    day: 30,
    name_ru: "День Конституции",
    name_kk: "Конституция күні",
    name_en: "Constitution Day",
  },
  {
    id: 13,
    month: 10,
    day: 25,
    name_ru: "День Республики",
    name_kk: "Республика күні",
    name_en: "Republic Day",
  },
  {
    id: 14,
    month: 12,
    day: 16,
    name_ru: "День Независимости",
    name_kk: "Тәуелсіздік күні",
    name_en: "Independence Day",
  },
];
