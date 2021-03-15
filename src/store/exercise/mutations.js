const getExercisesRequest = () => ({
  type: 'GET_EXERCISES_REQUEST'
});

const getExercisesSuccess = (data, filters) => ({
  type: 'GET_EXERCISES_SUCCESS',
  data,
  filters
});

const getExercisesFail = () => ({
  type: 'GET_EXERCISES_FAIL'
});

const clearFilterExercisesRequest = () => ({
  type: 'CLEAR_FILTER_EXERCISES_REQUEST'
});

export const mutation = {
  getExercisesFail,
  getExercisesRequest,
  getExercisesSuccess,
  clearFilterExercisesRequest
};
