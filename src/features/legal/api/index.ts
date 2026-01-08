import { baseApi } from "@/shared/api";
import type { VehicleRentContract } from "../documents/VehicleRentForm/types";
import type { PremiseRentContract } from "../documents/PremiseRentForm/types";
import type { ServiceContractContract } from "../documents/ServiceContractForm/types/api";
import type { VehicleHandoverAct } from "../documents/VehicleHandoverForm/types/api";
import type { PremisesHandoverAct } from "../documents/PremisesHandoverForm/types";
import type { ServiceAgreementMSBContract } from "../documents/ServiceAgreementMSBForm/types/api";
import type { GoodsSupplyContract } from "../documents/GoodsSupplyForm/types";
import type { CompletionActListItem } from "../documents/CompletionActForm/types";
import type { CommercialOrganization } from "../types/commercialOrganizations";

export interface AllLegalDocumentsResponse {
  vehicle_rentals: VehicleRentContract[];
  vehicle_handovers: VehicleHandoverAct[];
  premises_leases: PremiseRentContract[];
  premises_handovers: PremisesHandoverAct[];
  service_agreements_individual: ServiceContractContract[];
  service_agreements_msb: ServiceAgreementMSBContract[];
  goods_supply: GoodsSupplyContract[];
  completion_acts: CompletionActListItem[];
}

export const allLegalDocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLegalDocuments: builder.query<AllLegalDocumentsResponse, void>({
      query: () => ({
        url: "/api/legal/all",
        method: "GET",
      }),
      providesTags: [
        { type: "VehicleRentals" as const, id: "LIST" },
        { type: "PremisesLeases" as const, id: "LIST" },
        { type: "ServiceAgreementsIndividual" as const, id: "LIST" },
        { type: "VehicleHandovers" as const, id: "LIST" },
        { type: "PremisesHandovers" as const, id: "LIST" },
        { type: "ServiceAgreementsMSB" as const, id: "LIST" },
        { type: "GoodsSupply" as const, id: "LIST" },
        { type: "CompletionActs" as const, id: "LIST" },
      ],
    }),

    getCommercialOrganizations: builder.query<CommercialOrganization[], void>({
      query: () => ({
        url: "/api/legal/commercial-organizations/",
        method: "GET",
      }),
      transformResponse: (response: CommercialOrganization[]) => response,
    }),

    searchCommercialOrganizationByBin: builder.query<CommercialOrganization, string>({
      query: (bin) => ({
        url: `/api/legal/commercial-organizations/search/?bin=${bin}`,
        method: "GET",
      }),
      transformResponse: (response: CommercialOrganization) => response,
    }),
  }),
});

export const {
  useGetAllLegalDocumentsQuery,
  useGetCommercialOrganizationsQuery,
  useSearchCommercialOrganizationByBinQuery,
} = allLegalDocumentsApi;

