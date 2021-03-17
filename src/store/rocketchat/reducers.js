import { initialState } from './states';

export const rocketchat = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHAT_AUTO_TOKEN_SUCCESS': {
      return Object.assign({}, state, {
        authToken: action.data
      });
    }
    case 'SELECT_PATIENT_SUCCESS': {
      return Object.assign({}, state, {
        selectedPatient: action.data
      });
    }
    default:
      return state;
  }
};
