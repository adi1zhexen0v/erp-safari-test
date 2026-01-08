export interface SocialCategoryRecord {
  id: number;
  category_type: string;
  document_file_url: string;
  issue_date?: string;
  expiry_date?: string;
  notes?: string;
}

export interface CreateSocialCategoryDto {
  category_type: string;
  document_file: File;
  issue_date?: string;
  expiry_date?: string;
  notes?: string;
}

export interface CreateSocialCategoryResponse {
  success: boolean;
  category_id: number;
}

