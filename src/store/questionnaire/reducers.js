import { initialState } from './states';

export const questionnaire = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_QUESTIONNAIRES_SUCCESS': {
      return Object.assign({}, state, {
        questionnaires: action.data,
        filters: action.filters,
        totalCount: action.info.total_count
      });
    }
    case 'GET_QUESTIONNAIRE_SUCCESS': {
      return Object.assign({}, state, {
        questionnaire: action.data
      });
    }
    case 'CLEAR_FILTER_QUESTIONNAIRES_REQUEST': {
      return Object.assign({}, state, {
        filters: {}
      });
    }
    default:
      return state;
  }
};
