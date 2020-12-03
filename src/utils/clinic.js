import _ from 'lodash';

export const getClinicName = (id, clinics) => {
  const clinic = _.findLast(clinics, { id });

  return clinic ? clinic.name : '';
};

export const getClinicIdentity = (id, clinics) => {
  const clinic = _.findLast(clinics, { id });

  return clinic ? clinic.identity : '';
};
