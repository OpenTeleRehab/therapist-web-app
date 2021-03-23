import { initialState } from './states';
import { CATEGORY_TYPES } from 'variables/category';

export const category = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_CATEGORY_REQUEST':
    case 'UPDATE_CATEGORY_REQUEST':
    case 'GET_CATEGORIES_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'CREATE_CATEGORY_SUCCESS':
    case 'CREATE_CATEGORY_FAIL':
    case 'UPDATE_CATEGORY_SUCCESS':
    case 'UPDATE_CATEGORY_FAIL':
    case 'GET_CATEGORIES_FAIL':
    case 'GET_CATEGORY_TREE_DATA_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    case 'GET_CATEGORIES_SUCCESS': {
      return Object.assign({}, state, {
        categories: action.data
      });
    }
    case 'GET_CATEGORY_SUCCESS': {
      return Object.assign({}, state, {
        category: action.data
      });
    }
    case 'GET_CATEGORY_TREE_DATA_SUCCESS': {
      if (action.activityType === CATEGORY_TYPES.EXERCISE) {
        return Object.assign({}, state, {
          exerciseCategoryTreeData: action.data
        });
      } else if (action.activityType === CATEGORY_TYPES.MATERIAL) {
        return Object.assign({}, state, {
          educationMaterialCategoryTreeData: action.data
        });
      } else if (action.activityType === CATEGORY_TYPES.QUESTIONNAIRE) {
        return Object.assign({}, state, {
          questionnaireCategoryTreeData: action.data
        });
      }

      return Object.assign({}, state, {
        categoryTreeData: action.data
      });
    }
    default:
      return state;
  }
};
