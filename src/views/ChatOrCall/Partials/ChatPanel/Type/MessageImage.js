import React from 'react';
import PropTypes from 'prop-types';

export const MessageImage = ({ attachment, index, onClick }) => {
  return (
    <div className="chat-message-attachment">
      <img
        src={attachment.url}
        alt={attachment.title} className="w-100"
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
  onClick: PropTypes.func
};

export default MessageImage;
