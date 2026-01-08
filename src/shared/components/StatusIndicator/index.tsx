import cn from "classnames";
import { useTranslation } from "react-i18next";
import type { StatusMapping } from "./mappings";

interface Props {
  value: string | undefined;
  mapping: Record<string, StatusMapping>;
  defaultMapping?: StatusMapping;
}

const defaultStatusMapping: StatusMapping = {
  bg: "bg-notice-500/40",
  dot: "bg-notice-500",
  titleKey: "statusIndicator.amendment.default",
};

export default function StatusIndicator({ value, mapping, defaultMapping = defaultStatusMapping }: Props) {
  const statusInfo = value ? mapping[value] || defaultMapping : defaultMapping;
  const { bg, dot, titleKey, namespace = "Common" } = statusInfo;

  const { t } = useTranslation(namespace);
  const title = t(titleKey);

  return (
    <div title={title} className={cn("w-3.5 h-3.5 flex items-center justify-center rounded-full", bg)}>
      <div className={cn("w-2 h-2 rounded-full", dot)} />
    </div>
  );
}
