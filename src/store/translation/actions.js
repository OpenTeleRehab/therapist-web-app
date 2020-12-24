import { Translation } from 'services/translation';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';
import { addTranslationForLanguage } from 'react-localize-redux';

export const getTranslations = () => async dispatch => {
  dispatch(mutation.getTranslationsRequest());
  const data = await Translation.getTranslations();
  if (data) {
    const messages = {};
    data.data.map(m => {
      messages[m.key] = m.value;
      return true;
    });
    dispatch(addTranslationForLanguage(messages, 'en'));
    dispatch(mutation.getTranslationsSuccess());
  } else {
    dispatch(mutation.getTranslationsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
