import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CHAT_TYPES } from 'variables/rocketchat';
import settings from 'settings';
import MessageText from './Type/MessageText';
import MessageImage from './Type/MessageImage';
import MessageVideo from './Type/MessageVideo';

const Message = ({ messages, currentUser, msgOuterHeight }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messages.length && messageEndRef) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messageEndRef]);
  // const hasSameUser = (previousMessage, currentMessage) => {
  //   return previousMessage.u._id === currentMessage.u._id;
  // };

  const hasSameDay = (previousMessage, currentMessage) => {
    const previousCreatedAt = moment(previousMessage._updatedAt);
    const currentCreatedAt = moment(currentMessage._updatedAt);
    return currentCreatedAt.isSame(previousCreatedAt, 'day');
  };

  const hasSameOwner = (currentMessage) => {
    return currentMessage.u._id === currentUser;
  };

  const checkType = (currentMessage) => {
    if (currentMessage.image && currentMessage.image !== '') {
      return CHAT_TYPES.IMAGE;
    } else if (currentMessage.video && currentMessage.video !== '') {
      return CHAT_TYPES.VIDEO;
    }
    return CHAT_TYPES.TEXT;
  };

  return (
    <div className="chat-message-list" style={{ height: `calc(100vh - ${msgOuterHeight}px)` }}>
      {messages.length > 0 && (
        messages.map((message, idx) => {
          let isSameDay = false;
          const type = checkType(message);
          const isSameOwner = hasSameOwner(message);
          const direction = isSameOwner ? 'right' : 'left';
          if (idx > 0) {
            isSameDay = hasSameDay(messages[idx - 1], message);
          }
          if (idx === messages.length - 1) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
          return (
            <div key={`message-${idx}`}>
              {!isSameDay && (
                <div className="d-flex flex-column justify-content-center align-items-center my-2 my-md-3 chat-message-day">
                  <span>{moment(message._updatedAt).format(settings.date_format)}</span>
                </div>
              )}
              <div className={`my-1 d-flex flex-column ${isSameOwner ? 'align-items-end' : 'align-items-start'}`}>
                <div className={`d-flex flex-column flex-shrink-0 align-items-stretch chat-message-bubble ${direction}`}>
                  {type === CHAT_TYPES.TEXT ? (
                    <MessageText text={message.msg} />
                  ) : type === CHAT_TYPES.IMAGE ? (
                    <MessageImage text={message.msg} />
                  ) : (
                    <MessageVideo text={message.msg} />
                  )}
                  <div className={`d-flex flex-row ${isSameOwner ? 'justify-content-end' : 'justify-content-start'}`}>
                    <span className="chat-message-info">{moment(message._updatedAt).format('LT')}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

Message.propTypes = {
  messages: PropTypes.array,
  currentUser: PropTypes.string,
  msgOuterHeight: PropTypes.number
};

export default Message;
