import { formatDateForContract } from "@/shared/utils";
import type { VehicleHandoverResponse, VehicleHandoverPreviewData } from "../types";

export function mapApiResponseToPreviewData(
  response: VehicleHandoverResponse,
  locale: "ru" | "kk" = "ru",
): VehicleHandoverPreviewData {
  const actDate = response.act_date
    ? formatDateForContract(new Date(response.act_date), locale)
    : formatDateForContract(new Date(), locale);

  return {
    act_date: actDate,
  };
}

