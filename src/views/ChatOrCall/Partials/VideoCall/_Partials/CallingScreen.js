import React from 'react';
import PropTypes from 'prop-types';
import useTranslate from 'hooks/useTranslate';
import { useSelector } from 'react-redux';
import CallingControls from './CallingControls';

const CallingScreen = ({ isVideoOn, setIsVideoOn, isMuted, setIsMuted, onMissCall }) => {
  const translate = useTranslate();
  const { selectedRoom } = useSelector(state => state.rocketchat);

  return (
    <div className="incoming d-flex flex-column">
      <div className="incoming-participant text-center d-flex justify-content-center align-items-end h-50">
        <div className="incoming-participant-info">
          <h2>{selectedRoom.name}</h2>
          <p>{translate('video_call_starting')}</p>
        </div>
      </div>

      <div className="fixed-bottom">
        <CallingControls
          isVideoOn={isVideoOn}
          setIsVideoOn={setIsVideoOn}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onMissCall={onMissCall}/>
      </div>
    </div>
  );
};

CallingScreen.propTypes = {
  isVideoOn: PropTypes.bool,
  isMuted: PropTypes.bool,
  setIsVideoOn: PropTypes.func,
  setIsMuted: PropTypes.func,
  onMissCall: PropTypes.func
};

export default CallingScreen;
