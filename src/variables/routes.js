export const DASHBOARD = '/';
export const PROFILE = '/profile';
export const PROFILE_EDIT = '/profile#edit';
export const PROFILE_PASSWORD = '/profile#password';
export const PATIENT = '/patient';
export const VIEW_PATIENT_DETAIL = `${PATIENT}/:patientId`;
export const TREATMENT_PLAN_CREATE_FOR_PATIENT = VIEW_PATIENT_DETAIL + '/treatment-plan/create';
export const TREATMENT_PLAN_EDIT = VIEW_PATIENT_DETAIL + '/treatment-plan/edit/:id';
