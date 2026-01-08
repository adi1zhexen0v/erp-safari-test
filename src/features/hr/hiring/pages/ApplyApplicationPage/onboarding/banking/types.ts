export interface BankingResponse {
  bank_name: string;
  iban_account: string;
  bik_number: string;
  bank_certificate_file_url: string;
}

export interface BankingDto {
  bank_name: string;
  iban_account: string;
  bik_number: string;
  bank_certificate_file: File | null;
}

export interface BankingPostResponse {
  success: boolean;
  message: string;
  application_id: number;
}
