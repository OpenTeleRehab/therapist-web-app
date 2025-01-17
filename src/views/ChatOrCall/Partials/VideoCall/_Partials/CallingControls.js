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
  const { callAccessToken, videoCall, authUserId } = useSelector(state => state.rocketchat);
  const { handleAcceptCall, handleDeclineCall } = useVideoCallContext();

  return (
    <div className="incoming-options mt-auto w-100">
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
        {!callAccessToken && videoCall.u._id !== authUserId && (
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
  );
};

CallingControls.propTypes = {
  isVideoOn: PropTypes.bool,
  isAudioOn: PropTypes.bool,
  setIsVideoOn: PropTypes.func,
  setIsAudioOn: PropTypes.func
};

export default CallingControls;
