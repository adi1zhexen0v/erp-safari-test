import { useMemo } from "react";
import type { GroupedContract } from "./useGroupedContracts";

export type ApplicationItem =
  | {
      type: "job_application";
      contractId: number;
      candidateId: number | null;
      date: string;
    }
  | {
      type: "order";
      contractId: number;
      candidateId: number | null;
      date: string;
    }
  | {
      type: "resignation_letter";
      resignationId: number;
      date: string;
    }
  | {
      type: "amendment";
      amendmentId: number;
      date: string;
    };

interface UseApplicationItemsParams {
  contracts: GroupedContract[];
}

export function useApplicationItems({ contracts }: UseApplicationItemsParams) {
  const applicationItemsMap = useMemo(() => {
    const map = new Map<number, ApplicationItem[]>();

    contracts.forEach(({ contract, resignationLetters, amendments }) => {
      const items: ApplicationItem[] = [];

      if (contract.candidate_application_id !== null || contract.worker !== null) {
        const jobApplicationDate = contract.job_application?.created_at || contract.created_at || "";

        items.push({
          type: "job_application",
          contractId: contract.id,
          candidateId: contract.candidate_application_id,
          date: jobApplicationDate,
        });

        items.push({
          type: "order",
          contractId: contract.id,
          candidateId: contract.candidate_application_id,
          date: jobApplicationDate,
        });
      }

      resignationLetters.forEach((resignation) => {
        items.push({
          type: "resignation_letter",
          resignationId: resignation.id,
          date: resignation.updated_at || resignation.created_at || "",
        });
      });

      amendments.forEach((amendment) => {
        items.push({
          type: "amendment",
          amendmentId: amendment.id,
          date: amendment.updated_at || amendment.created_at || "",
        });
      });

      map.set(contract.id, items);
    });

    return map;
  }, [contracts]);

  return applicationItemsMap;
}

