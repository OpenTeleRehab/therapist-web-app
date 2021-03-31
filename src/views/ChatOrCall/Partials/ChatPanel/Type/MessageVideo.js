import React from 'react';
import PropTypes from 'prop-types';

export const MessageVideo = ({ text }) => {
  return <p className="mb-0">{text}</p>;
};

MessageVideo.propTypes = {
  text: PropTypes.string
};

export default MessageVideo;
