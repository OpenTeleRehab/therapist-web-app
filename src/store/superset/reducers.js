import { initialState } from './states';

export const superset = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_GUEST_TOKEN_SUCCESS': {
      return Object.assign({}, state, {
        guestToken: action.data.guest_token,
        exp: action.data.expiration_time
      });
    }
    default:
      return state;
  }
};
