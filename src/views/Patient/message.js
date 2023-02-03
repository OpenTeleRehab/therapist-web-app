import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../components/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import moment from 'moment/moment';
import settings from '../../settings';
import MessageText from '../ChatOrCall/Partials/ChatPanel/Type/MessageText';
import { GiCheckMark } from 'react-icons/gi';
import { TiRefresh } from 'react-icons/ti';
import InputToolbar from '../ChatOrCall/Partials/ChatPanel/InputToolbar';
import {
  getMessages,
  sendMessages
} from '../../store/message/actions';

const Message = ({ show, handleClose, patientId, phone, handleCheckMaxSms, reachMaxSms, isOngoingTreatment }) => {
  const messageEndRef = useRef(null);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (patientId) {
      dispatch(getMessages({ patient_id: patientId }));
    }
  }, [patientId]);

  useEffect(() => {
    if (messages.length > 0) {
      const item = messages.find(message => message.draft);
      setDraft(item ? item.message : '');
      scrollToBottom();
    }
    // eslint-disable-next-line
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messages.length && messageEndRef && messageEndRef.current !== null) {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const hasSameDay = (previousMessage, currentMessage) => {
    const previousCreatedAt = moment(previousMessage.created_at);
    const currentCreatedAt = moment(currentMessage.created_at);
    return currentCreatedAt.isSame(previousCreatedAt, 'day');
  };

  const handleSendMessage = (message) => {
    dispatch(sendMessages({ message, phone, patient_id: patientId })).then(result => {
      if (result.success) {
        handleCheckMaxSms();
      }
    });
  };

  const handleSaveDraft = () => {
    dispatch(sendMessages({ message, phone, patient_id: patientId, draft: true }));
    handleClose();
  };

  return (
    <Dialog
      show={show}
      title={translate('patient.message')}
      onCancel={handleClose}
      onCopy={handleSaveDraft}
      copyLabel={translate('patient.message.save.draft')}
    >
      <div className="chat-message-list" style={{ height: '50vh' }}>
        {messages.length > 0 && (
          messages.map((item, index) => {
            // eslint-disable-next-line
            const { message, sentAt, created_at, draft } = item;
            if (draft) {
              return;
            }

            let isSameDay = false;
            if (index > 0) {
              isSameDay = hasSameDay(messages[index - 1], item);
            }

            return (
              <div key={`message-${index}`}>
                {!isSameDay && (
                  <div className="d-flex flex-column justify-content-center align-items-center my-2 my-md-3 chat-message-day">
                    <span>{moment.utc(created_at).local().format(settings.date_format)}</span>
                  </div>
                )}
                <div className={'my-1 d-flex flex-column align-items-end'}>
                  <div className="d-flex flex-column flex-shrink-0 align-items-stretch position-relative chat-message-bubble right bg-red">
                    <MessageText text={message} />
                    <div className="d-flex flex-row align-items-center justify-content-end chat-message-info">
                      <span className="chat-message-time">{moment.utc(created_at).local().format('LT')}</span>
                      <span className="chat-message-received ml-1 pb-1">
                        {sentAt ? (
                          <GiCheckMark size={10} color="#FFFFFF" />
                        ) : (
                          <TiRefresh size={25} color="#FF0000" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>
      <InputToolbar
        isOngoingTreatment={isOngoingTreatment}
        reachMaxSms={reachMaxSms}
        isSms={true}
        defaultValue={draft}
        onSend={handleSendMessage}
        onInputSizeChanged={() => {}}
        onInputChanged={setMessage}
        translate={translate}
        showAttachment={false}
        maxLength={160}
      />
    </Dialog>
  );
};

Message.propTypes = {
  show: PropTypes.bool,
  reachMaxSms: PropTypes.bool,
  isOngoingTreatment: PropTypes.bool,
  handleClose: PropTypes.func,
  handleCheckMaxSms: PropTypes.func,
  patientId: PropTypes.string,
  phone: PropTypes.string
};

export default Message;
