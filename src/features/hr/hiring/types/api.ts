import type { ApplicationStage, ApplicationStatus } from "./domain";

export interface CreateCandidateDto {
  candidate_name: string;
  email: string;
  phone: string;
  job_position: string;
}

export interface CreateCandidateResponse {
  success: boolean;
  invitation_id: number;
  token: string;
  expires_at: string;
  candidate_name: string;
  email: string;
  job_position?: string;
}

export interface GetApplicationsResponse {
  id: number;
  candidate_name: string;
  has_contract: boolean;
  invitation_email: string;
  invitation_date: string;
  job_position: string;
  phone: string;
  iin: string;
  stage: ApplicationStage;
  status: ApplicationStatus;
  submitted_at: string | null;
  reviewed_at: string | null;
}

export interface ReviewApplicationDto {
  id: number;
  action: "approve" | "request_revision";
  notes?: string;
}

export interface ReviewApplicationResponse {
  success: boolean;
  message: string;
  new_status: ApplicationStatus;
  new_stage: ApplicationStage;
  new_token?: string;
  expires_at?: string;
  revision_count?: number;
}

export interface RejectApplicationDto {
  id: number;
  rejection_reason: string;
}

export interface RejectApplicationResponse {
  success: boolean;
  message: string;
}

export interface ApplicationDetailResponse {
  id: number;

  education: {
    id: number;
    degree: string;
    university_name: string;
    specialty: string;
    graduation_year: string;
    diploma_number: string;
  }[];

  work_experience: {
    id: number;
    organization_name: string;
    work_position: string;
    beginning_date: string;
    end_date: string | null;
  }[];

  reviewed_by_name: string | null;

  stage: ApplicationStage;
  status: ApplicationStatus;

  photo_file: string | null;
  national_id_file: string | null;
  military_certificate_file: string | null;
  bank_certificate_file: string | null;
  work_proof_file: string | null;

  reviewed_at: string | null;
  rejection_reason: string | null;
  revision_notes: string | null;

  created_at: string;
  updated_at: string;
  submitted_at: string | null;

  reviewed_by: number | null;
  job_position: string | null;

  personal_info: {
    iin: string;
    name: string;
    surname: string;
    father_name: string;
    date_of_birth: string;
    gender: string;
    family_status: string;
    city_of_birth: {
      id: number;
      name_ru: string;
      name_kk: string;
    };
    nationality: string;
    citizenship: string;
    is_resident: boolean;
    is_student: boolean;
  };

  contact_info: {
    email: string;
    phone: string;
    phone_additional: string | null;
  };

  addresses: {
    registration: string;
    factual: string;
  };

  emergency_contacts: {
    name: string;
    phone: string;
    relation: string;
  }[];

  id_documents: {
    national_id_number: string;
    national_id_issue_date: string;
    national_id_expiry_date: string;
    national_id_issued_by: string;
  };

  banking: {
    bank_name: string;
    iban_account: string;
    bik_number: string;
  };

  documents: {
    id: string;
    document_type: string;
    view_url: string;
    download_url: string;
    uploaded_at: string;
  }[];

  social_categories?: {
    id: number;
    category_type: string;
    category_type_display: string;
    document_file_url?: string;
    issue_date?: string;
    expiry_date?: string;
    notes?: string;
    created_at?: string;
  }[];
}

export interface SectionStatus {
  complete: boolean;
  missing_fields: string[];
  missing_files: string[];
  count?: number;
  incomplete_records?: string[];
}

export interface CompletenessResponse {
  is_complete: boolean;
  overall_progress: number;
  sections: {
    personal_data: SectionStatus;
    contacts: SectionStatus;
    addresses: SectionStatus;
    emergency_contacts: SectionStatus;
    id_documents: SectionStatus;
    banking: SectionStatus;
    education: SectionStatus;
    experience: SectionStatus;
    social_categories?: SectionStatus;
  };
}

export interface DraftData {
  id: number;
  iin: string;
  name: string;
  stage: string;
  status: string;
  [key: string]: unknown;
}

export interface ValidateTokenResponse {
  valid: boolean;
  email?: string;
  candidate_name?: string;
  has_draft?: boolean;
  draft_data?: DraftData | null;
  error?: string;
}
