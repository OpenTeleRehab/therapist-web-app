import { initialState } from './states';

export const survey = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PUBLISH_SURVEY_SUCCESS': {
      return Object.assign({}, state, {
        publishSurveys: action.data
      });
    }
    default:
      return state;
  }
};
