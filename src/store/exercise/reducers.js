import { initialState } from './states';

export const exercise = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_EXERCISES_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'GET_EXERCISES_SUCCESS': {
      return Object.assign({}, state, {
        exercises: action.data,
        filters: action.filters,
        loading: false
      });
    }
    case 'GET_EXERCISES_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    case 'GET_EXERCISE_SUCCESS': {
      return Object.assign({}, state, {
        exercise: action.data
      });
    }
    case 'CLEAR_FILTER_EXERCISES_REQUEST': {
      return Object.assign({}, state, {
        filters: {}
      });
    }
    default:
      return state;
  }
};
