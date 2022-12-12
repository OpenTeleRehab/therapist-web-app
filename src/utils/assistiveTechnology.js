import _ from 'lodash';
import store from '../store/index';

export const getAssistiveTechnologyName = (id) => {
  const { assistiveTechnologies } = store.getState().assistiveTechnology;

  if (assistiveTechnologies) {
    const assistiveTechnology = _.find(assistiveTechnologies, { id: id });

    return assistiveTechnology.name;
  }

  return null;
};
