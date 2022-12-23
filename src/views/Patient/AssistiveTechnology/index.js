import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTranslate, Translate } from 'react-localize-redux';
import { FaNotesMedical } from 'react-icons/fa';
import { Button, Col, Form } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment/moment';
import _ from 'lodash';

import {
  getAssistiveTechnologies,
  getPatientAssistiveTechnologies,
  createPatientAssistiveTechnology,
  updatePatientAssistiveTechnology,
  deletePatientAssistiveTechnology
} from 'store/assistiveTechnology/actions';
import {
  DeleteAction,
  EditAction
} from '../../../components/ActionIcons';
import { getAssistiveTechnologyName } from '../../../utils/assistiveTechnology';
import Datetime from '../../../components/DateTime';
import CustomTable from 'components/Table';
import Dialog from 'components/Dialog';
import BackButton from '../Partials/backButton';
import settings from '../../../settings';
import scssColors from '../../../scss/custom.scss';

const AssistiveTechnologyHistory = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {
    patientAssistiveTechnologies,
    assistiveTechnologies
  } = useSelector(state => state.assistiveTechnology);

  const columns = [
    { name: 'assistive_name', title: translate('common.name') },
    { name: 'provision_date', title: translate('common.provision_date') },
    { name: 'follow_up_date', title: translate('common.follow_up_date') },
    { name: 'action', title: translate('common.action') }
  ];

  const defaultHiddenColumnNames = ['follow_up_date'];

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [formattedFrom, setFormattedFrom] = useState('');
  const [formattedTo, setFormattedTo] = useState('');

  const [errorAssistiveTechnology, setErrorAssistiveTechnology] = useState(false);
  const [errorProvisionDate, setErrorProvisionDate] = useState(false);
  const [errorFollowUpDate, setErrorFollowUpDate] = useState(false);
  const [errorFrom, setErrorFrom] = useState(false);
  const [errorTo, setErrorTo] = useState(false);

  const [formFields, setFormFields] = useState({
    patientId: parseInt(patientId),
    therapistId: parseInt(profile.id),
    assistiveTechnologyId: '',
    provisionDate: '',
    followUpDate: '',
    showFollowUpAppointment: false
  });

  const validateDate = (current) => {
    const yesterday = moment().subtract(1, 'day');

    return current.isAfter(yesterday);
  };

  const columnExtensions = [
    { columnName: 'assistive_name', wordWrapEnabled: true }
  ];

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    dispatch(getAssistiveTechnologies({ lang: profile.language_id }));
  }, [profile, dispatch]);

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientAssistiveTechnologies({
        patient_id: parseInt(patientId),
        search_value: searchValue,
        filters: filters,
        page_size: pageSize,
        page: currentPage + 1
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }
  }, [currentPage, pageSize, searchValue, filters, patientId, dispatch]);

  useEffect(() => {
    if (moment(from, settings.date_format + ' hh:mm A', true).isValid()) {
      setFormattedFrom(moment(from).format('hh:mm A'));
    } else {
      setFormattedFrom('');
    }
  }, [from]);

  useEffect(() => {
    if (moment(to, settings.date_format + ' hh:mm A', true).isValid()) {
      setFormattedTo(moment(to).format('hh:mm A'));
    } else {
      setFormattedTo('');
    }
  }, [to]);

  const handleAddAssistiveTechnology = () => {
    setShow(true);
  };

  const handleEdit = (row) => {
    const patientAssistiveTechnology = patientAssistiveTechnologies.find(patientAssistive => patientAssistive.id === row.id);
    setEditId(row.id);
    setFormFields({
      ...formFields,
      assistiveTechnologyId: row.assistive_technology_id,
      provisionDate: row.provision_date,
      showFollowUpAppointment: row.follow_up_date,
      followUpDate: row.follow_up_date
    });
    if (patientAssistiveTechnology.appointment) {
      setFrom(moment.utc(patientAssistiveTechnology.appointment.start_date).local());
      setTo(moment.utc(patientAssistiveTechnology.appointment.end_date).local());
    }
    setShow(true);
  };

  const handleDelete = (id) => {
    setShowConfirm(true);
    setDeleteId(id);
  };

  const handleClose = () => {
    setEditId(null);
    setDeleteId(null);
    setShow(false);
    setShowConfirm(false);
    setFormFields({
      ...formFields,
      assistiveTechnologyId: '',
      provisionDate: '',
      followUpDate: '',
      showFollowUpAppointment: false
    });
    setFrom('');
    setTo('');
  };

  const handleCheck = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handleConfirm = () => {
    let canSave = true;

    const now = moment().locale('en').format('YYYY-MM-DD HH:mm:ss');
    const formattedDate = moment(formFields.followUpDate, 'DD/MM/YYYY').format(settings.date_format);
    const fromTimeThen = moment(formattedDate + ' ' + formattedFrom, settings.date_format + ' hh:mm A').locale('en').format('YYYY-MM-DD HH:mm:ss');
    const toTimeThen = moment(formattedDate + ' ' + formattedTo, settings.date_format + ' hh:mm A').locale('en').format('YYYY-MM-DD HH:mm:ss');

    if (formFields.assistiveTechnologyId === '') {
      canSave = false;
      setErrorAssistiveTechnology(true);
    } else {
      setErrorAssistiveTechnology(false);
    }

    if (formFields.provisionDate === '') {
      canSave = false;
      setErrorProvisionDate(true);
    } else {
      setErrorProvisionDate(false);
    }

    if (formFields.showFollowUpAppointment) {
      if (formFields.followUpDate === '') {
        canSave = false;
        setErrorFollowUpDate(true);
      } else {
        setErrorFollowUpDate(false);
      }

      if (formattedFrom === '' || !moment(formattedFrom, 'hh:mm A').isValid() || !moment(now).isBefore(fromTimeThen)) {
        canSave = false;
        setErrorFrom(true);
      } else {
        setErrorFrom(false);
      }

      if (formattedTo === '' || !moment(formattedTo, 'hh:mm A').isValid() || formattedFrom === formattedTo || moment(formattedTo, 'hh:mm A').isBefore(moment(formattedFrom, 'hh:mm A')) || !moment(now).isBefore(toTimeThen)) {
        canSave = false;
        setErrorTo(true);
      } else {
        setErrorTo(false);
      }
    }

    if (canSave) {
      const existingData = _.find(patientAssistiveTechnologies, { assistive_technology_id: formFields.assistiveTechnologyId });

      if (editId) {
        const previousData = _.find(patientAssistiveTechnologies, { id: editId });

        if (previousData.assistive_technology_id !== formFields.assistiveTechnologyId && existingData) {
          setShowConfirm(true);
        } else {
          handleSubmit();
        }
      } else {
        if (existingData) {
          setShowConfirm(true);
        } else {
          handleSubmit();
        }
      }
    }
  };

  const handleSubmit = () => {
    const formattedFollowUpDate = moment(formFields.followUpDate, 'DD/MM/YYYY').format(settings.date_format);
    const data = {
      ...formFields,
      provisionDate: moment(formFields.provisionDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      followUpDate: formFields.followUpDate ? moment(formFields.followUpDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      appointmentFrom: formFields.followUpDate ? moment(formattedFollowUpDate + ' ' + formattedFrom, settings.date_format + ' hh:mm A').utc().locale('en').format('YYYY-MM-DD HH:mm:ss') : '',
      appointmentTo: formFields.followUpDate ? moment(formattedFollowUpDate + ' ' + formattedTo, settings.date_format + ' hh:mm A').utc().locale('en').format('YYYY-MM-DD HH:mm:ss') : ''
    };

    if (editId) {
      dispatch(updatePatientAssistiveTechnology(editId, data)).then(result => {
        if (result) {
          handleClose();
        }
      });
    } else {
      dispatch(createPatientAssistiveTechnology(data)).then(result => {
        if (result) {
          handleClose();
        }
      });
    }
  };

  const handleRemove = () => {
    if (deleteId) {
      dispatch(deletePatientAssistiveTechnology(deleteId, patientId)).then(result => {
        if (result) {
          handleClose();
        }
      });
    }
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  return (
    <>
      <div className="mt-4 d-flex">
        <h5>{translate('common.assistive_technology_history')}</h5>
        <BackButton />
        <Button className="ml-3" onClick={handleAddAssistiveTechnology}>
          <FaNotesMedical className="mr-1" />
          <Translate id="patient.assistive_technology.add" />
        </Button>
      </div>

      <div className="mt-3">
        {patientAssistiveTechnologies &&
          <CustomTable
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalCount={totalCount}
            setSearchValue={setSearchValue}
            setFilters={setFilters}
            filters={filters}
            columns={columns}
            columnExtensions={columnExtensions}
            defaultHiddenColumnNames={defaultHiddenColumnNames}
            rows={patientAssistiveTechnologies.map(item => {
              const action = (
                <>
                  <EditAction onClick={() => handleEdit(item)} />
                  <DeleteAction className="ml-1" onClick={() => handleDelete(item.id)} />
                </>
              );

              return {
                assistive_name: getAssistiveTechnologyName(item.assistive_technology_id),
                provision_date: item.provision_date,
                follow_up_date: item.follow_up_date,
                action
              };
            })}
          />
        }

        <Dialog
          show={show}
          title={translate(editId ? 'patient.assistive_technology.edit' : 'patient.assistive_technology.new')}
          onCancel={handleClose}
          onConfirm={handleConfirm}
          confirmLabel={editId ? translate('common.save') : translate('common.create')}
        >
          <Form onKeyPress={(e) => handleFormSubmit(e)}>
            <Form.Group controlId="groupName">
              <Form.Label>
                {translate('common.name')}
              </Form.Label>
              <span className="text-dark ml-1">*</span>
              <Select
                className={errorAssistiveTechnology && 'is-invalid'}
                placeholder={translate('placeholder.assistive_technology')}
                classNamePrefix="filter"
                value={assistiveTechnologies && assistiveTechnologies.length && assistiveTechnologies.filter(option => option.id === formFields.assistiveTechnologyId)}
                getOptionLabel={option => option.name}
                options={assistiveTechnologies && assistiveTechnologies.length && assistiveTechnologies.filter(assistive => assistive.deleted_at === null)}
                onChange={(e) => setFormFields({ ...formFields, assistiveTechnologyId: e.id })}
                styles={customSelectStyles}
                aria-label="Assistive Technology"
              />
              {errorAssistiveTechnology && (
                <Form.Control.Feedback type="invalid">
                  {translate('error.assistive_technology')}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="groupProvisionDate">
              <label htmlFor="provision-date">
                {translate('common.provision_date')}
              </label>
              <span className="text-dark ml-1">*</span>
              <Datetime
                className={errorProvisionDate && 'is-invalid'}
                inputProps={{
                  id: 'provision-date',
                  name: 'date',
                  autoComplete: 'off',
                  className: errorProvisionDate ? 'form-control is-invalid' : 'form-control',
                  placeholder: translate('placeholder.provision_date')
                }}
                dateFormat={settings.date_format}
                timeFormat={false}
                isValidDate={validateDate}
                closeOnSelect={true}
                value={formFields.provisionDate}
                onChange={(value) => setFormFields({ ...formFields, provisionDate: value })}
              />
              {errorProvisionDate && (
                <Form.Control.Feedback type="invalid">
                  {translate('error.provision_date')}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="formShowFollowUpAppointment">
              <Form.Check
                name="showFollowUpAppointment"
                onChange={handleCheck}
                value={true}
                checked={formFields.showFollowUpAppointment}
                label={translate('patient.assistive_technology.create_follow_up_appointment')}
                disabled={editId}
              />
            </Form.Group>

            {formFields.showFollowUpAppointment && (
              <>
                <Form.Group controlId="groupFollowUpDate">
                  <label htmlFor="follow-up-date">
                    {translate('common.follow_up_date')}
                  </label>
                  <span className="text-dark ml-1">*</span>
                  <Datetime
                    className={errorFollowUpDate && 'is-invalid'}
                    inputProps={{
                      id: 'follow-up-date',
                      name: 'date',
                      autoComplete: 'off',
                      className: errorFollowUpDate ? 'form-control is-invalid' : 'form-control',
                      placeholder: translate('placeholder.follow_up_date')
                    }}
                    dateFormat={settings.date_format}
                    timeFormat={false}
                    isValidDate={validateDate}
                    closeOnSelect={true}
                    value={formFields.followUpDate}
                    onChange={(value) => setFormFields({ ...formFields, followUpDate: value })}
                  />
                  {errorFollowUpDate && (
                    <Form.Control.Feedback type="invalid">
                      {translate('error.follow_up_date')}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group controlId="groupTime">
                  <Form.Row>
                    <Col>
                      <label htmlFor="time-from">{translate('appointment.from')}</label>
                      <span className="text-dark ml-1">*</span>
                      <Datetime
                        inputProps={{
                          id: 'time-from',
                          name: 'from',
                          autoComplete: 'off',
                          className: errorFrom ? 'form-control is-invalid' : 'form-control',
                          placeholder: translate('placeholder.time')
                        }}
                        timeConstraints={{ minutes: { step: 15 } }}
                        initialViewMode="time"
                        value={formattedFrom}
                        onChange={(value) => {
                          setFrom(value);
                          if (typeof value === 'object') {
                            setTo(_.cloneDeep(value).add(15, 'minutes'));
                          }
                        }}
                        dateFormat={false}
                        timeFormat={'h:mm A'}
                      />
                      {errorFrom && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {translate('error_message.appointment_from')}
                        </Form.Control.Feedback>
                      )}
                    </Col>
                    <Col>
                      <label htmlFor="time-to">{translate('appointment.to')}</label>
                      <span className="text-dark ml-1">*</span>
                      <Datetime
                        inputProps={{
                          id: 'time-to',
                          name: 'to',
                          autoComplete: 'off',
                          className: errorTo ? 'form-control is-invalid' : 'form-control',
                          placeholder: translate('placeholder.time'),
                          disabled: typeof from !== 'object'
                        }}
                        timeConstraints={{ minutes: { step: 15 } }}
                        initialViewMode="time"
                        value={formattedTo}
                        onChange={(value) => setTo(value)}
                        dateFormat={false}
                        timeFormat={'h:mm A'}
                      />
                      {errorTo && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {translate('error_message.appointment_to')}
                        </Form.Control.Feedback>
                      )}
                    </Col>
                  </Form.Row>
                </Form.Group>
              </>
            )}
          </Form>
        </Dialog>

        <Dialog
          show={showConfirm}
          title={translate(deleteId ? 'patient.assistive_technology.delete_confirm_title' : 'patient.assistive_technology.confirm_title')}
          onCancel={() => showConfirm ? setShowConfirm(false) : handleClose()}
          onConfirm={deleteId ? handleRemove : handleSubmit}
          confirmLabel={translate('common.yes')}
        >
          {translate(deleteId ? 'patient.assistive_technology.delete_confirm_content' : 'patient.assistive_technology.confirm_content')}
        </Dialog>
      </div>
    </>
  );
};

export default AssistiveTechnologyHistory;
