import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useVideoCallContext } from '../../../../../context/VideoCallContext';
import { CALL_STATUS } from '../../../../../variables/rocketchat';
import PropTypes from 'prop-types';
import useTranslate from 'hooks/useTranslate';
import CallingControls from './CallingControls';

const CallingScreen = ({ isVideoOn, setIsVideoOn, isAudioOn, setIsAudioOn }) => {
  const translate = useTranslate();
  const callTimeout = useRef(null);
  const { authUserId, videoCall, selectedRoom } = useSelector(state => state.rocketchat);
  const { handleUpdateMessage } = useVideoCallContext();

  useEffect(() => {
    callTimeout.current = setTimeout(() => {
      const _id = videoCall._id;
      const rid = videoCall.rid;
      const identity = videoCall.identity;
      const msg = videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_ENDED : CALL_STATUS.VIDEO_ENDED;

      handleUpdateMessage(_id, rid, identity, msg);
    }, 60000);

    return () => {
      clearInterval(callTimeout.current);
    };
  }, [videoCall]);

  return (
    <div className="incoming d-flex flex-column">
      <div className="incoming-participant text-center d-flex justify-content-center align-items-end h-50">
        <div className="incoming-participant-info">
          {videoCall && videoCall.u._id === authUserId ? (
            <h2>{selectedRoom.name}</h2>
          ) : (
            <h2>{videoCall.u.name}</h2>
          )}
          <p>{translate('video_call_starting')}</p>
        </div>
      </div>

      <div className="fixed-bottom">
        <CallingControls
          isVideoOn={isVideoOn}
          isAudioOn={isAudioOn}
          setIsVideoOn={setIsVideoOn}
          setIsAudioOn={setIsAudioOn}
        />
      </div>
    </div>
  );
};

CallingScreen.propTypes = {
  isVideoOn: PropTypes.bool,
  isAudioOn: PropTypes.bool,
  setIsVideoOn: PropTypes.func,
  setIsAudioOn: PropTypes.func
};

export default CallingScreen;
