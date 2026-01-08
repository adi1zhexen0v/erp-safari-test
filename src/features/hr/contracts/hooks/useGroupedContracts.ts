import { useMemo } from "react";
import type { ResignationLetterResponse } from "@/features/hr/resignation-letters";
import type { ListContractsResponse, AmendmentResponse } from "@/features/hr/contracts/types";

export interface GroupedContract {
  contract: ListContractsResponse;
  resignationLetters: ResignationLetterResponse[];
  amendments: AmendmentResponse[];
}

export function useGroupedContracts(
  contracts: ListContractsResponse[],
  resignationLettersData: ResignationLetterResponse[] | undefined,
  amendmentsData: AmendmentResponse[] | undefined,
): GroupedContract[] {
  return useMemo(() => {
    const resignationLetters = resignationLettersData ?? [];
    const amendments = amendmentsData ?? [];

    return contracts.map((contract) => {
      const matchingResignationLetters = resignationLetters.filter(
        (resignation) => contract.worker && resignation.worker.id === contract.worker.id,
      );
      const matchingAmendments = amendments.filter(
        (amendment) => contract.worker && amendment.worker.id === contract.worker.id,
      );
      return {
        contract,
        resignationLetters: matchingResignationLetters,
        amendments: matchingAmendments,
      };
    });
  }, [contracts, resignationLettersData, amendmentsData]);
}
