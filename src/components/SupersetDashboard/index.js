import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGuestToken } from '../../store/superset/actions';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import PropTypes from 'prop-types';

const Dashboard = ({ dashboardId }) => {
  const dispatch = useDispatch();
  const { guestToken, exp } = useSelector(state => state.superset);
  const containerRef = useRef(null);
  const intervalIdRef = useRef(null);

  const refreshToken = () => {
    dispatch(getGuestToken());
  };

  useEffect(() => {
    if (!guestToken) {
      dispatch(getGuestToken());
      return;
    }

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
    if (containerRef.current && guestToken) {
      embedDashboard({
        id: dashboardId,
        supersetDomain: process.env.REACT_APP_SUPERSET_API_BASE_URL,
        mountPoint: containerRef.current,
        fetchGuestToken: () => guestToken,
        dashboardUiConfig: {
          hideTitle: true,
          filters: { expanded: true }
        },
        iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
      });
    }
  }, [guestToken]);

  return (
    <div>
      <div id="superset-container" ref={containerRef}></div>
    </div>
  );
};

Dashboard.propTypes = {
  dashboardId: PropTypes.string.isRequired
};

export default Dashboard;
