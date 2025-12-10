export interface IReferralRequest {
  patient_id: number;
  to_clinic_id: number;
}

export interface IReferralForm {
  patient_id: number;
  country_name: string;
  region_id: number;
  province_id: number;
  to_clinic_id: number;
}
