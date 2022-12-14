import { initialState } from './states';

export const assistiveTechnology = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PATIENT_ASSISTIVE_TECHNOLOGIES_SUCCESS': {
      return Object.assign({}, state, {
        patientAssistiveTechnologies: action.data
      });
    }
    case 'GET_ASSISTIVE_TECHNOLOGIES_SUCCESS': {
      return Object.assign({}, state, {
        assistiveTechnologies: action.data
      });
    }
    default:
      return state;
  }
};
