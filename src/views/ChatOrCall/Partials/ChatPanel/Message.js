import React, { useEffect, useRef, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CALL_STATUS, CHAT_TYPES } from 'variables/rocketchat';
import PhotoSwiper from 'components/PhotoSwiper';
import settings from 'settings';
import MessageText from './Type/MessageText';
import MessageImage from './Type/MessageImage';
import MessageVideo from './Type/MessageVideo';
import { GiCheckMark } from 'react-icons/gi';
import Spinner from 'react-bootstrap/Spinner';

const Message = ({ translate, messages, currentUser, msgOuterHeight }) => {
  const messageEndRef = useRef(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [onAttachmentLoaded, setOnAttachmentLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const photoSwipeItems = [];
  let photoSwipeIndex = -1;

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line
  }, [[...messages]]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messages.length && messageEndRef && messageEndRef.current !== null) {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const hasSameDay = (previousMessage, currentMessage) => {
    const previousCreatedAt = moment(previousMessage._updatedAt);
    const currentCreatedAt = moment(currentMessage._updatedAt);
    return currentCreatedAt.isSame(previousCreatedAt, 'day');
  };

  const hasSameOwner = (currentMessage) => {
    return currentMessage.u._id === currentUser;
  };

  const getMessageText = (msg) => {
    let text = msg || '';
    if (msg === CALL_STATUS.AUDIO_MISSED || msg === CALL_STATUS.VIDEO_MISSED || CALL_STATUS.BUSY) {
      text = translate(msg);
    } else if ([CALL_STATUS.AUDIO_STARTED, CALL_STATUS.VIDEO_STARTED, CALL_STATUS.ACCEPTED].includes(msg)) {
      text = translate(msg);
    } else if (msg === CALL_STATUS.AUDIO_ENDED || msg === CALL_STATUS.VIDEO_ENDED) {
      text = translate(msg);
    }
    return text;
  };

  const setPhotoSwipeItem = (attachment) => {
    const { url, caption, title, width, height } = attachment;
    photoSwipeIndex++;
    photoSwipeItems[photoSwipeIndex] = {
      src: url,
      title: caption,
      name: title,
      w: width,
      h: height
    };
  };

  const imagePopupHandler = (index) => {
    setActiveIndex(index);
    setShowImagePopup(true);
  };

  return (
    <>
      <div className="chat-message-list" style={{ height: `calc(100vh - ${msgOuterHeight}px)` }}>
        {messages.length > 0 && (
          messages.map((message, idx) => {
            const { msg, type, isVideoCall, attachment, _updatedAt, received } = message;
            let isSameDay = false;
            const isSameOwner = hasSameOwner(message);
            const direction = isSameOwner ? 'right' : 'left';
            if (idx > 0) {
              isSameDay = hasSameDay(messages[idx - 1], message);
            }
            if (message.type === CHAT_TYPES.IMAGE) {
              setPhotoSwipeItem(attachment);
            }
            if (onAttachmentLoaded) {
              scrollToBottom();
            }

            return (
              <div key={`message-${idx}`}>
                {!isSameDay && (
                  <div className="d-flex flex-column justify-content-center align-items-center my-2 my-md-3 chat-message-day">
                    <span>{moment(_updatedAt).format(settings.date_format)}</span>
                  </div>
                )}
                <div className={`my-1 d-flex flex-column ${isSameOwner ? 'align-items-end' : 'align-items-start'}`}>
                  <div className={`d-flex flex-column flex-shrink-0 align-items-stretch position-relative chat-message-bubble ${direction}`}>
                    {type === CHAT_TYPES.TEXT ? (
                      <MessageText text={getMessageText(msg)} isVideoCall={isVideoCall} />
                    ) : type === CHAT_TYPES.IMAGE ? (
                      <MessageImage attachment={attachment} index={photoSwipeIndex} onAttachmentLoaded={setOnAttachmentLoaded} onClick={imagePopupHandler} />
                    ) : (
                      <MessageVideo attachment={attachment} onAttachmentLoaded={setOnAttachmentLoaded} />
                    )}
                    <div className={`d-flex flex-row align-items-center ${isSameOwner ? 'justify-content-end' : 'justify-content-start'} chat-message-info`}>
                      <span className="chat-message-time">{moment(_updatedAt).format('LT')}</span>
                      {direction === 'right' && received && (
                        <span className="chat-message-received ml-1 pb-1">
                          <GiCheckMark size={10} color="#FFFFFF" />
                        </span>
                      )}
                    </div>
                    {direction === 'right' && !received && (
                      <div className="position-absolute d-flex align-items-center justify-content-center w-100 h-100 chat-message-pending">
                        <Spinner animation="border" variant="primary"/>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>
      {photoSwipeItems.length > 0 && showImagePopup && (
        <Fragment>
          <PhotoSwiper
            activeIndex={activeIndex}
            isOpen={showImagePopup}
            onClose={setShowImagePopup}
            items={photoSwipeItems}
            closeLabel={translate('common.close')}
            fullScreenLabel={translate('common.toggle_fullscreen')}
            zoomLabel={translate('common.zoom')}
            downloadLabel={translate('common.download')}
          />
        </Fragment>
      )}
    </>
  );
};

Message.propTypes = {
  translate: PropTypes.func,
  messages: PropTypes.array,
  currentUser: PropTypes.string,
  msgOuterHeight: PropTypes.number
};

export default Message;
