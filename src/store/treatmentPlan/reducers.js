import { initialState } from './states';

export const treatmentPlan = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TREATMENT_PLANS_SUCCESS': {
      return Object.assign({}, state, {
        treatmentPlans: action.data
      });
    }
    default:
      return state;
  }
};
