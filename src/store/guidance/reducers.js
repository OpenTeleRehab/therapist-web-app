import { initialState } from './states';

export const guidance = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_GUIDANCES_SUCCESS': {
      return Object.assign({}, state, {
        guidances: action.data
      });
    }
    default:
      return state;
  }
};
