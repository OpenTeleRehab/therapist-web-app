import React, { useEffect, useRef, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CHAT_TYPES } from 'variables/rocketchat';
import PhotoSwiper from 'components/PhotoSwiper';
import settings from 'settings';
import MessageText from './Type/MessageText';
import MessageImage from './Type/MessageImage';
import MessageVideo from './Type/MessageVideo';

const Message = ({ translate, messages, currentUser, msgOuterHeight }) => {
  const messageEndRef = useRef(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const chatImages = [];
  let imageIndex = 0;

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

  const imagePopupHandler = (index) => {
    setActiveIndex(index);
    setShowImagePopup(true);
  };

  return (
    <>
      <div className="chat-message-list" style={{ height: `calc(100vh - ${msgOuterHeight}px)` }}>
        {messages.length > 0 && (
          messages.map((message, idx) => {
            let isSameDay = false;
            const isSameOwner = hasSameOwner(message);
            const direction = isSameOwner ? 'right' : 'left';
            if (idx > 0) {
              isSameDay = hasSameDay(messages[idx - 1], message);
            }
            if (idx === messages.length - 1) {
              messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            if (message.type === CHAT_TYPES.IMAGE) {
              const { url, caption, title, width, height } = message.attachment;
              chatImages[imageIndex] = {
                src: url,
                title: caption,
                name: title,
                w: width,
                h: height
              };
              imageIndex++;
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
                    {message.type === CHAT_TYPES.TEXT ? (
                      <MessageText text={message.msg} />
                    ) : message.type === CHAT_TYPES.IMAGE ? (
                      <MessageImage attachment={message.attachment} index={imageIndex - 1} onClick={imagePopupHandler} />
                    ) : (
                      <MessageVideo attachment={message.attachment} />
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
      {chatImages.length > 0 && showImagePopup && (
        <Fragment>
          <PhotoSwiper
            activeIndex={activeIndex}
            isOpen={showImagePopup}
            onClose={setShowImagePopup}
            items={chatImages}
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
