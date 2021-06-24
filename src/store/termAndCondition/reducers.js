import { initialState } from './states';

export const termAndCondition = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PUBLISH_TERM_CONDITION_SUCCESS': {
      return Object.assign({}, state, {
        publishTermAndConditionPage: action.data
      });
    }
    default:
      return state;
  }
};
