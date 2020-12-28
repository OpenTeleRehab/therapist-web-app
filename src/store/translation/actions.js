import { Translation } from 'services/translation';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';
import { addTranslationForLanguage } from 'react-localize-redux';

export const getTranslations = languageId => async dispatch => {
  dispatch(mutation.getTranslationsRequest());
  const res = await Translation.getTranslations(languageId);
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
