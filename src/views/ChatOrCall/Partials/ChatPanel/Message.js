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

const Message = ({ translate, messages, currentUser, msgOuterHeight }) => {
  const messageEndRef = useRef(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const photoSwipeItems = [];
  let photoSwipeIndex = -1;

  useEffect(() => {
    if (messages.length && messageEndRef) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messageEndRef]);

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
    if (msg === CALL_STATUS.MISSED) {
      text = translate('video_call_missed');
    } else if (msg === CALL_STATUS.STARTED) {
      text = translate('video_call_started');
    } else if (msg === CALL_STATUS.ENDED) {
      text = translate('video_call_ended');
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
            const { msg, type, isVideoCall, attachment, _updatedAt } = message;
            let isSameDay = false;
            const isSameOwner = hasSameOwner(message);
            const direction = isSameOwner ? 'right' : 'left';
            if (idx > 0) {
              isSameDay = hasSameDay(messages[idx - 1], message);
            }
            if (message.type === CHAT_TYPES.IMAGE) {
              setPhotoSwipeItem(attachment);
            }

            return (
              <div key={`message-${idx}`}>
                {!isSameDay && (
                  <div className="d-flex flex-column justify-content-center align-items-center my-2 my-md-3 chat-message-day">
                    <span>{moment(_updatedAt).format(settings.date_format)}</span>
                  </div>
                )}
                <div className={`my-1 d-flex flex-column ${isSameOwner ? 'align-items-end' : 'align-items-start'}`}>
                  <div className={`d-flex flex-column flex-shrink-0 align-items-stretch chat-message-bubble ${direction}`}>
                    {type === CHAT_TYPES.TEXT ? (
                      <MessageText text={getMessageText(msg)} isVideoCall={isVideoCall} />
                    ) : type === CHAT_TYPES.IMAGE ? (
                      <MessageImage attachment={attachment} index={photoSwipeIndex} onClick={imagePopupHandler} />
                    ) : (
                      <MessageVideo attachment={attachment} />
                    )}
                    <div className={`d-flex flex-row align-items-center ${isSameOwner ? 'justify-content-end' : 'justify-content-start'} chat-message-info`}>
                      <span className="chat-message-time">{moment(_updatedAt).format('LT')}</span>
                      {direction === 'right' && (
                        <span className="chat-message-tick ml-1 pb-1"><GiCheckMark size={10} color="#FFFFFF" /></span>
                      )}
                    </div>
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
