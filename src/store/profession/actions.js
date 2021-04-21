import { Profession } from 'services/profession';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';

export const getProfessions = (countryId) => async dispatch => {
  dispatch(mutation.getProfessionRequest());
  const data = await Profession.getProfession(countryId);
  if (data.success) {
    dispatch(mutation.getProfessionsSuccess(data.data));
  } else {
    dispatch(mutation.getProfessionsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
