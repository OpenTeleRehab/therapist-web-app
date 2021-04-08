import _ from 'lodash';
import store from '../store/index';

export const getCountryName = (id, countries) => {
  const country = _.findLast(countries, { id });

  return country ? country.name : '';
};

export const getCountryIsoCode = () => {
  const profile = store.getState().auth.profile;
  const countries = store.getState().country.countries;
  const country = countries.find(item => item.id === profile.country_id);

  return country ? country.iso_code : '';
};
