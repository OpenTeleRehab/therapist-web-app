import React, { useEffect, useState } from 'react';
import Jitsi from '@webessentials/react-jitsi';
import { Button } from 'react-bootstrap';
import {
  IoVideocamOutline,
  MdCallEnd,
  IoVideocamOffOutline,
  VscMute,
  VscUnmute
} from 'react-icons/all';
import PropTypes from 'prop-types';
import Loading from './Loading';

const Call = ({ roomName, userFullName, isVideoCall, isIncomingCall, isAcceptCall, onLeave }) => {
  const [isVideoIncomingCall, setIsVideoIncomingCall] = useState(isVideoCall);
  const [isMuteCall, setIsMuteCall] = useState(true);
  const [isAcceptIncomingCall, setIsAcceptIncomingCall] = useState(false);
  const [isWaitingRecipient, setIsWaitingRecipient] = useState(true);
  const [isEndRecipient, setIsEndRecipient] = useState(false);

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
    startAudioOnly: !isVideoIncomingCall,
    startWithAudioMuted: isMuteCall
  };

  const onEndCall = () => {
    isAcceptCall(false);
    isIncomingCall(false);
    setIsWaitingRecipient(false);
    setIsEndRecipient(true);
    onLeave(true);
  };

  useEffect(() => {
    setTimeout(() => {
      if (isWaitingRecipient && !isEndRecipient) {
        setIsAcceptIncomingCall(true);
        isAcceptCall(true);
        isIncomingCall(true);
      }
    }, 5000);
  }, [isWaitingRecipient, isEndRecipient, isAcceptCall, isIncomingCall]);

  return (
    <>
      {isAcceptIncomingCall ? (
        <Jitsi
          domain={process.env.REACT_APP_JITSI_DOMAIN}
          roomName={roomName}
          displayName={userFullName}
          loadingComponent={Loading}
          containerStyle={{ width: '100%', height: '100%' }}
          interfaceConfig={interfaceConfig}
          config={config}
          onLeave={onLeave}
        />
      ) : (
        <div className="incoming d-flex flex-column">
          <div className="incoming-participant text-center d-flex justify-content-center align-items-end h-50">
            <div className="incoming-participant-info">
              <h2>Luke Cameron</h2>
              <p>Calling...</p>
            </div>
          </div>

          <div className="incoming-options mt-auto w-100">
            <ul className="d-flex justify-content-center">
              <li>
                <Button variant="light" className="btn-video-call text-dark" onClick={() => setIsVideoIncomingCall(!isVideoIncomingCall)}>
                  {isVideoIncomingCall ? (
                    <IoVideocamOutline size={20} />
                  ) : (
                    <IoVideocamOffOutline size={20} />
                  )}
                </Button>
              </li>
              <li>
                <Button variant="" className="btn-video-call text-white" onClick={() => setIsMuteCall(!isMuteCall)}>
                  {isMuteCall ? (
                    <VscMute size={20} />
                  ) : (
                    <VscUnmute size={20} />
                  )}
                </Button>
              </li>
              <li>
                <Button variant="danger" className="btn-end-call" onClick={() => onEndCall()}>
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

Call.propTypes = {
  roomName: PropTypes.string,
  userFullName: PropTypes.string,
  isVideoCall: PropTypes.bool,
  isIncomingCall: PropTypes.func,
  isAcceptCall: PropTypes.func,
  onLeave: PropTypes.func
};

Call.defaultProps = {

};

export default Call;
