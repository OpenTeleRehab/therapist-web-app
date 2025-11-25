import { initialState } from './states';

export const healthConditionGroup = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_HEALTH_CONDITION_GROUPS_SUCCESS': {
      return Object.assign({}, state, {
        healthConditionGroups: action.data
      });
    }
    default:
      return state;
  }
};
