import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';

import { BsPlus } from 'react-icons/bs';
import PropTypes from 'prop-types';
import settings from 'settings';
import moment from 'moment/moment';
import * as ROUTES from 'variables/routes';

import CreatePatient from './create';
import { getUsers } from 'store/user/actions';
import CustomTable from 'components/Table';
import { DeleteAction, EditAction, ViewAction } from 'components/ActionIcons';
import AgeCalculation from 'utils/age';
import { getTreatmentPlans } from '../../store/treatmentPlan/actions';
import { renderStatusBadge } from 'utils/treatmentPlan';
import { getTranslate } from 'react-localize-redux';

let timer = null;
const Patient = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState('');
  const users = useSelector(state => state.user.users);
  const treatmentPlans = useSelector(state => state.treatmentPlan.treatmentPlans);
  const { profile } = useSelector((state) => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();

  const columns = [
    { name: 'identity', title: translate('common.id') },
    { name: 'last_name', title: translate('common.last_name') },
    { name: 'first_name', title: translate('common.first_name') },
    { name: 'date_of_birth', title: translate('common.date_of_birth') },
    { name: 'age', title: translate('common.age') },
    { name: 'ongoing_treatment_plan', title: translate('common.ongoing_treatment_plan') },
    { name: 'ongoing_treatment_status', title: translate('common.ongoing_treatment_status') },
    { name: 'next_appointment', title: translate('common.next_appointment') },
    { name: 'action', title: translate('common.action') }
  ];

  const columnExtensions = [
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true },
    { columnName: 'ongoing_treatment_plan', wordWrapEnabled: true },
    { columnName: 'ongoing_treatment_status', wordWrapEnabled: true },
    { columnName: 'next_appointment', wordWrapEnabled: true }
  ];

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    if (profile !== undefined) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(getUsers({
          therapist_id: profile.id,
          filters,
          search_value: searchValue,
          page_size: pageSize,
          page: currentPage + 1
        }));
      }, 500);
    }
  }, [currentPage, pageSize, searchValue, filters, dispatch, profile]);

  useEffect(() => {
    dispatch(getTreatmentPlans({
      page_size: pageSize,
      page: currentPage + 1
    }));
  }, [currentPage, pageSize, dispatch]);

  const handleView = (id) => {
    history.push(ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', id));
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>&nbsp;</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="primary" onClick={handleShow}>
            <BsPlus className="mr-1" />
            {translate('patient.new')}
          </Button>
        </div>
        {show && <CreatePatient handleClose={handleClose} show={show} editId={editId} />}
      </div>
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        columnExtensions={columnExtensions}
        rows={users.map(user => {
          const action = (
            <>
              <ViewAction className="ml-1" onClick={() => handleView(user.id)} />
              <EditAction className="ml-1" onClick={() => handleEdit(user.id)} />
              <DeleteAction className="ml-1" disabled />
            </>
          );
          const treatmentPlan = _.find(treatmentPlans, { patient_id: user.id });
          return {
            identity: user.identity,
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            date_of_birth: user.date_of_birth !== null ? moment(user.date_of_birth, 'YYYY-MM-DD').format(settings.date_format) : '',
            age: user.date_of_birth !== null ? AgeCalculation(user.date_of_birth, translate) : '',
            ongoing_treatment_plan: treatmentPlan ? treatmentPlan.name : '',
            ongoing_treatment_status: renderStatusBadge(treatmentPlan),
            next_appointment: '',
            action
          };
        })}
      />
    </>
  );
};

Patient.propTypes = {
  translate: PropTypes.func
};

export default Patient;
