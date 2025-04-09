import React from 'react';
import SupersetDashboard from 'components/SupersetDashboard';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import customColorScheme from '../../utils/customColorScheme';
import { Translate } from 'react-localize-redux';
import { Button } from 'react-bootstrap';
import { downloadQuestionnaireResults } from '../../store/questionnaire/actions';
import { updateDownloadPending } from '../../store/downloadTracker/actions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { profile } = useSelector((state) => state.auth);

  const handleDownloadQuestionnaireResults = () => {
    dispatch(downloadQuestionnaireResults(profile.language_id))
      .then(res => {
        dispatch(updateDownloadPending([res]));
      });
  };

  return (
    <>
      <Button className="float-right mb-3" variant="primary" onClick={handleDownloadQuestionnaireResults}>
        <Translate id="questionnaire.download_report"/>
      </Button>
      <SupersetDashboard dashboardId={process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_THERAPIST} />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default Dashboard;
