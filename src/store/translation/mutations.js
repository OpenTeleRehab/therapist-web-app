const getTranslationsRequest = () => ({
  type: 'GET_TRANSLATIONS_REQUEST'
});

const getTranslationsSuccess = () => ({
  type: 'GET_TRANSLATIONS_SUCCESS'
});

const getTranslationsFail = () => ({
  type: 'GET_TRANSLATIONS_FAIL'
});

const getReminderSmsAlertRequest = () => ({
  type: 'GET_REMINDER_SMS_ALERT_REQUEST'
});

const getReminderSmsAlertSuccess = () => ({
  type: 'GET_REMINDER_SMS_ALERT_SUCCESS'
});

const getReminderSmsAlertFail = () => ({
  type: 'GET_REMINDER_SMS_ALERT_FAIL'
});

export const mutation = {
  getTranslationsRequest,
  getTranslationsSuccess,
  getTranslationsFail,
  getReminderSmsAlertRequest,
  getReminderSmsAlertSuccess,
  getReminderSmsAlertFail
};
