import React from 'react';
import PropTypes from 'prop-types';

export const MessageText = ({ text }) => {
  return <p className="mb-0">{text}</p>;
};

MessageText.propTypes = {
  text: PropTypes.string
};

export default MessageText;
