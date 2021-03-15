import { Exercise } from 'services/exercise';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';

export const getExercises = payload => async dispatch => {
  dispatch(mutation.getExercisesRequest());
  const data = await Exercise.getExercises(payload);
  if (data.success) {
    dispatch(mutation.getExercisesSuccess(data.data, payload));
    return data.info;
  } else {
    dispatch(mutation.getExercisesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const clearFilterExercises = () => async dispatch => {
  dispatch(mutation.clearFilterExercisesRequest());
};
