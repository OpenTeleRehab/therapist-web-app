import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGuestToken } from '../../store/superset/actions';
import { embedDashboard } from '@superset-ui/embedded-sdk';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { guestToken, exp, dashboardId } = useSelector(state => state.superset);
  const { profile } = useSelector((state) => state.auth);
  const { languages } = useSelector(state => state.language);
  const containerRef = useRef(null);
  const tokenRef = useRef(null);
  const intervalIdRef = useRef(null);
  const [locale, setLocale] = useState('en');
  const [langReady, setLangReady] = useState(false);
  const dashboardMountedRef = useRef(false);

  const refreshToken = () => {
    dispatch(getGuestToken());
  };

  useEffect(() => {
    if (languages.length && profile) {
      const language = languages.find(lang => lang.id === profile.language_id);
      if (language) {
        setLocale(language.code);
      } else {
        setLocale('en');
      }
    }
  }, [languages, profile]);

  useEffect(() => {
    if (!locale) return;
    setLangReady(false);
    const langFrame = document.createElement('iframe');
    langFrame.style.display = 'none';
    langFrame.src = `${process.env.REACT_APP_SUPERSET_API_BASE_URL}/lang/${locale}`;
    langFrame.onload = () => {
      setLangReady(true);
    };
    document.body.appendChild(langFrame);

    return () => {
      document.body.removeChild(langFrame);
    };
  }, [locale]);

  useEffect(() => {
    if (!guestToken) {
      dispatch(getGuestToken());
      return;
    }

    tokenRef.current = guestToken;

    const expirationTime = exp * 1000;
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime - 30000;

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    intervalIdRef.current = setInterval(() => {
      refreshToken();
    }, timeRemaining);

    return () => clearInterval(intervalIdRef.current);
  }, [guestToken]);

  useEffect(() => {
    if (containerRef.current && langReady && !dashboardMountedRef.current) {
      dashboardMountedRef.current = true;

      embedDashboard({
        id: dashboardId,
        supersetDomain: process.env.REACT_APP_SUPERSET_API_BASE_URL,
        mountPoint: containerRef.current,
        fetchGuestToken: () => tokenRef.current ?? '',
        dashboardUiConfig: {
          hideTitle: true,
          filters: { expanded: true },
          urlParams: {
            languagecode: locale
          }
        },
        iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
      });
    }
  }, [guestToken, locale, langReady]);

  return (
    <div>
      <div id="superset-container" ref={containerRef}></div>
    </div>
  );
};

export default Dashboard;
