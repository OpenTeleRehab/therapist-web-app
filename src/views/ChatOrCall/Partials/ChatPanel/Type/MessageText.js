import React from 'react';
import PropTypes from 'prop-types';
import { IoVideocamOutline } from 'react-icons/io5';

export const MessageText = ({ text, isVideoCall }) => {
  return <p className="mb-0">{isVideoCall && <IoVideocamOutline size={20} />} {text}</p>;
};

MessageText.propTypes = {
  text: PropTypes.string,
  isVideoCall: PropTypes.bool
};

export default MessageText;
