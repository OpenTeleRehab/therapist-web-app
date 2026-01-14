export interface IReferralAssignmentResource {
  id: number;
  first_name: string;
  last_name: string;
  patient_identity: string;
  date_of_birth: string;
  lead_and_supplementary_phc: string[];
  request_reason: string | null;
  referred_by: string;
  status: string;
}
