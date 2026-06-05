import React, { useEffect, useState, useRef } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';
import ParticipantGrid from './ParticipantGrid';
import { getLiveKitToken } from '../../services/sessions';

const LiveKitRoom = ({ sessionId, userId, userName, userRole, onConnected, onDisconnected }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [localParticipant, setLocalParticipant] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const connect = async () => {
      try {
        // Fetch token from backend
        const { token, roomName, wsUrl } = await getLiveKitToken(sessionId);

        const newRoom = new Room();
        
        // Event listeners
        newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
          setParticipants(prev => [...prev, participant]);
        });
        
        newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
          setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
        });
        
        newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          // Track subscription handled in ParticipantGrid
        });

        await newRoom.connect(wsUrl, token);
        
        setRoom(newRoom);
        setLocalParticipant(newRoom.localParticipant);
        setConnected(true);
        if (onConnected) onConnected(newRoom);
      } catch (err) {
        console.error('LiveKit connection error:', err);
        setError(err.message);
      }
    };

    connect();

    return () => {
      if (room) {
        room.disconnect();
        if (onDisconnected) onDisconnected();
      }
    };
  }, [sessionId, userId]);

  const publishLocalTracks = async () => {
    if (!room) return;
    try {
      await room.localParticipant.enableCameraAndMicrophone();
    } catch (err) {
      console.error('Failed to publish tracks:', err);
    }
  };

  useEffect(() => {
    if (connected && userRole !== 'viewer') {
      publishLocalTracks();
    }
  }, [connected, userRole]);

  if (error) {
    return <div className="livekit-error">Connection error: {error}</div>;
  }

  if (!connected) {
    return <div className="livekit-loading">Connecting to live session...</div>;
  }

  return (
    <div className="livekit-room">
      <ParticipantGrid
        participants={participants}
        localParticipant={localParticipant}
        room={room}
      />
    </div>
  );
};

export default LiveKitRoom;
