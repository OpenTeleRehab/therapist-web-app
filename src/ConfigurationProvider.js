import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslations } from 'store/translation/actions';
import { getCountries } from 'store/country/actions';
import { getClinics } from 'store/clinic/actions';
import { getLanguages } from 'store/language/actions';
import { getProfile } from 'store/auth/actions';
import { setChatSubscribeIds } from 'store/rocketchat/actions';
import { initialChatSocket } from 'utils/rocketchat';
import { getUniqueId } from 'utils/general';
import { getProfessions } from 'store/profession/actions';
import { getColorScheme } from 'store/colorScheme/actions';

import SplashScreen from 'components/SplashScreen';
import AppContext from 'context/AppContext';
import RocketchatContext from 'context/RocketchatContext';
import settings from './settings';
import { useIdleTimer } from 'react-idle-timer';
import keycloak from './utils/keycloak';

import Echo from 'laravel-echo';
// eslint-disable-next-line
import Pusher from 'pusher-js';
import { getTranslate } from 'react-localize-redux';
import moment from 'moment';
import { getAppointments } from 'store/appointment/actions';

let chatSocket = null;
let echo = null;

const ConfigurationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const profile = useSelector((state) => state.auth.profile);
  const countries = useSelector((state) => state.country.countries);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (appLoading) {
      dispatch(getProfile()).then(res => {
        if (res) {
          dispatch(getTranslations(res.data.language_id)).then(res => {
            if (res) {
              setAppLoading(false);
            }
          });
          dispatch(getClinics(res.data.country_id));
          dispatch(getProfessions(res.data.country_id));
        } else {
          setAppLoading(false);
        }
      });
      dispatch(getCountries());
      dispatch(getLanguages());
      dispatch(getColorScheme());
    }
  }, [appLoading, dispatch]);

  useEffect(() => {
    if (profile && countries.length) {
      dispatch(getAppointments({
        now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        date: moment().locale('en').format(settings.date_format),
        therapist_id: profile.id
      }));
    }
  }, [profile, countries, dispatch]);

  useEffect(() => {
    if (profile && profile.chat_user_id) {
      const subscribeIds = {
        loginId: getUniqueId(profile.id),
        roomMessageId: getUniqueId(profile.id),
        notifyLoggedId: getUniqueId(profile.id)
      };
      dispatch(setChatSubscribeIds(subscribeIds));
      chatSocket = initialChatSocket(dispatch, subscribeIds, profile.identity, profile.chat_password);
    }
  }, [profile, dispatch]);

  useEffect(() => {
    if (profile && !appLoading && translate && !echo) {
      const options = {
        broadcaster: 'pusher',
        key: process.env.REACT_APP_PUSHER_APP_KEY,
        cluster: 'ap1',
        encrypted: true,
        authEndpoint: process.env.REACT_APP_API_BASE_URL + '/broadcasting/auth',
        auth: {
          headers: {
            Authorization: 'Bearer ' + keycloak.token,
            Accept: 'application/json'
          }
        }
      };

      // eslint-disable-next-line
      echo = new Echo(options);
      echo.private('new-patient.' + profile.id).listen('.new-patient-notification', data => {
        if (!('Notification' in window)) {
          console.log('This browser does not support desktop notification');
        } else {
          Notification.requestPermission().then(permission => {
            if (permission) {
              const options = {
                body: translate('patient.new_patient_assigned_notification', { name: [data.patientLastName, data.patientFirstName].join(' ') }),
                icon: process.env.PUBLIC_URL + '/logo192.png',
                dir: 'ltr'
              };
              // eslint-disable-next-line
              new Notification(translate('common.notification'), options);
            }
          });
        }
      });
    }
  }, [profile, appLoading, translate]);

  const { pause, reset } = useIdleTimer({
    timeout: 1000 * settings.appIdleTimeout,
    crossTab: true,
    onIdle: () => {
      keycloak.logout({ redirectUri: window.location.origin });
    }
  });
  const appContext = { idleTimer: { pause, reset } };

  if (appLoading) {
    return <SplashScreen />;
  }

  return (
    <AppContext.Provider value={appContext}>
      <RocketchatContext.Provider value={chatSocket}>
        {children}
      </RocketchatContext.Provider>
    </AppContext.Provider>
  );
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node
};

export default ConfigurationProvider;
