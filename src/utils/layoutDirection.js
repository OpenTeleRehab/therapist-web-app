import _ from 'lodash';

export const getLayoutDirection = (id, languages) => {
  const language = _.findLast(languages, { id: parseInt(id, 10) });

  return language && language.rtl ? 'rtl' : 'ltr';
};
