import React from 'react';
import PropTypes from 'prop-types';

export const MessageImage = ({ text }) => {
  return <p className="mb-0">{text}</p>;
};

MessageImage.propTypes = {
  text: PropTypes.string
};

export default MessageImage;
