export type TimesheetStatus = "draft" | "approved";
export type DailyData = Record<string, DailyStatusCode>;
export type DailyStatusCode = "" | "8" | "4" | "В" | "О" | "Б" | "А" | "К" | "Р" | "П";

