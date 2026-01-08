export interface ContactsResponse {
  email: string;
  phone: string;
  phone_additional?: string;
}

export type ContactsDto = ContactsResponse;

export interface ContactsPatchResponse {
  success: boolean;
  message: string;
  application_id: number;
}
