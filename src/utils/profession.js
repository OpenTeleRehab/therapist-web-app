import _ from 'lodash';

export const getProfessionName = (id, professions) => {
  const profession = _.findLast(professions, { id: parseInt(id, 10) });

  return profession ? profession.name : '';
};
