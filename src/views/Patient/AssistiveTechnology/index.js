import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTranslate, Translate } from 'react-localize-redux';
import { FaNotesMedical } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
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

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorAssistiveTechnology, setErrorAssistiveTechnology] = useState(false);
  const [errorProvisionDate, setErrorProvisionDate] = useState(false);
  const [errorFollowUpDate, setErrorFollowUpDate] = useState(false);

  const [formFields, setFormFields] = useState({
    patientId: parseInt(patientId),
    therapistId: parseInt(profile.id),
    assistiveTechnologyId: '',
    provisionDate: '',
    followUpDate: ''
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

  const handleAddAssistiveTechnology = () => {
    setShow(true);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setFormFields({
      ...formFields,
      assistiveTechnologyId: row.assistive_technology_id,
      provisionDate: row.provision_date,
      followUpDate: row.follow_up_date
    });
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
      followUpDate: ''
    });
  };

  const handleConfirm = () => {
    let canSave = true;

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

    if (formFields.followUpDate === '') {
      canSave = false;
      setErrorFollowUpDate(true);
    } else {
      setErrorFollowUpDate(false);
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
    const data = {
      ...formFields,
      provisionDate: moment(formFields.provisionDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      followUpDate: moment(formFields.followUpDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
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
      dispatch(deletePatientAssistiveTechnology(deleteId)).then(result => {
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
                options={assistiveTechnologies}
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
