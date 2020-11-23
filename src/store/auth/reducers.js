import { initialState } from './states';

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PROFILE_SUCCESS': {
      return Object.assign({}, state, {
        profile: action.data
      });
    }
    default:
      return state;
  }
};
