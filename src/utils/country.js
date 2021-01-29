import _ from 'lodash';

export const getCountryName = (id, countries) => {
  const country = _.findLast(countries, { id });

  return country ? country.name : '';
};

export const getCountryIsoCode = (id, countries) => {
  const country = _.findLast(countries, { id });

  return country ? country.iso_code : '';
};
