import React, { useEffect, useState } from 'react';
import SupersetDashboard from 'components/SupersetDashboard';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import customColorScheme from '../../utils/customColorScheme';
import { USER_GROUPS } from 'variables/user';

const Dashboard = () => {
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { profile } = useSelector((state) => state.auth);
  const [dashboardId, setDashboardId] = useState(null);

  useEffect(() => {
    if (profile?.type) {
      if (profile.type === USER_GROUPS.PHC_WORKER) {
        setDashboardId(process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_PHC_WORKER);
      } else {
        setDashboardId(process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_THERAPIST);
      }
    }
  }, [profile]);

  return (
    <>
      <SupersetDashboard dashboardId={dashboardId} />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default Dashboard;
