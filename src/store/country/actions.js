import { Country } from 'services/country';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getCountries = () => async dispatch => {
  dispatch(mutation.getCountriesRequest());
  const data = await Country.getCountries();
  if (data.success) {
    dispatch(mutation.getCountriesSuccess(data.data));
  } else {
    dispatch(mutation.getCountriesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
