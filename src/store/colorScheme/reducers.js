import { initialState } from './states';

export const colorScheme = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_COLOR_SCHEME_SUCCESS': {
      return Object.assign({}, state, {
        colorScheme: action.data
      });
    }
    default:
      return state;
  }
};
