import { initialState } from './states';

export const questionnaire = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_QUESTIONNAIRES_SUCCESS': {
      return Object.assign({}, state, {
        questionnaires: action.data,
        filters: action.filters
      });
    }
    default:
      return state;
  }
};
