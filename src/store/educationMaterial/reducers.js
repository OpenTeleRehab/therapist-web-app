import { initialState } from './states';

export const educationMaterial = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_EDUCATION_MATERIALS_REQUEST':
    case 'GET_EDUCATION_MATERIALS_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    case 'GET_EDUCATION_MATERIALS_SUCCESS': {
      return Object.assign({}, state, {
        educationMaterials: action.data,
        filters: action.filters,
        loading: false
      });
    }
    case 'CLEAR_FILTER_EDUCATION_MATERIALS_REQUEST': {
      return Object.assign({}, state, {
        filters: {}
      });
    }
    default:
      return state;
  }
};
