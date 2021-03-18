import { initialState } from './states';

export const rocketchat = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CHAT_AUTH_TOKEN_SUCCESS': {
      return Object.assign({}, state, {
        authToken: action.data
      });
    }
    case 'SELECT_PATIENT_SUCCESS': {
      return Object.assign({}, state, {
        selectedPatient: action.data
      });
    }
    case 'LOAD_LAST_MESSAGE_HISTORY': {
      return Object.assign({}, state, {
        lastMessages: action.data
      });
    }
    case 'LOAD_ALL_MESSAGES_SUCCESS': {
      return Object.assign({}, state, {
        messages: action.data
      });
    }
    case 'PREPEND_NEW_MESSAGE_SUCCESS': {
      const fIndex = state.messages.findIndex(msg => msg._id === action.data._id);
      if (fIndex === -1) {
        return Object.assign({}, state, {
          messages: [action.data, ...state.messages]
        });
      }
      return state;
    }
    default:
      return state;
  }
};
