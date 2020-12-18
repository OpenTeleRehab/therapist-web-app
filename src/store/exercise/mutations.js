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

export const mutation = {
  getExercisesFail,
  getExercisesRequest,
  getExercisesSuccess
};
