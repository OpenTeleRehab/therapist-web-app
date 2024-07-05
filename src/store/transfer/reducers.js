import { initialState } from './states';

export const transfer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TRANSFERS_SUCCESS': {
      return Object.assign({}, state, {
        transfers: action.data
      });
    }
    default:
      return state;
  }
};
