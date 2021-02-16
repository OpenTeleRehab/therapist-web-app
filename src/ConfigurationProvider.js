import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getTranslations } from 'store/translation/actions';
import { getCountries } from 'store/country/actions';
import { getClinics } from 'store/clinic/actions';
import { getLanguages } from 'store/setting/actions';
import { getProfile } from './store/auth/actions';

import SplashScreen from 'components/SplashScreen';

const ConfigurationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      dispatch(getProfile()).then(res => {
        if (res) {
          dispatch(getTranslations(res.data.language_id)).then(res => {
            if (res) {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      });

      dispatch(getClinics());
      dispatch(getCountries());
      dispatch(getLanguages());
    }
  }, [loading, dispatch]);

  return loading ? <SplashScreen /> : children;
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node
};

export default ConfigurationProvider;
