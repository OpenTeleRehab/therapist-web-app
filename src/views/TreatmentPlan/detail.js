import React, { useState, useEffect } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useHistory } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { FaDownload } from 'react-icons/fa';
import {
  Button,
  Dropdown, DropdownButton,
  OverlayTrigger,
  Tab,
  Tabs,
  Tooltip
} from 'react-bootstrap';
import moment from 'moment/moment';
import * as ROUTES from 'variables/routes';

import PatientInfo from 'views/Patient/Partials/patientInfo';
import {
  deleteTreatmentPlans, downloadTreatmentPlan,
  getTreatmentPlansDetail
} from '../../store/treatmentPlan/actions';
import settings from 'settings';
import { TAB } from 'variables/treatmentPlan';
import EllipsisText from 'react-ellipsis-text';
import QuestionnaireTab from './TabContents/questionnaireTab';
import ActivitySection from './_Partials/activitySection';
import AdherenceTab from './TabContents/adherenceTab';
import _ from 'lodash';
import { renderStatusBadge, getDisease } from '../../utils/treatmentPlan';
import GoalTrackingTab from './TabContents/goalTrakingTab';
import Dialog from 'components/Dialog';
import { getDiseases } from 'store/disease/actions';
import AssignPatient from '../Library/PresetTreatment/assignPatient';
import { TYPE } from '../../variables/activity';

