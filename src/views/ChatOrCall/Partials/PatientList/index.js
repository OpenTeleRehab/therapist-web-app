import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { selectPatientToChat } from 'store/rocketchat/actions';

const PatientList = ({ translate, patients, keyword, selected }) => {
  const dispatch = useDispatch();

  let patientList = patients;
  if (keyword.length >= 2 && patients.length) {
    const searchValue = keyword.toLowerCase();
    patientList = patients.filter(patient => {
      const fullName = `${patient.last_name} ${patient.first_name}`;
      return fullName.toLowerCase().includes(searchValue);
    });
  }

  const handleSelectPatientToChat = (index) => {
    dispatch(selectPatientToChat(patientList[index]));
  };

  return (
    <>
      {patientList.length ? (
        patientList.map((patient, index) => {
          return (
            <ListGroup as="ul" key={index}>
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-center"
                active={patient.id === selected.id}
                onClick={() => handleSelectPatientToChat(index)}
              >
                <div className="chat-room">
                  {patient.last_name} {patient.first_name}
                  <Badge variant="success" className="user-status ml-1">&nbsp;</Badge>
                  <p className="text-muted text-truncate small mb-0">I may busy this afternoon, may would not be able to join the meeting.</p>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <Badge variant="primary">50</Badge>
                  <p className="text-muted small mb-0">30/12/2021</p>
                </div>
              </ListGroup.Item>
            </ListGroup>
          );
        })
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
  keyword: PropTypes.string,
  selected: PropTypes.object
};

export default PatientList;
