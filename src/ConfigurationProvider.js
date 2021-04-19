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

import SplashScreen from 'components/SplashScreen';
import RocketchatContext from 'context/RocketchatContext';
import settings from './settings';
import IdleTimer from 'react-idle-timer';
import keycloak from './utils/keycloak';

let chatSocket = null;

const ConfigurationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);
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
        } else {
          setAppLoading(false);
        }
      });

      dispatch(getCountries());
      dispatch(getLanguages());
    }
  }, [appLoading, dispatch]);

  useEffect(() => {
    if (profile && profile.chat_user_id && profile.chat_rooms.length) {
      const subscribeIds = {
        loginId: getUniqueId(profile.id),
        roomMessageId: getUniqueId(profile.id),
        notifyLoggedId: getUniqueId(profile.id)
      };
      dispatch(setChatSubscribeIds(subscribeIds));
      chatSocket = initialChatSocket(dispatch, subscribeIds, profile.identity, profile.chat_password);
    }
  }, [profile, dispatch]);

  const _onIdle = () => {
    if (keycloak.authenticated) {
      keycloak.logout({ redirectUri: window.location.origin });
    }
  };

  if (appLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <IdleTimer
        onIdle={_onIdle}
        timeout={1000 * settings.appIdleTimeout}
      />
      <RocketchatContext.Provider value={chatSocket}>
        {children}
      </RocketchatContext.Provider>
    </>
  );
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node
};

export default ConfigurationProvider;
