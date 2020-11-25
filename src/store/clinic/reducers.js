import { initialState } from './states';

export const clinic = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CLINICS_SUCCESS': {
      return Object.assign({}, state, {
        clinics: action.data
      });
    }
    default:
      return state;
  }
};
