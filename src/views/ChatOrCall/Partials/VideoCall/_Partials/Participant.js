import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FaUserCircle } from 'react-icons/fa';
import { getParticipantName } from '../../../../../utils/general';

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === 'video') {
        setVideoTracks(() => [track]);
      } else if (track.kind === 'audio') {
        setAudioTracks(() => [track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === 'video') {
        setVideoTracks([]);
      } else if (track.kind === 'audio') {
        setAudioTracks([]);
      }
    };

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="remote-participant">
      {(videoTracks.length === 0 || videoTracks[0].isEnabled === false) && (
        <div className="participant-avatar">
          <FaUserCircle size={50} color="white" />
        </div>
      )}
      <p className="participant-identity">
        {getParticipantName(participant.identity)}
      </p>
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

Participant.propTypes = {
  participant: PropTypes.object
};

export default Participant;
