import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'twilio-video';
import PropTypes from 'prop-types';
import Participant from './Participant';
import CallingScreen from './CallingScreen';
import CallingControls from './CallingControls';
import { showErrorNotification } from '../../../../../store/notification/actions';

const Room = ({ roomName, token, isVideoOn, setIsVideoOn, isMuted, setIsMuted, onMissCall, onEndCall }) => {
  const dispatch = useDispatch();
  const [room, setRoom] = useState();
  const [participant, setParticipant] = useState();
  const [showLocalAvatar, setShowLocalAvatar] = useState(!isVideoOn);

  useEffect(() => {
    const participantConnected = participant => {
      setParticipant(participant);
    };

    const participantDisconnected = () => {
      onEndCall();
      setParticipant(undefined);
    };

    connect(token, {
      name: roomName,
      video: true,
      audio: true,
      networkQuality: { local: 3, remote: 3 }
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    }).catch(error => {
      if ('code' in error) {
        // Handle connection error here.
        dispatch(showErrorNotification('Failed to join room', error.message));
      }
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  useEffect(() => {
    room && room.localParticipant.videoTracks.forEach(publication => {
      if (isVideoOn) {
        publication.track.enable();
        setShowLocalAvatar(false);
      } else {
        publication.track.disable();
        setShowLocalAvatar(true);
      }
    });
  }, [isVideoOn, room]);

  useEffect(() => {
    room && room.localParticipant.audioTracks.forEach(publication => {
      if (isMuted) {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
    });
  }, [isMuted, room]);

  if (!participant) {
    return (
      <CallingScreen
        isVideoOn={isVideoOn}
        setIsVideoOn={setIsVideoOn}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onMissCall={onMissCall}
      />
    );
  }

  return (
    <div className="room">
      <h6 className="text-white participant-name">{participant.identity}</h6>
      <div className="remote">
        <Participant participant={participant} />
      </div>

      <div className="local">
        <Participant participant={room.localParticipant} showAvatar={showLocalAvatar} />
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

Room.propTypes = {
  roomName: PropTypes.string,
  token: PropTypes.string,
  isVideoOn: PropTypes.bool,
  isMuted: PropTypes.bool,
  setIsVideoOn: PropTypes.func,
  setIsMuted: PropTypes.func,
  onMissCall: PropTypes.func,
  onEndCall: PropTypes.func
};

export default Room;
