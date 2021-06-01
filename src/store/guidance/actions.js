import { Guidance } from 'services/guidance';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';

export const getGuidances = () => async (dispatch, getState) => {
  const profile = getState().auth.profile;
  dispatch(mutation.getGuidancesRequest());
  const res = await Guidance.getGuidances(profile.language_id);

  if (res.success) {
    dispatch(mutation.getGuidancesSuccess(res.data));
  } else {
    dispatch(mutation.getGuidancesFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
  }
};
