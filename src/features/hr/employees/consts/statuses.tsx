import { AddCircle, PauseCircle, SunFog, TickCircle, CloseCircle } from "iconsax-react";

export const STATUS_MAP = {
  active: {
    label: "status.active",
    color: "positive",
    icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
  },
  annual_leave: {
    label: "status.vacation",
    color: "gray",
    icon: <SunFog size={14} color="currentColor" />,
  },
  unpaid_leave: {
    label: "status.unpaid",
    color: "gray",
    icon: <PauseCircle size={14} color="currentColor" variant="Bold" />,
  },
  medical_leave: {
    label: "status.medical_leave",
    color: "negative",
    icon: <AddCircle size={14} color="currentColor" variant="Bold" />,
  },
  inactive: {
    label: "status.inactive",
    color: "gray",
    icon: <PauseCircle size={14} color="currentColor" variant="Bold" />,
  },
  resigned: {
    label: "status.resigned",
    color: "negative",
    icon: <CloseCircle size={14} color="currentColor" variant="Bold" />,
  },
} as const;

