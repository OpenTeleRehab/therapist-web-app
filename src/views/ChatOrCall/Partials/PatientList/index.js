import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import settings from 'settings';
import { ListGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectPatientToChat } from 'store/rocketchat/actions';
import { getUniqueId } from 'utils/general';
import RocketchatContext from 'context/RocketchatContext';

const PatientList = ({ translate, patients, keyword, therapist }) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const { selectedPatient, lastMessages } = useSelector(state => state.rocketchat);
  const selected = selectedPatient || {};

  // search patient name
  let patientList = patients;
  if (keyword.length >= 2 && patients.length) {
    const searchValue = keyword.toLowerCase();
    patientList = patients.filter(patient => {
      const fullName = `${patient.last_name} ${patient.first_name}`;
      return fullName.toLowerCase().includes(searchValue);
    });
  }

  const handleSelectPatientToChat = (index) => {
    const selected = patientList[index];
    dispatch(selectPatientToChat(selected));

    // load messages history
    const options = {
      msg: 'method',
      method: 'loadHistory',
      id: getUniqueId(therapist.id),
      params: [
        `${therapist.chat_user_id}${selected.chat_user_id}`,
        null,
        9999,
        { $date: new Date().getTime() }
      ]
    };
    chatSocket.send(JSON.stringify(options));
  };

  const getLastMessageByPatient = (chatUserId) => {
    return lastMessages.filter((msg) => {
      return msg.rid.includes(chatUserId);
    });
  };

  const getLastMessageText = (chatUserId) => {
    const lastMessage = getLastMessageByPatient(chatUserId);
    return lastMessage.length ? lastMessage[0].text : '';
  };

  const getLastMessageDate = (chatUserId) => {
    const lastMessage = getLastMessageByPatient(chatUserId);
    return lastMessage.length ? moment(lastMessage[0].createdAt).format(settings.date_format) : '';
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
                  <p className="text-muted text-truncate small mb-0">{getLastMessageText(patient.chat_user_id)}</p>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <Badge variant="primary">50</Badge>
                  <p className="text-muted small mb-0">{getLastMessageDate(patient.chat_user_id)}</p>
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
  therapist: PropTypes.object
};

export default PatientList;
