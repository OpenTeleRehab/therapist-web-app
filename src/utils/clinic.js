import _ from 'lodash';

export const getClinicName = (identifier, clinics) => {
  const identity = _.toInteger(identifier);
  const clinic = _.findLast(clinics, { identity });

  return clinic ? clinic.name : '';
};
