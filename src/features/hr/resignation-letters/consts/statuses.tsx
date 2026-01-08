import { DocumentText1, Clock, TickCircle, CloseCircle } from "iconsax-react";
import type { ResignationStatus } from "../types";

export const RESIGNATION_STATUS_MAP: Record<
  ResignationStatus,
  {
    label: string;
    color: "info" | "positive" | "notice" | "negative";
    icon: React.ReactNode;
  }
> = {
  draft: {
    label: "statusLabels.draft",
    color: "info",
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
  completed: {
    label: "statusLabels.completed",
    color: "positive",
    icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
  },
  cancelled: {
    label: "statusLabels.cancelled",
    color: "negative",
    icon: <CloseCircle size={14} color="currentColor" variant="Bold" />,
  },
} as const;

