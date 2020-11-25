import { initialState } from './states';

export const country = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_COUNTRIES_SUCCESS': {
      return Object.assign({}, state, {
        countries: action.data
      });
    }
    default:
      return state;
  }
};
