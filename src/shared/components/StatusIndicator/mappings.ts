import { RESIGNATION_STATUS_MAP } from "@/features/hr/resignation-letters/consts/statuses";
import type { ResignationStatus } from "@/features/hr/resignation-letters/types";

export interface StatusMapping {
  bg: string;
  dot: string;
  titleKey: string;
  namespace?: string;
}

export const AMENDMENT_STATUS_MAPPING: Record<string, StatusMapping> = {
  cancelled: {
    bg: "bg-negative-500/40",
    dot: "bg-negative-500",
    titleKey: "statusIndicator.amendment.cancelled",
  },
  applied: {
    bg: "bg-positive-500/40",
    dot: "bg-positive-500",
    titleKey: "statusIndicator.amendment.applied",
  },
};

export const AMENDMENT_DEFAULT: StatusMapping = {
  bg: "bg-notice-500/40",
  dot: "bg-notice-500",
  titleKey: "statusIndicator.amendment.default",
};

export const JOB_APPLICATION_STATUS_MAPPING: Record<string, StatusMapping> = {
  contract_signed: {
    bg: "bg-info-500/40",
    dot: "bg-info-400",
    titleKey: "statusIndicator.jobApplication.contractSigned",
  },
  decision: {
    bg: "bg-negative-500/40",
    dot: "bg-negative-500",
    titleKey: "statusIndicator.jobApplication.decision",
  },
  job_app_pending: {
    bg: "bg-notice-500/40",
    dot: "bg-notice-500",
    titleKey: "statusIndicator.jobApplication.jobAppPending",
  },
  job_app_review: {
    bg: "bg-notice-500/40",
    dot: "bg-notice-500",
    titleKey: "statusIndicator.jobApplication.jobAppReview",
  },
};

export const JOB_APPLICATION_DEFAULT: StatusMapping = {
  bg: "bg-positive-500/40",
  dot: "bg-positive-500",
  titleKey: "statusIndicator.jobApplication.default",
};

export const ORDER_STATUS_MAPPING: Record<string, StatusMapping> = {
  order_pending: {
    bg: "bg-notice-500/40",
    dot: "bg-notice-500",
    titleKey: "statusIndicator.order.orderPending",
  },
};

export const ORDER_DEFAULT: StatusMapping = {
  bg: "bg-positive-500/40",
  dot: "bg-positive-500",
  titleKey: "statusIndicator.order.default",
};

const colorToClasses: Record<string, { bg: string; dot: string }> = {
  notice: { bg: "bg-notice-500/40", dot: "bg-notice-500" },
  positive: { bg: "bg-positive-500/40", dot: "bg-positive-500" },
  negative: { bg: "bg-negative-500/40", dot: "bg-negative-500" },
  info: { bg: "bg-info-500/40", dot: "bg-info-500" },
};

export const RESIGNATION_STATUS_MAPPING: Record<string, StatusMapping> = Object.keys(RESIGNATION_STATUS_MAP).reduce(
  (acc, key) => {
    const status = key as ResignationStatus;
    const statusInfo = RESIGNATION_STATUS_MAP[status];
    const colors = colorToClasses[statusInfo.color] || colorToClasses.info;

    acc[status] = {
      bg: colors.bg,
      dot: colors.dot,
      titleKey: statusInfo.label,
      namespace: "ContractsPage",
    };

    return acc;
  },
  {} as Record<string, StatusMapping>,
);
