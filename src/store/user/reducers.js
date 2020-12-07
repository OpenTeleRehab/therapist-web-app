import { initialState } from './states';

export const user = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USERS_SUCCESS': {
      return Object.assign({}, state, {
        users: action.data,
        filters: action.filters
      });
    }
    default:
      return state;
  }
};
