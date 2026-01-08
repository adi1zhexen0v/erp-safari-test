export interface IdDocumentsResponse {
  national_id_number: string;
  national_id_issue_date: string;
  national_id_expiry_date: string;
  national_id_issued_by: string;
  national_id_file_url: string;
  military_certificate_file_url: string;
}

export interface IdDocumentsDto {
  national_id_number: string;
  national_id_issue_date: string;
  national_id_expiry_date: string;
  national_id_issued_by: string;
  national_id_file: File | null;
  military_certificate_file: File | null;
}

export interface IdDocumentsPostResponse {
  success: boolean;
  message: string;
  application_id: number;
}
