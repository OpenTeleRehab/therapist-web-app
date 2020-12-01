import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  addTranslationForLanguage,
  initialize,
  localizeReducer
} from 'react-localize-redux';

import { notification } from 'store/notification/reducers';
import { auth } from 'store/auth/reducers';
import { clinic } from 'store/clinic/reducers';
import { country } from 'store/country/reducers';

import en from 'translations/en.locale.json';
import { getClinics } from 'store/clinic/actions';
import { getCountries } from 'store/country/actions';
import { user } from 'store/user/reducers';

export const rootReducer = {
  localize: localizeReducer,
  user,
  notification,
  auth,
  clinic,
  country
};

const devTool =
  process.env.NODE_ENV === 'development'
    ? (window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()) || compose
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

// Fetch data for clinic
store.dispatch(getClinics());

// Fetch data for country
store.dispatch(getCountries());

export default store;
