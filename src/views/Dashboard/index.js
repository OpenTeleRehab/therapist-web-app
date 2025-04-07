import React from 'react';
import SupersetDashboard from 'components/SupersetDashboard';

const Dashboard = () => {
  return (
    <>
      <SupersetDashboard dashboardId={process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_THERAPIST} />
    </>
  );
};

export default Dashboard;
