import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import settings from 'settings';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';

import EllipsisText from 'react-ellipsis-text';

import { getCountryName } from 'utils/country';
import AgeCalculation from 'utils/age';
import { getUsers } from 'store/user/actions';

const PatientInfo = ({ id, translate }) => {
  const dispatch = useDispatch();
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
  }, [dispatch, searchValue, pageSize, currentPage, filters]);

  useEffect(() => {
    if (id && users.length) {
      const data = users.find(user => user.id === parseInt(id));
      setFormFields({
        name: data.last_name + ' ' + data.first_name || '',
        id: data.id || '',
        phone: data.phone || '',
        date_of_birth: moment(data.date_of_birth, 'YYYY-MM-DD').format(settings.date_format) || '',
        country: getCountryName(data.country_id, countries),
        note: data.note || '',
        age: AgeCalculation(data.date_of_birth, translate) || ''
      });
    }
  }, [id, users, countries, translate]);
  return (
    <>
      <div className="p-3">
        <h4 className="mb-">{formFields.name}</h4>
        <div className="patient-info">
          <span className="mr-4"><strong>ID: </strong>{formFields.id}</span>
          <span className="mr-4"><strong>Mobile Number: </strong>{formFields.phone}</span>
          <span className="mr-4"><strong>DOB: </strong>{formFields.date_of_birth} ({formFields.age}) old</span>
          <span className="mr-4"><strong>Country: </strong>{formFields.country}</span>
          <span className="mr-4">
            <strong>Note: </strong>
            <OverlayTrigger
              overlay={<Tooltip id="button-tooltip-2">{ formFields.note }</Tooltip>}
            >
              <span className="card-title">
                <EllipsisText text={formFields.note} length={settings.noteMaxLength} />
              </span>
            </OverlayTrigger>
          </span>
        </div>
      </div>
    </>
  );
};

PatientInfo.propTypes = {
  id: PropTypes.string,
  translate: PropTypes.func
};

export default PatientInfo;
