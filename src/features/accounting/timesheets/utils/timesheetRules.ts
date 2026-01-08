import type { TimesheetStatus, TimesheetResponse } from "../types";

export function canEditTimesheet(timesheet: TimesheetResponse): boolean {
  return timesheet.status === "draft";
}

export function canApproveTimesheet(timesheet: TimesheetResponse): boolean {
  return timesheet.status === "draft";
}

export function canDeleteTimesheet(timesheet: TimesheetResponse): boolean {
  return timesheet.status === "draft";
}

export function getTimesheetAvailableActions(status: TimesheetStatus): string[] {
  switch (status) {
    case "draft":
      return ["open", "approve", "delete", "download"];
    case "approved":
      return ["open", "download"];
    default:
      return ["open"];
  }
}

