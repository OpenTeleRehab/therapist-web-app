import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import moment from 'moment';

import { getCountryName } from '../../utils/country';
import { ageCalculation } from 'utils/age';
import { getUsers } from 'store/user/actions';
import * as ROUTES from '../../variables/routes';

const ViewPatient = () => {
  const dispatch = useDispatch();
  const { patientId } = useParams();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const users = useSelector(state => state.user.users);
  const countries = useSelector(state => state.country.countries);

  const [formFields, setFormFields] = useState({
    name: '',
    id: '',
    phone: '',
    date_of_birth: '',
    country: '',
    note: ''
  });

  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue] = useState('');
  const [filters] = useState([]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    dispatch(getUsers({
      filters,
      search_value: searchValue,
      page_size: pageSize,
      page: currentPage + 1
    }));
  }, [dispatch]);

  useEffect(() => {
    if (patientId && users.length) {
      const data = users.find(user => user.id === parseInt(patientId));
      setFormFields({
        name: data.last_name + ' ' + data.first_name || '',
        id: data.id || '',
        phone: data.phone || '',
        date_of_birth: moment(data.date_of_birth, 'YYYY-MM-DD').format(settings.date_format) || '',
        country: getCountryName(data.country_id, countries),
        note: data.note || '',
        age: ageCalculation(data.date_of_birth) || ''
      });
    }
  }, [patientId, users]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <span>Patient / Patient Detail</span>
        <div className="btn-toolbar mb-2 mb-md-0">
          <DropdownButton alignRight variant="primary" title={translate('common.actions')}>
            <Dropdown.Item href="#/action-1">{translate('patient.edit_info')}</Dropdown.Item>
            <Dropdown.Item as={Link} to={ROUTES.TREATMENT_PLAN_CREATE_FOR_PATIENT.replace(':patientId', patientId)}>{translate('patient.create_treatment')}</Dropdown.Item>
            <Dropdown.Item href="#/action-3">{translate('patient.deactivate_account')}</Dropdown.Item>
            <Dropdown.Item href="#/action-4">{translate('patient.delete_account')}</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="mb-">{formFields.name}</h4>
        <div className="patient-info">
          <span className="mr-4"><strong>ID: </strong>{formFields.id}</span>
          <span className="mr-4"><strong>Mobile Number: </strong>{formFields.phone}</span>
          <span className="mr-4"><strong>DOB: </strong>{formFields.date_of_birth} ({formFields.age}) old</span>
          <span className="mr-4"><strong>Country: </strong>{formFields.country}</span>
          <span className="mr-4"><strong>Note: </strong>{formFields.note}</span>
        </div>
      </div>
      <patientInfo />
    </>
  );
};

export default ViewPatient;
