export interface IReferralAssignmentResource {
  id: number;
  date_of_birth: string;
  lead_and_supplementary_phc: string[];
  referred_by: string;
  status: string;
}
