export interface EducationRecord {
  id: number;
  degree: string;
  university_name: string;
  specialty: string;
  graduation_year: string;
  diploma_number: string;
  diploma_file_url: string;
  diploma_transcript_file_url: string;
}

export interface CreateEducationDto {
  degree: string;
  university_name: string;
  specialty: string;
  graduation_year: string;
  diploma_number: string;
  diploma_file: File | null;
  diploma_transcript_file: File | null;
}

export interface CreateEducationResponse {
  success: boolean;
  education_id: number;
}
