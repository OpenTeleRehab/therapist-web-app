import React from 'react';
import PropTypes from 'prop-types';

export const MessageImage = ({ attachment, index, onAttachmentLoaded, onClick }) => {
  return (
    <div className="chat-message-attachment">
      <img
        src={attachment.url}
        alt={attachment.title} className="w-100"
        onLoad={() => onAttachmentLoaded(true)}
        onClick={() => onClick(index)}
      />
      {attachment.caption && (
        <figcaption>{attachment.caption}</figcaption>
      )}
    </div>
  );
};

MessageImage.propTypes = {
  attachment: PropTypes.object,
  index: PropTypes.number,
  onAttachmentLoaded: PropTypes.func,
  onClick: PropTypes.func
};

export default MessageImage;
