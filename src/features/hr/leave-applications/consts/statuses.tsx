import { DocumentText1, Clock, TickCircle, CloseCircle, SunFog, PauseCircle, AddCircle } from "iconsax-react";
import { formatDateForDisplay } from "@/shared/utils";
import type { LeaveStatus, LeaveType, LeaveApplication } from "../types";

export const LEAVE_STATUS_MAP: Record<
  LeaveStatus,
  {
    label: string;
    color: "gray" | "info" | "positive" | "notice" | "negative";
    icon: React.ReactNode;
  }
> = {
  draft: {
    label: "statusLabels.draft",
    color: "gray",
    icon: <DocumentText1 size={14} color="currentColor" />,
  },
  app_pending: {
    label: "statusLabels.app_pending",
    color: "notice",
    icon: <Clock size={14} color="currentColor" variant="Bold" />,
  },
  app_review: {
    label: "statusLabels.app_review",
    color: "notice",
    icon: <Clock size={14} color="currentColor" variant="Bold" />,
  },
  app_approved: {
    label: "statusLabels.app_approved",
    color: "notice",
    icon: <Clock size={14} color="currentColor" variant="Bold" />,
  },
  order_pending: {
    label: "statusLabels.order_pending",
    color: "notice",
    icon: <Clock size={14} color="currentColor" variant="Bold" />,
  },
  order_uploaded: {
    label: "statusLabels.order_uploaded",
    color: "positive",
    icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
  },
  active: {
    label: "statusLabels.active",
    color: "positive",
    icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
  },
  completed: {
    label: "statusLabels.completed",
    color: "gray",
    icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
  },
  cancelled: {
    label: "statusLabels.cancelled",
    color: "negative",
    icon: <CloseCircle size={14} color="currentColor" variant="Bold" />,
  },
} as const;

export const LEAVE_TYPE_MAP: Record<
  LeaveType,
  {
    label: string;
    color: "gray" | "info" | "positive" | "notice" | "negative";
    icon: React.ReactNode;
  }
> = {
  annual: {
    label: "cards.leaveTypeLabels.annual",
    color: "gray",
    icon: <SunFog size={14} color="currentColor" variant="Bold" />,
  },
  unpaid: {
    label: "cards.leaveTypeLabels.unpaid",
    color: "gray",
    icon: <PauseCircle size={14} color="currentColor" variant="Bold" />,
  },
  medical: {
    label: "cards.leaveTypeLabels.medical",
    color: "negative",
    icon: <AddCircle size={14} color="currentColor" variant="Bold" />,
  },
} as const;

export function getStatusText(
  leave: LeaveApplication,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const statusConfig = LEAVE_STATUS_MAP[leave.status];
  if (!statusConfig) return "";

  let statusText = t(statusConfig.label);

  if (leave.status === "active" && leave.start_date) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (leave.start_date > todayStr) {
      const formattedDate = formatDateForDisplay(leave.start_date, false);
      statusText = t("statusLabels.activeFrom", { date: formattedDate });
    }
  }

  return statusText;
}
