import _ from 'lodash';

export const getCountryName = (identifier, countries) => {
  const identity = _.toInteger(identifier);
  const country = _.findLast(countries, { identity });

  return country ? country.name : '';
};
