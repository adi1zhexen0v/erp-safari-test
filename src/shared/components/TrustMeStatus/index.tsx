import React from "react";
import { Clock, DocumentText, TickCircle, CloseCircle, Warning2 } from "iconsax-react";
import { Badge } from "@/shared/ui";
import type { BadgeColor } from "@/shared/ui/Badge";
import type { Locale } from "@/shared/utils/types";

const STATUS_TRANSLATIONS: Record<Locale, Record<string, string>> = {
  ru: {
    draft: "Черновик",
    notSigned: "Не подписан с обеих сторон",
    signedByCompany: "Ожидает подписи контрагента",
    signedByClient: "Ожидает подписи менеджера",
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
    signedByCompany: "Контрагенттің қол қоюын күтуде",
    signedByClient: "Менеджердің қол қоюын күтуде",
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
    signedByCompany: "Waiting for counterparty signature",
    signedByClient: "Waiting for manager signature",
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

const STATUS_CONFIG: Record<number | "null", { color: BadgeColor; icon: React.ReactElement }> = {
  null: {
    color: "info",
    icon: <DocumentText size={14} color="currentColor" />,
  },
  0: {
    color: "notice",
    icon: <Clock size={14} color="currentColor" />,
  },
  1: {
    color: "notice",
    icon: <Clock size={14} color="currentColor" />,
  },
  2: {
    color: "notice",
    icon: <Clock size={14} color="currentColor" />,
  },
  3: {
    color: "positive",
    icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
  },
  4: {
    color: "negative",
    icon: <CloseCircle size={14} color="currentColor" />,
  },
  5: {
    color: "negative",
    icon: <Warning2 size={14} color="currentColor" />,
  },
  6: {
    color: "negative",
    icon: <Warning2 size={14} color="currentColor" />,
  },
  7: {
    color: "notice",
    icon: <Clock size={14} color="currentColor" />,
  },
  8: {
    color: "negative",
    icon: <CloseCircle size={14} color="currentColor" />,
  },
  9: {
    color: "negative",
    icon: <CloseCircle size={14} color="currentColor" />,
  },
};

interface Props {
  trustmeStatus: number | null;
  locale?: Locale;
  variant?: "filled" | "soft" | "outline";
  className?: string;
}

export default function TrustMeStatus({ trustmeStatus, locale = "ru", variant = "soft", className }: Props) {
  const key = trustmeStatus === null ? "null" : trustmeStatus;
  const statusConfig = STATUS_CONFIG[key];
  const translationKey = STATUS_KEY_MAP[key];

  if (!statusConfig || !translationKey) {
    return null;
  }

  const label = STATUS_TRANSLATIONS[locale]?.[translationKey] || STATUS_TRANSLATIONS.ru[translationKey] || "";

  return (
    <Badge variant={variant} color={statusConfig.color} text={label} icon={statusConfig.icon} className={className} />
  );
}
