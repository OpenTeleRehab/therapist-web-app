import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import {
  IoMicOff,
  IoMicOutline,
  IoVideocamOffOutline,
  IoVideocamOutline,
  MdCallEnd
} from 'react-icons/all';
import CallingButton from '../../../../../components/CallingButton';

const CallingControls = ({ isVideoOn, setIsVideoOn, isMuted, setIsMuted, onMissCall }) => {
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
          <Button variant="light" className="btn-muted-call text-dark" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? (<IoMicOff size={20}/>) : (<IoMicOutline size={20}/>)}
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
  isMuted: PropTypes.bool,
  setIsVideoOn: PropTypes.func,
  setIsMuted: PropTypes.func,
  onMissCall: PropTypes.func
};

export default CallingControls;
