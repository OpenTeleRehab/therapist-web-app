const getExercisesRequest = () => ({
  type: 'GET_EXERCISES_REQUEST'
});

const getExercisesSuccess = (data, filters, info) => ({
  type: 'GET_EXERCISES_SUCCESS',
  data,
  filters,
  info
});

const getExercisesFail = () => ({
  type: 'GET_EXERCISES_FAIL'
});

const getExerciseRequest = () => ({
  type: 'GET_EXERCISE_REQUEST'
});

const getExerciseSuccess = (data) => ({
  type: 'GET_EXERCISE_SUCCESS',
  data
});

const getExerciseFail = () => ({
  type: 'GET_EXERCISE_FAIL'
});

const createExerciseRequest = () => ({
  type: 'CREATE_EXERCISE_REQUEST'
});

const createExerciseSuccess = (data) => ({
  type: 'CREATE_EXERCISE_SUCCESS',
  data
});

const createExerciseFail = () => ({
  type: 'CREATE_EXERCISE_FAIL'
});

const updateExerciseRequest = () => ({
  type: 'UPDATE_EXERCISE_REQUEST'
});

const updateExerciseSuccess = (data) => ({
  type: 'UPDATE_EXERCISE_SUCCESS',
  data
});

const updateExerciseFail = () => ({
  type: 'UPDATE_EXERCISE_FAIL'
});

const updateFavoriteRequest = () => ({
  type: 'UPDATE_FAVORITE_REQUEST'
});

const updateFavoriteSuccess = () => ({
  type: 'UPDATE_FAVORITE_SUCCESS'
});

const updateFavoriteFail = () => ({
  type: 'UPDATE_FAVORITE_FAIL'
});

const deleteExerciseRequest = () => ({
  type: 'DELETE_EXERCISE_REQUEST'
});

const deleteExerciseSuccess = (data) => ({
  type: 'DELETE_EXERCISE_SUCCESS',
  data
});

const deleteExerciseFail = () => ({
  type: 'DELETE_EXERCISE_FAIL'
});

const clearFilterExercisesRequest = () => ({
  type: 'CLEAR_FILTER_EXERCISES_REQUEST'
});

export const mutation = {
  getExercisesFail,
  getExercisesRequest,
  getExercisesSuccess,
  getExerciseRequest,
  getExerciseSuccess,
  getExerciseFail,
  createExerciseRequest,
  createExerciseSuccess,
  createExerciseFail,
  updateExerciseRequest,
  updateExerciseSuccess,
  updateExerciseFail,
  deleteExerciseRequest,
  deleteExerciseSuccess,
  deleteExerciseFail,
  clearFilterExercisesRequest,
  updateFavoriteRequest,
  updateFavoriteFail,
  updateFavoriteSuccess
};
