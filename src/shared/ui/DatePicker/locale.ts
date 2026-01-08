import { type Locale } from "@/shared/utils/types";

export const CALENDAR_LOCALE: Record<
  Locale,
  {
    months: string[];
    weekdays: string[];
    done: string;
    hour: string;
    minute: string;
    selectTime: string;
  }
> = {
  ru: {
    months: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    done: "Готово",
    hour: "час",
    minute: "мин",
    selectTime: "Выберите время",
  },

  kk: {
    months: [
      "Қаңтар",
      "Ақпан",
      "Наурыз",
      "Сәуір",
      "Мамыр",
      "Маусым",
      "Шілде",
      "Тамыз",
      "Қыркүйек",
      "Қазан",
      "Қараша",
      "Желтоқсан",
    ],
    weekdays: ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"],
    done: "Дайын",
    hour: "сағат",
    minute: "мин",
    selectTime: "Уақытты таңдаңыз",
  },

  en: {
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    done: "Done",
    hour: "hour",
    minute: "min",
    selectTime: "Select time",
  },
};
