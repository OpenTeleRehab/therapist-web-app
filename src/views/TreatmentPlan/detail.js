import React, { useState, useEffect } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import moment from 'moment/moment';

import PatientInfo from 'views/Patient/Partials/patientInfo';
import { getTreatmentPlans } from '../../store/treatmentPlan/actions';
import settings from 'settings';
import { STATUS } from 'variables/treatmentPlan';
import { EditAction } from 'components/ActionIcons';

const ViewTreatmentPlan = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
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
    }
    // eslint-disable-next-line
  }, [id, treatmentPlans]);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <>
      <div className="top-content">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pr-3 pl-3 pt-3">
          <span>{translate('treatment_plan.patient_detail')}</span>
        </div>
        <PatientInfo id={patientId} translate={translate} />
      </div>
      <div className="mt-3">
        <span><a href="#" onClick={handleBack}>{translate('treatment_plan.list')}</a></span>
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
          <span>
            <EditAction className="ml-1"/>
          </span>
        </div>
        <div className="patient-info">
          <span className="mr-4"><strong>{translate('common.description')}:</strong> {formFields.description}</span>
          <span className="mr-4"><strong>{translate('common.start_date')}:</strong> {formFields.start_date}</span>
          <span className="mr-4"><strong>{translate('common.end_date')}:</strong> {formFields.end_date}</span>
          <span className="mr-4"><strong>{translate('common.duration')}</strong> {weeks}</span>
        </div>
      </div>
    </>
  );
};

export default ViewTreatmentPlan;
