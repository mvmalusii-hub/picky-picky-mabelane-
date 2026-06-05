import { useEffect, useState } from 'react';
import { Room } from 'livekit-client';

export const useLiveKit = (sessionId, token, wsUrl) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!token || !wsUrl) return;
    const newRoom = new Room();
    newRoom.connect(wsUrl, token).then(() => {
      setRoom(newRoom);
      setParticipants(Array.from(newRoom.participants.values()));
      newRoom.on('participantConnected', (p) => setParticipants(prev => [...prev, p]));
      newRoom.on('participantDisconnected', (p) => setParticipants(prev => prev.filter(part => part.identity !== p.identity)));
    });
    return () => newRoom?.disconnect();
  }, [sessionId, token, wsUrl]);

  return { room, participants };
};
