import _ from 'lodash';

export const getPhcServiceName = (id: number, phcServices: any) => {
  const phcService = _.find(phcServices, { id });

  return phcService ? phcService.name : '';
};

export const getPhcServiceIdentity = (id: number, phcServices: any) => {
  const phcService = _.find(phcServices, { id });

  return phcService ? phcService.identity : '';
};
