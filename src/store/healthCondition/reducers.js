import { initialState } from './states';

export const healthCondition = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_HEALTH_CONDITIONS_SUCCESS': {
      return Object.assign({}, state, {
        healthConditions: action.data
      });
    }
    default:
      return state;
  }
};
