import { initialState } from './states';

export const message = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MESSAGES_SUCCESS': {
      return Object.assign({}, state, {
        messages: action.data
      });
    }
    case 'GET_THERAPIST_MESSAGE_SUCCESS': {
      return Object.assign({}, state, {
        totalMessages: action.data
      });
    }
    default:
      return state;
  }
};
