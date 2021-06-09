import { initialState } from './states';

export const disease = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DISEASES_SUCCESS': {
      return Object.assign({}, state, {
        diseases: action.data
      });
    }
    default:
      return state;
  }
};
