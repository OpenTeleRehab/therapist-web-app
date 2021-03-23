import _ from 'lodash';
import moment from 'moment';
import settings from 'settings';

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

export const formatDate = (date) => {
  return date ? moment(date).format(settings.date_format) : '';
};
