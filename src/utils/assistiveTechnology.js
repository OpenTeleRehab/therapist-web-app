import _ from 'lodash';
import store from '../store/index';

export const getAssistiveTechnologyName = (id) => {
  const { assistiveTechnologies } = store.getState().assistiveTechnology;

  if (assistiveTechnologies) {
    const assistiveTechnology = _.find(assistiveTechnologies, { id: id });

    return assistiveTechnology && assistiveTechnology.name;
  }

  return null;
};

export const getAssistiveTechnologyIds = (name) => {
  const { assistiveTechnologies } = store.getState().assistiveTechnology;

  if (assistiveTechnologies && name) {
    const assistiveTechnologiesByName = _.filter(assistiveTechnologies, at => at.name.includes(name));
    const ids = _.map(assistiveTechnologiesByName, 'id');
    return ids.length > 0 ? ids : [0];
  }
};
