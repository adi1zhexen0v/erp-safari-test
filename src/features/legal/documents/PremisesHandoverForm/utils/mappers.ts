import { formatDateForContract } from "@/shared/utils";
import type { PremisesHandoverResponse, PremisesHandoverPreviewData } from "../types";

export function mapApiResponseToPreviewData(
  response: PremisesHandoverResponse,
  locale: "ru" | "kk" = "ru",
): PremisesHandoverPreviewData {
  const actDate = response.act_date
    ? formatDateForContract(new Date(response.act_date), locale)
    : formatDateForContract(new Date(), locale);

  return {
    act_date: actDate,
  };
}

