export const APPOINTMENT_STATUS = {
  INVITED: 'invited',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

export const APPOINTMENT_RECIPIENT_TYPES = {
  THERAPIST: 'therapist',
  PHC_WORKER: 'phc_worker',
  PATIENT: 'patient'
};

export const APPOINTMENT_OPTIONS = [
  {
    label: 'appointment.patient',
    value: APPOINTMENT_RECIPIENT_TYPES.PATIENT,
  },
  {
    label: 'appointment.phc_worker',
    value: APPOINTMENT_RECIPIENT_TYPES.PHC_WORKER,
  },
  {
    label: 'appointment.therapist',
    value: APPOINTMENT_RECIPIENT_TYPES.THERAPIST,
  },
];
