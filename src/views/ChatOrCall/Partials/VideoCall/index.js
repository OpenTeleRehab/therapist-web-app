import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CALL_STATUS } from 'variables/rocketchat';
import { Therapist } from '../../../../services/therapist';
import Room from './_Partials/Room';
import CallingScreen from './_Partials/CallingScreen';

const VideoCall = ({ roomName, isVideoCall, onUpdateMessage, indicator, chatRooms }) => {
  const [isVideoOn, setIsVideoOn] = useState(isVideoCall);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [selectedTranscriptingLanguage, setSelectedTranscriptingLanguage] = useState('en-US');
  const [token, setToken] = useState('');

  useEffect(() => {
    if (roomName) {
      Therapist.getCallAccessToken(roomName).then(response => {
        if (response.success) {
          setToken(response.token);
        }
      });
    }
  }, [roomName]);

  const onEndCall = () => {
    onUpdateMessage(isVideoCall ? CALL_STATUS.VIDEO_ENDED : CALL_STATUS.AUDIO_ENDED, indicator._id);
  };
  const onMissCall = () => {
    onUpdateMessage(isVideoCall ? CALL_STATUS.VIDEO_MISSED : CALL_STATUS.AUDIO_MISSED, indicator._id);
  };

  return (
    <>
      {token ? (
        <Room
          token={token}
          roomName={roomName}
          isVideoOn={isVideoOn}
          setIsVideoOn={setIsVideoOn}
          isAudioOn={isAudioOn}
          setIsAudioOn={setIsAudioOn}
          selectedTranscriptingLanguage={selectedTranscriptingLanguage}
          setSelectedTranscriptingLanguage={setSelectedTranscriptingLanguage}
          onMissCall={onMissCall}
          onEndCall={onEndCall}
          chatRooms={chatRooms}
        />
      ) : (
        <CallingScreen
          isVideoOn={isVideoOn}
          setIsVideoOn={setIsVideoOn}
          isAudioOn={isAudioOn}
          setIsAudioOn={setIsAudioOn}
          onMissCall={onMissCall}
        />
      )}
    </>
  );
};

VideoCall.propTypes = {
  roomName: PropTypes.string,
  isVideoCall: PropTypes.bool,
  onUpdateMessage: PropTypes.func,
  indicator: PropTypes.object,
  chatRooms: PropTypes.array
};

export default VideoCall;
