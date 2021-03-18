import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslations } from 'store/translation/actions';
import { getCountries } from 'store/country/actions';
import { getClinics } from 'store/clinic/actions';
import { getLanguages } from 'store/setting/actions';
import { getProfile } from './store/auth/actions';
import { initialChatSocket } from './utils/rocketchat';

import SplashScreen from 'components/SplashScreen';
import RocketchatContext from './context/RocketchatContext';

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
    if (profile !== undefined) {
      chatSocket = initialChatSocket(dispatch, profile);
    }
  }, [profile, dispatch]);

  return appLoading ? <SplashScreen /> : <RocketchatContext.Provider value={chatSocket}>{children}</RocketchatContext.Provider>;
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node
};

export default ConfigurationProvider;
