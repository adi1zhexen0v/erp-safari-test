export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface EmergencyContactsResponse {
  contact_1: EmergencyContact;
  contact_2: EmergencyContact;
}

export type EmergencyContactsDto = EmergencyContactsResponse;

export interface EmergencyContactsPatchResponse {
  success: boolean;
  message: string;
  application_id: number;
}
