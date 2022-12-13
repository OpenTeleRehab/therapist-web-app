export const initialState = {
  treatmentPlans: [],
  treatmentPlansDetail: {
    previewData: {
      exercises: [],
      materials: [],
      questionnaires: []
    }
  },
  presetTreatmentPlans: [],
  loading: false
};

export const treatmentPlan = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TREATMENT_PLANS_REQUEST':
    case 'GET_PRESET_TREATMENT_PLANS_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'GET_TREATMENT_PLANS_SUCCESS': {
      return Object.assign({}, state, {
        treatmentPlans: action.data,
        loading: false
      });
    }
    case 'GET_PRESET_TREATMENT_PLANS_SUCCESS': {
      return Object.assign({}, state, {
        presetTreatmentPlans: action.data,
        loading: false
      });
    }
    case 'GET_TREATMENT_PLANS_FAIL':
    case 'GET_PRESET_TREATMENT_PLANS_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    case 'GET_TREATMENT_PLANS_DETAIL_SUCCESS': {
      return Object.assign({}, state, {
        treatmentPlansDetail: action.data
      });
    }
    case 'UPDATE_TREATMENT_PLAN_SUCCESS': {
      const { id, data } = action;
      const treatmentPlans = state.treatmentPlans.map(t => t.id === parseInt(id) ? { ...t, ...data } : t);
      return Object.assign({}, state, { treatmentPlans });
    }
    case 'ADD_DATA_PREVIEW': {
      return Object.assign({}, state, {
        treatmentPlansDetail: {
          ...state.treatmentPlansDetail,
          previewData: action.data
        }
      });
    }
    default:
      return state;
  }
};
