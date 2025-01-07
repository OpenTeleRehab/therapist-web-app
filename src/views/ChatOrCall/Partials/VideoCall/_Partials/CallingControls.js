import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import {
  IoMicOff,
  IoMicOutline,
  IoVideocamOffOutline,
  IoVideocamOutline
} from 'react-icons/io5';
import {
  MdCallEnd
} from 'react-icons/md';
import CallingButton from '../../../../../components/CallingButton';

const CallingControls = ({ isVideoOn, setIsVideoOn, isAudioOn, setIsAudioOn, onMissCall }) => {
  return (
    <div className="incoming-options mt-auto w-100">
      <ul className="d-flex justify-content-center">
        <li>
          <CallingButton variant="light" className="btn-video-call text-dark"
            onClick={() => setIsVideoOn(!isVideoOn)}>
            {isVideoOn ? (<IoVideocamOutline size={20}/>) : (<IoVideocamOffOutline size={20}/>)}
          </CallingButton>
        </li>
        <li>
          <Button variant="light" className="btn-muted-call text-dark" onClick={() => setIsAudioOn(!isAudioOn)}>
            {isAudioOn ? (<IoMicOutline size={20}/>) : (<IoMicOff size={20}/>)}
          </Button>
        </li>
        <li>
          <Button variant="danger" className="btn-end-call" onClick={() => onMissCall()}>
            <MdCallEnd size={20}/>
          </Button>
        </li>
      </ul>
    </div>
  );
};

CallingControls.propTypes = {
  isVideoOn: PropTypes.bool,
  isAudioOn: PropTypes.bool,
  setIsVideoOn: PropTypes.func,
  setIsAudioOn: PropTypes.func,
  onMissCall: PropTypes.func
};

export default CallingControls;
