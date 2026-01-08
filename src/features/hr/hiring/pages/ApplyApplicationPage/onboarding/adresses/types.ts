export interface AddressesResponse {
  address_registration: string;
  address_factual: string;
}

export type AddressesDto = AddressesResponse;

export interface AddressesPatchResponse {
  success: boolean;
  message: string;
  application_id: number;
}
