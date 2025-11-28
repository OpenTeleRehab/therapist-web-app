import _ from 'lodash';

export const getRegionName = (id: number, regions: any) => {
  const region = _.find(regions, { id });

  return region ? region.name : '';
};
