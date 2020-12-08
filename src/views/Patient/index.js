import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';
import PropTypes from 'prop-types';
import settings from 'settings';
import moment from 'moment/moment';
import * as ROUTES from 'variables/routes';

import CreatePatient from './create';
import { getUsers } from 'store/user/actions';
import CustomTable from 'components/Table';
import { DeleteAction, EditAction, ViewAction } from 'components/ActionIcons';
import { getCountryName } from 'utils/country';
import { getClinicName } from 'utils/clinic';
import { ageCalculation } from 'utils/age';

let timer = null;
const Patient = ({ translate }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState('');
  const users = useSelector(state => state.user.users);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);

  const columns = [
    { name: 'identity', title: 'ID' },
    { name: 'last_name', title: 'Last Name' },
    { name: 'first_name', title: 'First Name' },
    { name: 'date_of_birth', title: 'Date Of Birth' },
    { name: 'age', title: 'Age' },
    { name: 'country', title: 'Country' },
    { name: 'clinic', title: 'Clinic' },
    { name: 'ongoing_treatment_status', title: 'Ongoing Treatment Status' },
    { name: 'ongoing_treatment_plan', title: 'Ongoing Treatment Plan' },
    { name: 'note', title: 'Note' },
    { name: 'action', title: 'Actions' }
  ];

  const columnExtensions = [
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true }
  ];

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
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
    if (searchValue || filters.length) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(getUsers({
          filters,
          search_value: searchValue,
          page_size: pageSize,
          page: currentPage + 1
        })).then(result => {
          if (result) {
            setTotalCount(result.total_count);
          }
        });
      }, 500);
    } else {
      dispatch(getUsers({
        filters,
        search_value: searchValue,
        page_size: pageSize,
        page: currentPage + 1
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }
  }, [currentPage, pageSize, searchValue, filters, dispatch]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('patient.management')}</h1>
        <span>Total Number Of Patient: <strong>{totalCount}</strong></span>
        <span>Ongoing Patients / Limit: <strong>10</strong> / 120</span>
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
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        columnExtensions={columnExtensions}
        rows={users.map(user => {
          const action = (
            <>
              <ViewAction as={Link} to={ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', user.id)} />
              <EditAction className="ml-1" onClick={() => handleEdit(user.id)} />
              <DeleteAction className="ml-1" disabled />
            </>
          );
          return {
            identity: user.identity,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            date_of_birth: moment(user.date_of_birth, 'YYYY-MM-DD').format(settings.date_format),
            age: ageCalculation(moment(user.date_of_birth, 'YYYY-MM-DD').format(settings.date_format)),
            country: getCountryName(user.country_id, countries),
            clinic: getClinicName(user.clinic_id, clinics),
            ongoing_treatment_status: '',
            ongoing_treatment_plan: '',
            note: user.note,
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
