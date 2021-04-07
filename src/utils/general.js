import _ from 'lodash';
import moment from 'moment';
import settings from 'settings';
import { CHAT_TYPES } from 'variables/rocketchat';

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

export const getMessage = (message, authUserId = '', authToken = '') => {
  const { _id, rid, msg, _updatedAt, u, unread, attachments, file } = message;
  let attachment = null;
  let type = CHAT_TYPES.TEXT;
  if (file && attachments) {
    const attachedFile = attachments[0];
    const baseUrl = process.env.REACT_APP_ROCKET_CHAT_BASE_URL;
    const authParams = `?rc_uid=${authUserId}&rc_token=${authToken}`;
    attachment = {
      title: file.name,
      type: file.type,
      caption: attachedFile.description || ''
    };
    if (file.type === 'video/mp4') {
      attachment.url = encodeURI(`${baseUrl}${attachedFile.video_url}${authParams}`);
      type = CHAT_TYPES.VIDEO;
    } else {
      attachment.url = encodeURI(`${baseUrl}${attachedFile.image_url}${authParams}`);
      attachment.height = attachedFile.image_dimensions.height;
      attachment.width = attachedFile.image_dimensions.width;
      type = CHAT_TYPES.IMAGE;
    }
  }

  return {
    _id,
    rid,
    msg,
    _updatedAt: _updatedAt.$date ? new Date(_updatedAt.$date) : _updatedAt,
    u: { _id: u._id },
    received: true,
    pending: false,
    unread: !!unread,
    type,
    attachment
  };
};
