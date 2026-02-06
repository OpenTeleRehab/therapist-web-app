import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useVideoCallContext } from '../../../../../context/VideoCallContext';
import {
  IoMicOff,
  IoMicOutline,
  IoVideocamOffOutline,
  IoVideocamOutline
} from 'react-icons/io5';
import {
  MdCall,
  MdCallEnd
} from 'react-icons/md';
import CallingButton from '../../../../../components/CallingButton';

const CallingControls = ({ isVideoOn, isAudioOn, setIsVideoOn, setIsAudioOn }) => {
  const { callAccessToken, hasStartedCall } = useSelector(state => state.rocketchat);
  const { handleAcceptCall, handleDeclineCall } = useVideoCallContext();

  return (
    <div className="fixed-bottom pt-4 pb-4">
      <div className="incoming-options">
        <ul className="d-flex justify-content-center">
          <li>
            <CallingButton variant="light" className="btn-video-call text-dark" onClick={() => setIsVideoOn(!isVideoOn)}>
              {isVideoOn ? (<IoVideocamOutline size={20}/>) : (<IoVideocamOffOutline size={20}/>)}
            </CallingButton>
          </li>
          <li>
            <Button variant="light" className="btn-muted-call text-dark" onClick={() => setIsAudioOn(!isAudioOn)}>
              {isAudioOn ? (<IoMicOutline size={20}/>) : (<IoMicOff size={20}/>)}
            </Button>
          </li>
          {callAccessToken === undefined && !hasStartedCall && (
            <li>
              <Button variant="success" className="btn-accept-call" onClick={handleAcceptCall}>
                <MdCall size={20}/>
              </Button>
            </li>
          )}
          <li>
            <Button variant="danger" className="btn-end-call" onClick={handleDeclineCall}>
              <MdCallEnd size={20}/>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

CallingControls.propTypes = {
  isVideoOn: PropTypes.bool,
  isAudioOn: PropTypes.bool,
  setIsVideoOn: PropTypes.func,
  setIsAudioOn: PropTypes.func
};

export default CallingControls;
