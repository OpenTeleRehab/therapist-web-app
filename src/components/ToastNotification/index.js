import React from 'react';
import { Toast } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { closeNotification } from 'store/notification/actions';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { getTranslate } from 'react-localize-redux';

const ToastNotification = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const { message: messageNode, title, messageParams } = notification;

  return (
    <Toast
      onClose={() => { dispatch(closeNotification()); }}
      show={notification.show}
      autohide
      className={`type-${notification.color}`}
    >
      <Toast.Header>
        {
          notification.color === 'success' &&
          <BsCheckCircle size={22} className="mr-2" />
        }
        {
          notification.color === 'danger' &&
          <BsXCircle size={22} className="mr-2" />
        }
        <strong className="mr-auto">
          {typeof title === 'object' ? title : translate(title)}
        </strong>
      </Toast.Header>
      <Toast.Body>
        {typeof messageNode === 'object'
          ? messageNode
          : translate(messageNode || 'error_message.server_error', messageParams)}
      </Toast.Body>
    </Toast>
  );
};

export default ToastNotification;
