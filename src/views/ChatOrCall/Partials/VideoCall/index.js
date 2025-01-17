import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VideoCallContextProvider } from '../../../../context/VideoCallContext';
import { CALL_STATUS } from '../../../../variables/rocketchat';
import PropTypes from 'prop-types';
import Room from './_Partials/Room';
import CallingScreen from './_Partials/CallingScreen';

const VideoCall = () => {
  const { callAccessToken, videoCall } = useSelector(state => state.rocketchat);
  const [isVideoOn, setIsVideoOn] = useState(undefined);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [selectedTranscriptingLanguage, setSelectedTranscriptingLanguage] = useState('en-US');

  useEffect(() => {
    if (videoCall && videoCall.status === CALL_STATUS.AUDIO_STARTED) {
      setIsVideoOn(false);
    }
    if (videoCall && videoCall.status === CALL_STATUS.VIDEO_STARTED) {
      setIsVideoOn(true);
    }
  }, [videoCall]);

  return (
    <VideoCallContextProvider>
      {callAccessToken && videoCall && (
        <div className="calling">
          <Room
            callAccessToken={callAccessToken}
            isVideoOn={isVideoOn}
            isAudioOn={isAudioOn}
            selectedTranscriptingLanguage={selectedTranscriptingLanguage}
            setIsVideoOn={setIsVideoOn}
            setIsAudioOn={setIsAudioOn}
            setSelectedTranscriptingLanguage={setSelectedTranscriptingLanguage}
          />
        </div>
      )}
      {!callAccessToken && videoCall && videoCall.status.startsWith('jitsi_call') && (videoCall.status.endsWith('_started')) && (
        <div className="calling">
          <CallingScreen
            isVideoOn={isVideoOn}
            isAudioOn={isAudioOn}
            setIsVideoOn={setIsVideoOn}
            setIsAudioOn={setIsAudioOn}
          />
        </div>
      )}
    </VideoCallContextProvider>
  );
};

VideoCall.propTypes = {
  roomName: PropTypes.string,
  isVideoCall: PropTypes.bool,
  onUpdateMessage: PropTypes.func,
  indicator: PropTypes.object
};

export default VideoCall;
