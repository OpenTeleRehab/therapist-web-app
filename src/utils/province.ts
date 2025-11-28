import _ from 'lodash';

export const getProvinceName = (id: number, provinces: any) => {
  const province = _.find(provinces, { id });

  return province ? province.name : '';
};
