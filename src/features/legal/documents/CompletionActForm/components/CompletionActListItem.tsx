import { useTranslation } from "react-i18next";
import { DocumentText1, Clock, TickCircle, CloseCircle } from "iconsax-react";
import { Badge } from "@/shared/ui";
import type { BadgeColor } from "@/shared/ui/Badge";
import { COMPLETION_ACT_STATUS_MAP } from "../types";
import type { CompletionActListItem as CompletionActListItemType, CompletionActStatus } from "../types";

interface Props {
  act: CompletionActListItemType;
  onClick: () => void;
}

const STATUS_CONFIG: Record<CompletionActStatus, { color: BadgeColor; icon: React.ReactElement }> = {
  draft: {
    color: "info",
    icon: <DocumentText1 size={14} color="currentColor" />,
  },
  pending_review: {
    color: "notice",
    icon: <Clock size={14} color="currentColor" />,
  },
  approved: {
    color: "positive",
    icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
  },
  rejected: {
    color: "negative",
    icon: <CloseCircle size={14} color="currentColor" />,
  },
};

export default function CompletionActListItem({ act, onClick }: Props) {
  const { i18n } = useTranslation("LegalApplicationsPage");
  const locale = i18n.language === "kk" ? "kk" : "ru";

  const statusLabel = COMPLETION_ACT_STATUS_MAP[act.status][locale];
  const statusConfig = STATUS_CONFIG[act.status];

  return (
    <div
      className="flex items-center justify-between gap-3 p-3 radius-sm border surface-base-stroke cursor-pointer hover:surface-component-fill transition-colors"
      onClick={onClick}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center surface-component-fill content-action-neutral shrink-0">
          <DocumentText1 size={16} color="currentColor" />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-body-bold-sm content-base-primary">{act.display_number}</span>
          </div>
          <div>
            <span className="text-body-regular-xs content-base-secondary truncate">
              {act.service_item.service_name}
            </span>
          </div>
        </div>
      </div>

      <Badge variant="soft" color={statusConfig.color} text={statusLabel} icon={statusConfig.icon} />
    </div>
  );
}
