import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const LocalParticipant = ({ participant, isVideoOn, isAudioOn, selectedTranscriptingLanguage }) => {
  const videoRef = useRef();
  const audioRef = useRef();
  const recognitionRef = useRef();
  const { profile } = useSelector((state) => state.auth);

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    const videoTrack = trackpubsToTracks(participant.videoTracks)[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [participant, isVideoOn]);

  useEffect(() => {
    const audioTrack = trackpubsToTracks(participant.audioTracks)[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [participant, isAudioOn]);

  useEffect(() => {
    if (!recognitionRef.current && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keeps listening until stopped
      recognitionRef.current.interimResults = true; // Shows interim results
      recognitionRef.current.lang = 'en-US'; // Set language
      recognitionRef.current.onerror = (event) => {
        console.error(`Speech recognition error detected: ${event.error}`);
        restartSpeechRecognition();
      };
    }

    startListening();
    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    restartSpeechRecognition();
  }, [selectedTranscriptingLanguage]);

  const sendData = message => {
    if (participant && participant.dataTracks && participant.dataTracks.values().next().value) {
      const dataTrack = participant.dataTracks.values().next().value.track;
      dataTrack.send('[' + profile.first_name + ']: ' + message); // Send the message
    } else {
      console.error('DataTrack is not available.');
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return alert('Speech Recognition not supported!');
    recognitionRef.current.start();

    recognitionRef.current.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');

      const lastFewWords = getLastNWords(selectedTranscriptingLanguage, currentTranscript, 50);
      sendData(lastFewWords);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech Recognition Error: ', event.error);
    };
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    recognitionRef.current = null;
  };

  const restartSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.warn('Error stopping recognition:', error);
        }

        if (isAudioOn) {
          recognitionRef.current.lang = selectedTranscriptingLanguage;
          recognitionRef.current.onend = () => {
            restartSpeechRecognition();
          };

          setTimeout(() => {
            try {
              startListening();
            } catch (e) {
            }
          }, 500);
        }
      } catch (e) {
        console.log('Error while trying to restart SpeechRecognition', e);
      }
    }
  };

  const getLastNWords = (language, text, n) => {
    const segmenter = new Intl.Segmenter(language, { granularity: 'word' });
    const segments = segmenter.segment(text);
    const words = Array.from(segments, segment => segment.segment);
    return words.slice(-n).join('');
  };

  return (
    <div className="participant">
      {!isVideoOn && (
        <div className="participant-avatar">
          <FaUserCircle size={50} color="white" />
        </div>
      )}
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

LocalParticipant.propTypes = {
  participant: PropTypes.object,
  isAudioOn: PropTypes.bool,
  isVideoOn: PropTypes.bool,
  selectedTranscriptingLanguage: PropTypes.string
};

export default LocalParticipant;
