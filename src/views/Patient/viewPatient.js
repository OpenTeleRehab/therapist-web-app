import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import { Nav } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';

import PatientInfo from './Partials/patientInfo';
import TreatmentPlanHistory from './TreatmentPlan';
import AssistiveTechnologyHistory from './AssistiveTechnology';
import InterviewHistory from './InterviewList';

const VIEW_TREATMENT_HISTORY = 'treatment_history';
const VIEW_ASSISTIVE_TECHNOLOGY = 'assistive_technology_history';
const VIEW_INTERVIEW_HISTORY = 'interview_history';

const ViewPatient = () => {
  const { patientId } = useParams();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { hash } = useLocation();
  const [view, setView] = useState(undefined);

  useEffect(() => {
    switch (hash) {
      case '#' + VIEW_ASSISTIVE_TECHNOLOGY:
        setView(VIEW_ASSISTIVE_TECHNOLOGY);
        break;
      case '#' + VIEW_INTERVIEW_HISTORY:
        setView(VIEW_INTERVIEW_HISTORY);
        break;
      default:
        setView(VIEW_TREATMENT_HISTORY);
    }
  }, [hash]);

  return (
    <>
      <div className='top-content'>
        <PatientInfo id={patientId} translate={translate} />
      </div>

      <Tab.Container mountOnEnter activeKey={view}>
        <Nav variant='tabs' className='mt-3'>
          <Nav.Item>
            <Nav.Link
              as={Link}
              to={patientId}
              eventKey={VIEW_TREATMENT_HISTORY}
            >
              {translate('treatment_plan.treatment_history')}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as={Link}
              to={'#' + VIEW_ASSISTIVE_TECHNOLOGY}
              eventKey={VIEW_ASSISTIVE_TECHNOLOGY}
            >
              {translate('common.assistive_technology_history')}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as={Link}
              to={'#' + VIEW_INTERVIEW_HISTORY}
              eventKey={VIEW_INTERVIEW_HISTORY}
            >
              {translate('common.interview_history')}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey={VIEW_TREATMENT_HISTORY}>
            <TreatmentPlanHistory />
          </Tab.Pane>
          <Tab.Pane eventKey={VIEW_ASSISTIVE_TECHNOLOGY}>
            <AssistiveTechnologyHistory />
          </Tab.Pane>
          <Tab.Pane eventKey={VIEW_INTERVIEW_HISTORY}>
            <InterviewHistory />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default ViewPatient;
