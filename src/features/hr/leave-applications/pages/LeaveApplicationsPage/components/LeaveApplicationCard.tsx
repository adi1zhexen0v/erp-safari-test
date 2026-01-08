import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "iconsax-react";
import {
  type LeaveApplication,
  type LeaveAction,
  LeaveDetailsModal,
  LEAVE_STATUS_MAP,
  LEAVE_TYPE_MAP,
  getStatusText,
} from "@/features/hr/leave-applications";
import { Badge } from "@/shared/ui";
import { formatDateDDMMYYYY, type Locale } from "@/shared/utils";
import LeaveApplicationActionsButtons from "./LeaveApplicationActionsButtons";

interface Props {
  leave: LeaveApplication;
  locale: Locale;
  isLoading: {
    isDeleting: boolean;
  };
  deletingLeaveId: number | null;
  onAction: (action: LeaveAction, leave: LeaveApplication) => void;
  onEdit: (leave: LeaveApplication) => void;
}

export default function LeaveApplicationCard({ leave, isLoading, deletingLeaveId, onAction, onEdit }: Props) {
  const { t } = useTranslation("LeaveApplicationsPage");
  const [showDetails, setShowDetails] = useState(false);

  const periodText = useMemo(
    function () {
      const start = formatDateDDMMYYYY(leave.start_date);
      const end = formatDateDDMMYYYY(leave.end_date);
      return `${start} - ${end}`;
    },
    [leave.start_date, leave.end_date],
  );

  const leaveTypeConfig = useMemo(
    function () {
      const config = LEAVE_TYPE_MAP[leave.leave_type];
      return {
        label: t(config.label),
        icon: config.icon,
        color: config.color,
      };
    },
    [leave.leave_type, t],
  );

  function handleCardClick() {
    setShowDetails(true);
  }

  function handleDetailsClose() {
    setShowDetails(false);
  }

  function handleStopPropagation(e: React.MouseEvent) {
    e.stopPropagation();
  }

  const statusConfig = LEAVE_STATUS_MAP[leave.status];
  const statusText = statusConfig ? getStatusText(leave, t) : "";

  return (
    <div
      className="flex flex-col gap-4 radius-lg border surface-base-stroke surface-base-fill p-5 cursor-pointer relative"
      onClick={handleCardClick}>
      <div className="flex flex-col gap-2">
        <Badge variant="soft" color={leaveTypeConfig.color} text={leaveTypeConfig.label} icon={leaveTypeConfig.icon} />
        <p className="text-body-bold-lg content-base-primary">{leave.worker.full_name}</p>
      </div>

      <div className="border-t surface-base-stroke"></div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-body-bold-xs content-base-secondary">{t("cards.status")}</p>
          {statusConfig && (
            <Badge variant="outline" color={statusConfig.color} text={statusText} icon={statusConfig.icon} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-body-bold-xs content-base-secondary">{t("cards.period")}</p>
          <div className="flex items-center gap-1.5">
            <span className="content-action-brand">
              <Calendar size={16} color="currentColor" />
            </span>
            <p className="text-body-regular-sm content-base-primary">{periodText}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-body-bold-xs content-base-secondary">{t("cards.duration")}</p>
          <div className="flex items-center gap-1.5">
            <span className="content-action-brand">
              <Calendar size={16} color="currentColor" />
            </span>
            <p className="text-body-regular-sm content-base-primary">
              {leave.days_count} {t("cards.days")}
            </p>
          </div>
        </div>
      </div>

      <div onClick={handleStopPropagation}>
        <LeaveApplicationActionsButtons
          leave={leave}
          isLoading={isLoading}
          deletingLeaveId={deletingLeaveId}
          onAction={onAction}
          onEdit={onEdit}
        />
      </div>

      {showDetails && <LeaveDetailsModal leave={leave} onClose={handleDetailsClose} />}
    </div>
  );
}

