import React from 'react';
import PropTypes from 'prop-types';

export const MessageVideo = ({ attachment, onAttachmentLoaded }) => {
  return (
    <div className="chat-message-attachment">
      <video className="w-100" controls disablePictureInPicture>
        <source
          src={attachment.url}
          type="video/mp4"
          onLoad={() => onAttachmentLoaded(true)}
        />
      </video>
      {attachment.caption && (
        <figcaption>{attachment.caption}</figcaption>
      )}
    </div>
  );
};

MessageVideo.propTypes = {
  attachment: PropTypes.object,
  onAttachmentLoaded: PropTypes.func
};

export default MessageVideo;
