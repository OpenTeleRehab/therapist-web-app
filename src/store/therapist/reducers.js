import { initialState } from './states';

export const therapist = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_THERAPISTS_BY_CLINIC_SUCCESS': {
      return Object.assign({}, state, {
        therapistsByClinic: action.data
      });
    }
    default:
      return state;
  }
};
