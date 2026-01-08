export interface ExperienceRecord {
  id: number;
  organization_name: string;
  work_position: string;
  beginning_date: string;
  end_date: string | null;
}

export interface CreateExperienceDto {
  organization_name: string;
  work_position: string;
  beginning_date: string;
  end_date: string | null | number;
}

export interface CreateExperienceResponse {
  success: boolean;
  experience_id: number;
}

export interface WorkProofStatus {
  work_proof_file_url: string;
  has_work_proof: boolean;
}

export interface WorkProofUploadResponse {
  success: boolean;
  message: string;
}
