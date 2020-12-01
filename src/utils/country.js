import _ from 'lodash';

export const getCountryName = (id, countries) => {
  const country = _.findLast(countries, { id });

  return country ? country.name : '';
};
