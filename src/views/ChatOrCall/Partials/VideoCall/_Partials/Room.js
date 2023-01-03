import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect, createLocalVideoTrack, createLocalAudioTrack } from 'twilio-video';
import PropTypes from 'prop-types';
import Participant from './Participant';
import CallingScreen from './CallingScreen';
import CallingControls from './CallingControls';
import { showErrorNotification } from '../../../../../store/notification/actions';

const Room = ({ roomName, token, isVideoOn, setIsVideoOn, isAudioOn, setIsAudioOn, onMissCall, onEndCall }) => {
  const dispatch = useDispatch();
  const [room, setRoom] = useState();
  const [participant, setParticipant] = useState();
  const isActive = useRef(true);

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
      video: isVideoOn,
      audio: isAudioOn,
      networkQuality: { local: 3, remote: 3 }
    }).then(room => {
      if (!isActive.current && room && room.localParticipant.state === 'connected') {
        room.disconnect();
        return;
      }

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
      isActive.current = false;
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

  const toggleVideo = async () => {
    if (room === undefined) {
      return;
    }

    const toggleVideoOn = !isVideoOn;
    if (toggleVideoOn) {
      const videoTrack = await createLocalVideoTrack();
      await room.localParticipant.publishTrack(videoTrack);
    } else {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });
    }

    setIsVideoOn(toggleVideoOn);
  };

  const toggleAudio = async () => {
    if (room === undefined) {
      return;
    }

    const toggleAudioOn = !isAudioOn;
    if (toggleAudioOn) {
      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(audioTrack);
    } else {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });
    }

    setIsAudioOn(toggleAudioOn);
  };

  if (!participant) {
    return (
      <CallingScreen
        isVideoOn={isVideoOn}
        setIsVideoOn={toggleVideo}
        isAudioOn={isAudioOn}
        setIsAudioOn={toggleAudio}
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
        <Participant participant={room.localParticipant} isVideoOn={isVideoOn} isAudioOn={isAudioOn} />
      </div>

      <div className="fixed-bottom">
        <CallingControls
          isVideoOn={isVideoOn}
          setIsVideoOn={toggleVideo}
          isAudioOn={isAudioOn}
          setIsAudioOn={toggleAudio}
          onMissCall={onMissCall}/>
      </div>
    </div>
  );
};

Room.propTypes = {
  roomName: PropTypes.string,
  token: PropTypes.string,
  isVideoOn: PropTypes.bool,
  isAudioOn: PropTypes.bool,
  setIsVideoOn: PropTypes.func,
  setIsAudioOn: PropTypes.func,
  onMissCall: PropTypes.func,
  onEndCall: PropTypes.func
};

export default Room;
