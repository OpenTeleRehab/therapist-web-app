import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, Badge } from 'react-bootstrap';

const PatientList = ({ translate, patients, keyword }) => {
  let patientList = patients;
  if (keyword.length >= 2 && patients.length) {
    patientList = patients.filter(patient => {
      return patient.last_name.includes(keyword) || patient.first_name.includes(keyword);
    });
  }

  return (
    <>
      {patientList.length ? (
        <ListGroup as="ul">
          <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center">
            <div className="chat-room">
              Constance Mann <Badge variant="success" className="user-status">&nbsp;</Badge>
              <p className="text-muted text-truncate small mb-0">I may busy this afternoon, may won't be able to join the meeting.</p>
            </div>
            <div className="d-flex flex-column align-items-end">
              <Badge variant="primary">50</Badge>
              <p className="text-muted small mb-0">30/12/2021</p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item as="li" className="d-flex align-items-center">Nathan Kennedy</ListGroup.Item>
          <ListGroup.Item as="li" className="d-flex align-items-center">Luke Cameron</ListGroup.Item>
          <ListGroup.Item as="li" className="d-flex align-items-center">Hazel Russell</ListGroup.Item>
        </ListGroup>
      ) : (
        <div className="d-flex justify-content-center pt-3">
          <p>{translate('common.no_data')}</p>
        </div>
      )}
    </>
  );
};

PatientList.propTypes = {
  translate: PropTypes.func,
  patients: PropTypes.array,
  keyword: PropTypes.string
};

export default PatientList;
