import { Translation } from 'services/translation';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';
import { addTranslationForLanguage } from 'react-localize-redux';

export const getTranslations = (lang) => async (dispatch) => {
  dispatch(mutation.getTranslationsRequest());
  const res = await Translation.getTranslations(lang);
  if (res && res.data) {
    const messages = {};
    res.data.map(m => {
      messages[m.key] = m.value;
      return true;
    });
    dispatch(addTranslationForLanguage(messages, 'en'));
    dispatch(mutation.getTranslationsSuccess());
    return true;
  } else {
    dispatch(mutation.getTranslationsFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
  }
};

export const getReminderSmsAlert = (lang, key) => async (dispatch) => {
  dispatch(mutation.getTranslationsRequest());
  const res = await Translation.getTranslationAlertSms(lang, key);
  if (res && res.data) {
    dispatch(mutation.getReminderSmsAlertSuccess());
    return res.data;
  } else {
    dispatch(mutation.getReminderSmsAlertFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
  }
};
