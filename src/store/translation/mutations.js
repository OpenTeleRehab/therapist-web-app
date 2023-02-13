const getTranslationsRequest = () => ({
  type: 'GET_TRANSLATIONS_REQUEST'
});

const getTranslationsSuccess = () => ({
  type: 'GET_TRANSLATIONS_SUCCESS'
});

const getTranslationsFail = () => ({
  type: 'GET_TRANSLATIONS_FAIL'
});

export const mutation = {
  getTranslationsRequest,
  getTranslationsSuccess,
  getTranslationsFail
};
