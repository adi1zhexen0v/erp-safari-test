import type { Locale } from "./types";

const STATUS_TRANSLATIONS: Record<Locale, Record<string, string>> = {
  ru: {
    draft: "Черновик",
    notSigned: "Не подписан",
    signedByCompany: "Подписан компанией",
    signedByClient: "Подписан клиентом",
    fullySigned: "Полностью подписан",
    revokedByCompany: "Отозван компанией",
    companyInitiatedTermination: "Компания инициировала расторжение",
    clientInitiatedTermination: "Клиент инициировал расторжение",
    clientRefusedTermination: "Клиент отказался от расторжения",
    terminated: "Расторгнут",
    clientRefusedToSign: "Клиент отказался подписывать договор",
  },
  kk: {
    draft: "Жоба",
    notSigned: "Екі тарап та қол қоймаған",
    signedByCompany: "Компания қол қойды",
    signedByClient: "Клиент қол қойды",
    fullySigned: "Толығымен қол қойылған",
    revokedByCompany: "Компания тартқан",
    companyInitiatedTermination: "Компания бұзуды бастады",
    clientInitiatedTermination: "Клиент бұзуды бастады",
    clientRefusedTermination: "Клиент бұзудан бас тартты",
    terminated: "Бұзылған",
    clientRefusedToSign: "Клиент қол қоюдан бас тартты",
  },
  en: {
    draft: "Draft",
    notSigned: "Not signed",
    signedByCompany: "Signed by the company",
    signedByClient: "Signed by the client",
    fullySigned: "Fully signed",
    revokedByCompany: "Revoked by company",
    companyInitiatedTermination: "Company initiated termination",
    clientInitiatedTermination: "Client initiated termination",
    clientRefusedTermination: "Client refused termination",
    terminated: "Terminated",
    clientRefusedToSign: "Client refused to sign",
  },
};

const STATUS_KEY_MAP: Record<number | "null", string> = {
  null: "draft",
  0: "notSigned",
  1: "signedByCompany",
  2: "signedByClient",
  3: "fullySigned",
  4: "revokedByCompany",
  5: "companyInitiatedTermination",
  6: "clientInitiatedTermination",
  7: "clientRefusedTermination",
  8: "terminated",
  9: "clientRefusedToSign",
};

export interface StatusOption {
  label: string;
  value: string;
}

function getStatusLabel(trustmeStatus: number | null, locale: Locale = "ru"): string {
  const key = trustmeStatus === null ? "null" : trustmeStatus;
  const translationKey = STATUS_KEY_MAP[key];

  if (!translationKey) {
    return "";
  }

  return STATUS_TRANSLATIONS[locale]?.[translationKey] || STATUS_TRANSLATIONS.ru[translationKey] || "";
}

export function getUniqueTrustMeStatuses<T extends { trustme_status: number | null }>(
  items: T[],
  locale: Locale = "ru",
): StatusOption[] {
  // Извлекаем уникальные значения trustme_status
  const uniqueStatuses = new Set<number | null>();
  items.forEach((item) => {
    uniqueStatuses.add(item.trustme_status);
  });

  // Преобразуем в массив опций
  const options: StatusOption[] = Array.from(uniqueStatuses)
    .map((status) => ({
      value: status === null ? "null" : String(status),
      label: getStatusLabel(status, locale),
      status,
    }))
    .filter((opt) => opt.label) // Фильтруем только валидные статусы
    .sort((a, b) => {
      // Сортируем так, чтобы "null" был первым, остальные по возрастанию
      if (a.status === null) return -1;
      if (b.status === null) return 1;
      return (a.status ?? 0) - (b.status ?? 0);
    })
    .map(({ value, label }) => ({ value, label }));

  return options;
}

