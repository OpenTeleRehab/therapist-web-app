export const DASHBOARD = '/';
export const PROFILE = '/profile';
export const PROFILE_EDIT = '/profile#edit';
export const PROFILE_PASSWORD = '/profile#password';
export const PATIENT = '/patient';
export const LIBRARY = '/library';
export const EXERCISE_CREATE = LIBRARY + '/exercise/create';
export const EDUCATION_MATERIAL_CREATE = LIBRARY + '/education_material/create';
export const QUESTIONNAIRE_CREATE = LIBRARY + '/questionnaire/create';
export const LIBRARY_EDUCATION = LIBRARY + '#education';
export const LIBRARY_QUESTIONNAIRE = LIBRARY + '#questionnaire';
export const LIBRARY_PRESET_TREATMENT = LIBRARY + '#preset_treatment';
export const TREATMENT_PLAN_CREATE = '/treatment-plan/create';

export const VIEW_PATIENT_DETAIL = `${PATIENT}/:patientId`;
export const TREATMENT_PLAN_CREATE_FOR_PATIENT = VIEW_PATIENT_DETAIL + '/treatment-plan/create';
export const TREATMENT_PLAN_EDIT = VIEW_PATIENT_DETAIL + '/treatment-plan/edit/:id';
export const VIEW_TREATMENT_PLAN_DETAIL = VIEW_PATIENT_DETAIL + '/treatment-plan/:id';
export const CHAT_OR_CALL = '/chat-or-call';
