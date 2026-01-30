export interface IReferralRequest {
  patient_id: number;
  to_clinic_id: number;
  to_region_id?: number;
  request_reason: string;
}

export interface IReferralForm {
  patient_id: number;
  country_name: string;
  region_id: number;
  province_id: number;
  to_clinic_id: number;
  request_reason: string;
}