const ViewTreatmentPlan = () => {
  const history = useHistory();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const treatmentPlansDetail = useSelector((state) => state.treatmentPlan.treatmentPlansDetail);
  const { id, patientId } = useParams();
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    patient_id: patientId,
    start_date: '',
    end_date: '',
    patient_name: '',
    status: '',
    disease: ''
  });
  const [weeks, setWeeks] = useState(1);
  const [key, setKey] = useState(TAB.activities);
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [readOnly] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const diseases = useSelector((state) => state.disease.diseases);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [presetActivities, setPresetActivities] = useState([]);

  useEffect(() => {
    if (profile && profile.language_id) {
      dispatch(getDiseases({ lang: profile.language_id }));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (id) {
      const additionalParams = patientId ? {} : { type: 'preset' };
      dispatch(getTreatmentPlansDetail({ id, lang: profile.language_id, ...additionalParams, therapist_id: profile.id }));
    }
  }, [id, patientId, dispatch, profile]);

  useEffect(() => {
    if (id && !_.isEmpty(treatmentPlansDetail)) {
      setFormFields({
        name: treatmentPlansDetail.name,
        description: treatmentPlansDetail.description || '',
        patient_id: treatmentPlansDetail.patient_id,
        start_date: moment(treatmentPlansDetail.start_date, settings.date_format).format(settings.date_format),
        end_date: moment(treatmentPlansDetail.end_date, settings.date_format).format(settings.date_format),
        status: treatmentPlansDetail.status,
        disease: getDisease(treatmentPlansDetail.disease_id, diseases)
      });
      setWeeks(treatmentPlansDetail.total_of_weeks);
      setActivities(treatmentPlansDetail.activities);
      setStartDate(moment(treatmentPlansDetail.start_date, settings.date_format).format(settings.date_format));
    }
  }, [id, treatmentPlansDetail, diseases]);

  useEffect(() => {
    const groupActivitiesByWeek = _.groupBy(activities, function (item) {
      return item.week;
    });
    const data = [];
    _.forEach(groupActivitiesByWeek, (activityByWeek) => {
      const activityData = [];
      const groupActivitiesByDay = _.groupBy(activityByWeek, function (item) {
        return item.day;
      });
      _.forEach(groupActivitiesByDay, (activityByDay) => {
        const customExercises = activityByDay.filter(d => d.custom === true);
        const custom = [];
        const activity = activityByDay.find(d => d.day);
        const exercises = activityByDay.filter(d => d.type === TYPE.exercise).map(obj => obj.activity_id);
        const materials = activityByDay.filter(d => d.type === TYPE.material).map(obj => obj.activity_id);
        const questionnaires = activityByDay.filter(d => d.type === TYPE.questionnaire).map(obj => obj.activity_id);
        _.forEach(customExercises, (customExercise) => {
          custom.push({ sets: customExercise.sets, reps: customExercise.reps, additional_information: customExercise.additional_information, id: customExercise.activity_id });
        });
        activityData.push({ day: activity.day, week: activity.week, exercises: exercises, materials: materials, questionnaires: questionnaires, customExercises: custom });
      });
      data.push(...activityData);
    });
    setPresetActivities(data);
  }, [activities]);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteTreatmentPlans(id)).then(result => {
      if (result) {
        history.push(ROUTES.LIBRARY_PRESET_TREATMENT);
      }
    });
  };

  const handleOnClick = () => {
    history.push(ROUTES.TREATMENT_PLAN_EDIT.replace(':patientId', patientId).replace(':id', id));
  };

  const handleDownload = () => {
    setDownloading(true);
    dispatch(downloadTreatmentPlan(id)).then(() => setDownloading(false));
  };

  const handleAssign = () => {
    setShowAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setShowAssignDialog(false);
  };

  return (
    <>
      {patientId && (
        <div className="top-content mb-4">
          <PatientInfo id={patientId} translate={translate} breadcrumb={translate('treatment_plan.patient_detail')} />
        </div>
      )}
      <div>
        <div className="d-flex align-self-center">
          <h4>{formFields.name}</h4>
          {patientId ? (
            <>
              <span className="mb-2 ml-3">
                {renderStatusBadge(treatmentPlansDetail)}
              </span>
              <Button
                className="ml-auto"
                variant="outline-primary"
                as={Link}
                to={ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', patientId)}
              >
                &lt; {translate('treatment_plan.back_to_list')}
              </Button>
              <Button
                className="ml-2"
                variant="outline-primary"
                onClick={handleDownload}
                disabled={downloading}
              >
                <FaDownload size={14} className="mr-1" />
                {translate('common.download')}
              </Button>
              <Button
                className="ml-2"
                variant="primary"
                as={Button}
                onClick={handleOnClick}
              >
                <BiEdit className="mr-1" />
                {translate('treatment_plan.edit')}
              </Button>
            </>
          ) : (
            <>
              <Button
                className="ml-auto mr-2"
                variant="outline-primary"
                as={Link}
                to={ROUTES.LIBRARY_PRESET_TREATMENT}
              >
                &lt; {translate('treatment_plan.back_to_preset_list')}
              </Button>
              <Button
                className="mr-2"
                variant="outline-primary"
                onClick={handleAssign}
              >
                {translate('common.assign')}
              </Button>
              <DropdownButton alignRight variant="primary" title={translate('common.action')}>
                <Dropdown.Item as={Link} to={ROUTES.LIBRARY_TREATMENT_PLAN_EDIT.replace(':id', id)}>
                  {translate('common.edit')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDelete}>{translate('common.delete')}</Dropdown.Item>
              </DropdownButton>
            </>
          )}
        </div>
        {patientId && (
          <div className="patient-info">
            <span className="mr-4">
              <strong>{translate('common.ICD')}:</strong>&nbsp; {formFields.disease}
            </span>
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
            <span className="mr-4"><strong>{translate('common.end_date')}:</strong> {formFields.end_date ? formFields.end_date : formFields.start_date}</span>
          </div>
        )}
      </div>
      <div className="mt-lg-5">
        <Tabs
          id="controlled-tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey={TAB.activities} title={translate('treatment_plan.activities_tab')}>
            <ActivitySection weeks={weeks} setWeeks={setWeeks} startDate={startDate} activities={activities} readOnly={readOnly} />
          </Tab>
          {patientId &&
            <Tab eventKey={TAB.adherence} title={translate('treatment_plan.adherence_tab')}>
              <AdherenceTab activities={activities} startDate={treatmentPlansDetail.start_date} endDate={treatmentPlansDetail.end_date}/>
            </Tab>
          }
          {patientId &&
            <Tab eventKey={TAB.questionnaires} title={translate('treatment_plan.questionnaires_tab')}>
              <QuestionnaireTab activities={activities}/>
            </Tab>
          }
          {patientId &&
            <Tab eventKey={TAB.goal_tracking} title={translate('treatment_plan.goal_tracking_tab')}>
              <GoalTrackingTab activities={activities}/>
            </Tab>
          }
        </Tabs>
      </div>

      <Dialog
        show={showDeleteDialog}
        title={translate('treatment_plan.preset.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>

      { showAssignDialog && (
        <AssignPatient
          handleClose={handleCloseAssignDialog}
          show={showAssignDialog}
          weeks={weeks}
          activities={presetActivities}
        />
      )}
    </>
  );
};

export default ViewTreatmentPlan;
