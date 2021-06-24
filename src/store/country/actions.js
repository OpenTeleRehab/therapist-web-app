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

export const getDefinedCountries = () => async dispatch => {
  dispatch(mutation.getDefinedCountriesRequest());
  const data = await Country.getDefinedCountries();
  if (data.success) {
    dispatch(mutation.getDefinedCountriesSuccess(data.data));
  } else {
    dispatch(mutation.getDefinedCountriesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
