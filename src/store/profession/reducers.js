import { initialState } from './states';

export const profession = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PROFESSIONS_SUCCESS': {
      return Object.assign({}, state, {
        professions: action.data
      });
    }
    default:
      return state;
  }
};
