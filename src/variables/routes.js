export const DASHBOARD = '/';
export const PROFILE = '/profile';
export const PROFILE_EDIT = '/profile#edit';
export const PROFILE_PASSWORD = '/profile#password';
export const PATIENT = '/patient';

export const LIBRARY = '/library';
export const EXERCISE_CREATE = LIBRARY + '/exercise/create';
export const EXERCISE_EDIT = LIBRARY + '/exercise/edit/:id';
export const EXERCISE_COPY = LIBRARY + '/exercise/copy/:id';
export const EDUCATION_MATERIAL_CREATE = LIBRARY + '/education_material/create';
export const EDUCATION_MATERIAL_EDIT = LIBRARY + '/education_material/edit/:id';
export const QUESTIONNAIRE_CREATE = LIBRARY + '/questionnaire/create';
export const LIBRARY_EDUCATION = LIBRARY + '?tab=education';
export const LIBRARY_QUESTIONNAIRE = LIBRARY + '?tab=questionnaire';
export const LIBRARY_PRESET_TREATMENT = LIBRARY + '?tab=preset_treatment';
export const LIBRARY_TREATMENT_PLAN_CREATE = LIBRARY + '/treatment-plan/create';
export const LIBRARY_TREATMENT_PLAN_DETAIL = LIBRARY + '/treatment-plan/:id';
export const LIBRARY_TREATMENT_PLAN_EDIT = LIBRARY + '/treatment-plan/edit/:id';

export const VIEW_PATIENT_DETAIL = `${PATIENT}/:patientId`;
export const TREATMENT_PLAN_CREATE_FOR_PATIENT = VIEW_PATIENT_DETAIL + '/treatment-plan/create';
export const TREATMENT_PLAN_EDIT = VIEW_PATIENT_DETAIL + '/treatment-plan/edit/:id';
export const VIEW_TREATMENT_PLAN_DETAIL = VIEW_PATIENT_DETAIL + '/treatment-plan/:id';
export const CHAT_OR_CALL = '/chat-or-call';
export const APPOINTMENT = '/appointment';
