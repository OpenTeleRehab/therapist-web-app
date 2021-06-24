import { initialState } from './states';

export const country = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_COUNTRIES_SUCCESS': {
      return Object.assign({}, state, {
        countries: action.data
      });
    }
    case 'GET_DEFINED_COUNTRIES_SUCCESS': {
      return Object.assign({}, state, {
        definedCountries: action.data
      });
    }
    default:
      return state;
  }
};
