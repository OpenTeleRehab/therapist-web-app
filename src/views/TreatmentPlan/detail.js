import React, { useState, useEffect } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Badge, OverlayTrigger, Tab, Tabs, Tooltip } from 'react-bootstrap';
import moment from 'moment/moment';
import * as ROUTES from 'variables/routes';

import PatientInfo from 'views/Patient/Partials/patientInfo';
import { getTreatmentPlans } from '../../store/treatmentPlan/actions';
import settings from 'settings';
import { STATUS } from 'variables/treatmentPlan';
import EllipsisText from 'react-ellipsis-text';
import QuestionnaireTab from './TabContents/questionnaireTab';
import ActivitiesTab from './TabContents/activityTab';

const ViewTreatmentPlan = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const treatmentPlans = useSelector((state) => state.treatmentPlan.treatmentPlans);
  const { id, patientId } = useParams();
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    patient_id: patientId,
    start_date: '',
    end_date: '',
    patient_name: '',
    status: ''
  });
  const [weeks, setWeeks] = useState(1);
  const [key, setKey] = useState('activity');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getTreatmentPlans({ id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && treatmentPlans.length) {
      const editingData = treatmentPlans.find(treatmentPlan => treatmentPlan.id === parseInt(id));
      setFormFields({
        name: editingData.name,
        description: editingData.description,
        patient_id: editingData.patient_id,
        start_date: moment(editingData.start_date, settings.date_format).format(settings.date_format),
        end_date: moment(editingData.end_date, settings.date_format).format(settings.date_format),
        status: editingData.status
      });
      setWeeks(editingData.total_of_weeks);
      setActivities(editingData.activities);
    }
    // eslint-disable-next-line
  }, [id, treatmentPlans]);

  return (
    <>
      <div className="top-content">
        <PatientInfo id={patientId} translate={translate} breadcrumb={translate('treatment_plan.patient_detail')} />
      </div>
      <div className="mt-3">
        <span>
          <Link to={ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', patientId)}>&lt; {translate('treatment_plan.back_to_list')}</Link>
        </span>
        <div className="d-flex align-self-center mt-4">
          <h4 className="mr-4">{formFields.name}</h4>
          <span className="mb-2 ">
            {formFields.status === STATUS.planned
              ? (
                <Badge pill
                  variant="info"
                >
                  {translate('common.planned')}
                </Badge>
              )
              : (
                <Badge pill
                  variant={formFields.status === STATUS.finished ? 'danger' : 'primary'}
                >
                  {translate('common.' + formFields.status)}
                </Badge>
              )
            }
          </span>
        </div>
        <div className="patient-info">
          <span className="mr-4">
            <strong>{translate('common.description')}:</strong>&nbsp;
            <OverlayTrigger
              overlay={<Tooltip id="button-tooltip-2">{ formFields.description }</Tooltip>}
            >
              <span className="card-title">
                <EllipsisText text={formFields.description} length={settings.noteMaxLength} />
              </span>
            </OverlayTrigger>
          </span>
          <span className="mr-4"><strong>{translate('common.start_date')}:</strong> {formFields.start_date}</span>
          <span className="mr-4"><strong>{translate('common.end_date')}:</strong> {formFields.end_date}</span>
          <span className="mr-4"><strong>{translate('common.duration')}:</strong>&nbsp;
            {weeks}&nbsp;
            {
              weeks === 1 ? translate('common.week') : translate('common.weeks')
            }
          </span>
        </div>
      </div>
      <div className="mt-lg-5">
        <Tabs
          id="controlled-tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="activity" title={translate('common.activity')}>
            <ActivitiesTab activities={activities}/>
          </Tab>
          <Tab eventKey="questionnaire" title={translate('common.questionnaire')}>
            <QuestionnaireTab activities={activities}/>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default ViewTreatmentPlan;
