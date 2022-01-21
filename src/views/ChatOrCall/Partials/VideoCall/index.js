import React, { useState } from 'react';
import Jitsi from '@webessentials/react-jitsi';
import { Button } from 'react-bootstrap';
import {
  MdCallEnd,
  IoVideocamOutline,
  IoVideocamOffOutline,
  VscMute,
  VscUnmute
} from 'react-icons/all';
import PropTypes from 'prop-types';
import SplashScreen from 'components/SplashScreen';
import { CALL_STATUS } from 'variables/rocketchat';

const VideoCall = ({ roomName, displayName, isVideoCall, onUpdateMessage, indicator, callingText }) => {
  const [isVideoOn, setIsVideoOn] = useState(isVideoCall);
  const [isMuted, setIsMuted] = useState(true);

  const interfaceConfig = {
    TOOLBAR_BUTTONS: [
      'microphone',
      'camera',
      'hangup',
      'tileview',
      'videoquality',
      'filmstrip'
    ]
  };

  const config = {
    hideConferenceSubject: true,
    enableClosePage: false,
    clientNode: '',
    disableDeepLinking: '',
    enableWelcomePage: false,
    prejoinConfig: {
      enabled: false
    },
    startAudioOnly: !isVideoOn,
    startWithAudioMuted: isMuted
  };

  const onEndCall = () => {
    onUpdateMessage(isVideoCall ? CALL_STATUS.VIDEO_ENDED : CALL_STATUS.AUDIO_ENDED, indicator._id);
  };

  const onMissCall = () => {
    onUpdateMessage(isVideoCall ? CALL_STATUS.VIDEO_MISSED : CALL_STATUS.AUDIO_MISSED, indicator._id);
  };

  return (
    <>
      {indicator.status === CALL_STATUS.ACCEPTED ? (
        <Jitsi
          domain={process.env.REACT_APP_JITSI_DOMAIN}
          roomName={roomName}
          displayName={displayName}
          loadingComponent={SplashScreen}
          containerStyle={{ width: '100%', height: '100%' }}
          interfaceConfig={interfaceConfig}
          config={config}
          onAPILoad={JitsiMeetAPI => {
            JitsiMeetAPI.addListener('readyToClose', () => {
              onEndCall();
              JitsiMeetAPI.removeListener('readyToClose');
            });
          }}
        />
      ) : (
        <div className="incoming d-flex flex-column">
          <div className="incoming-participant text-center d-flex justify-content-center align-items-end h-50">
            <div className="incoming-participant-info">
              <h2>{displayName}</h2>
              <p>{callingText}</p>
            </div>
          </div>
          <div className="incoming-options mt-auto w-100">
            <ul className="d-flex justify-content-center">
              <li>
                <Button variant="light" className="btn-video-call text-dark" onClick={() => setIsVideoOn(!isVideoOn)}>
                  {isVideoOn ? (<IoVideocamOutline size={20} />) : (<IoVideocamOffOutline size={20} />)}
                </Button>
              </li>
              <li>
                <Button variant="" className="btn-video-call text-white" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? (<VscMute size={20} />) : (<VscUnmute size={20} />)}
                </Button>
              </li>
              <li>
                <Button variant="danger" className="btn-end-call" onClick={() => onMissCall()}>
                  <MdCallEnd size={20} />
                </Button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

VideoCall.propTypes = {
  roomName: PropTypes.string,
  displayName: PropTypes.string,
  isVideoCall: PropTypes.bool,
  onUpdateMessage: PropTypes.func,
  indicator: PropTypes.object,
  callingText: PropTypes.string
};

export default VideoCall;
