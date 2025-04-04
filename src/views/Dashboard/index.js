import React from 'react';
import SupersetDashboard from 'components/SupersetDashboard';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import customColorScheme from '../../utils/customColorScheme';

const Dashboard = () => {
  const { colorScheme } = useSelector(state => state.colorScheme);

  return (
    <>
      <SupersetDashboard dashboardId={process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_THERAPIST} />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default Dashboard;
