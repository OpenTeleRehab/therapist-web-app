import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  addTranslationForLanguage,
  initialize,
  localizeReducer
} from 'react-localize-redux';

import { notification } from 'store/notification/reducers';

import en from 'translations/en.locale.json';

export const rootReducer = {
  localize: localizeReducer,
  notification
};

const devTool =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : compose;

const store = createStore(
  combineReducers(rootReducer),
  compose(
    applyMiddleware(thunkMiddleware),
    devTool
  )
);

const languages = [{ name: 'English', code: 'en' }];
const defaultLanguage = 'en';
const onMissingTranslation = ({ translationId }) => translationId;

store.dispatch(initialize({
  languages,
  options: {
    defaultLanguage,
    renderToStaticMarkup,
    onMissingTranslation
  }
}));

store.dispatch(addTranslationForLanguage(en, 'en'));

export default store;
