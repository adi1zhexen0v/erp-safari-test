export interface PersonalInfoResponse {
  iin: string;
  name: string;
  surname: string;
  father_name?: string;
  date_of_birth: string;
  gender: string;
  family_status: string;
  city_of_birth: {
    id: number;
    name_ru: string;
    name_kk: string;
  };
  city_of_birth_id: number;
  nationality: string;
  citizenship: string;
  photo_file_url: string;
  is_resident?: boolean;
  is_student?: boolean;
  enrollment_verification_file_url?: string;
}

export interface PersonalInfoDto {
  iin: string;
  name: string;
  surname: string;
  father_name?: string;
  date_of_birth: string;
  gender: string;
  family_status: string;
  city_of_birth_id: number;
  nationality: string;
  citizenship: string;
  photo_file: File | null;
  is_resident: boolean;
  is_student: boolean;
  enrollment_verification_file?: File | null;
}

export interface PersonalInfoPostResponse {
  success: boolean;
  message: string;
  application_id: number;
}
