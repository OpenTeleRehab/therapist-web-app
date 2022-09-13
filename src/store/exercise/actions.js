import { Exercise } from 'services/exercise';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from 'store/spinnerOverlay/actions';

export const getExercises = payload => async dispatch => {
  dispatch(mutation.getExercisesRequest());
  const data = await Exercise.getExercises(payload);
  if (data.success) {
    dispatch(mutation.getExercisesSuccess(data.data, payload, data.info));
  } else {
    dispatch(mutation.getExercisesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getExercise = (id, language) => async dispatch => {
  dispatch(mutation.getExerciseRequest());
  dispatch(showSpinner(true));
  const data = await Exercise.getExercise(id, language);
  if (data) {
    dispatch(mutation.getExerciseSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getExerciseFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createExercise = (payload, mediaUploads) => async dispatch => {
  dispatch(mutation.createExerciseRequest());
  const data = await Exercise.createExercise(payload, mediaUploads);
  if (data.success) {
    dispatch(mutation.createExerciseSuccess());
    dispatch(showSuccessNotification('toast_title.new_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.createExerciseFail());
    dispatch(showErrorNotification('toast_title.new_exercise', data.message));
    return false;
  }
};

export const updateExercise = (id, payload, mediaUploads) => async dispatch => {
  dispatch(mutation.updateExerciseRequest());
  const data = await Exercise.updateExercise(id, payload, mediaUploads);
  if (data.success) {
    dispatch(mutation.updateExerciseSuccess());
    dispatch(showSuccessNotification('toast_title.update_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.updateExerciseFail());
    dispatch(showErrorNotification('toast_title.update_exercise', data.message));
    return false;
  }
};

export const updateFavorite = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateFavoriteRequest());
  const data = await Exercise.updateFavorite(id, payload);
  if (data.success) {
    dispatch(mutation.updateFavoriteSuccess());
    const filters = getState().exercise.filters;
    dispatch(getExercises({ ...filters, therapist_id: payload.therapist_id }));
    dispatch(showSuccessNotification('toast_title.update_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.updateFavoriteFail());
    dispatch(showErrorNotification('toast_title.update_exercise', data.message));
    return false;
  }
};

export const deleteExercise = id => async (dispatch, getState) => {
  dispatch(mutation.deleteExerciseRequest());
  const data = await Exercise.deleteExercise(id);
  if (data.success) {
    dispatch(mutation.deleteExerciseSuccess());
    const filters = getState().exercise.filters;
    dispatch(getExercises(filters));
    dispatch(showSuccessNotification('toast_title.delete_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.deleteExerciseFail());
    dispatch(showErrorNotification('toast_title.delete_exercise', data.message));
    return false;
  }
};

export const translateExercise = (payload) => async dispatch => {
  dispatch(mutation.translateExerciseRequest());
  const data = await Exercise.translateExercise(payload);
  if (data.success) {
    dispatch(mutation.translateExerciseSuccess());
    dispatch(showSuccessNotification('toast_title.translate_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.translateExerciseFail());
    dispatch(showErrorNotification('toast_title.translate_exercise', data.message));
    return false;
  }
};

export const clearFilterExercises = () => async dispatch => {
  dispatch(mutation.clearFilterExercisesRequest());
};
