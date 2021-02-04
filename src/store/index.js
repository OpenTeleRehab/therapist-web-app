import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  initialize,
  localizeReducer
} from 'react-localize-redux';

import { notification } from 'store/notification/reducers';
import { auth } from 'store/auth/reducers';
import { clinic } from 'store/clinic/reducers';
import { country } from 'store/country/reducers';
import { user } from 'store/user/reducers';
import { treatmentPlan } from 'store/treatmentPlan/reducers';
import { language } from 'store/setting/reducers';
import { exercise } from 'store/exercise/reducers';
import { educationMaterial } from 'store/educationMaterial/reducers';

export const rootReducer = {
  localize: localizeReducer,
  user,
  notification,
  auth,
  clinic,
  country,
  treatmentPlan,
  language,
  exercise,
  educationMaterial
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

export default store;
