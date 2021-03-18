import _ from 'lodash';

export const generateHash = (length = 17) => {
  let hash = '';
  const randomStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    hash += randomStr.charAt(Math.floor(Math.random() * randomStr.length));
  }

  return hash;
};

export const getUniqueId = (userId = 0) => {
  return _.uniqueId(`therapist-${userId}_`);
};
