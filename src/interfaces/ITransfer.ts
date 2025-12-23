export interface ITransferRequest {
  patient_id: number;
  from_therapist_id: number;
  therapist_type: 'lead';
  phc_service_id: number;
  to_therapist_id: number;
}
