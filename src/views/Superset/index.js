import React from 'react';
import Dashboard from 'components/SupersetDashboard';

const SupersetDashboard = () => {
  return (
    <>
      <Dashboard dashboardId={process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_THERAPIST} />
    </>
  );
};

export default SupersetDashboard;
