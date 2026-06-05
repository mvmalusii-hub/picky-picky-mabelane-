import React, { useEffect, useRef } from 'react';
import { Track } from 'livekit-client';

const ParticipantTile = ({ participant, isLocal, room }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!participant) return;

    // Subscribe to existing tracks
    participant.tracks.forEach((pub) => {
      if (pub.track && pub.kind === Track.Kind.Video && videoRef.current) {
        pub.track.attach(videoRef.current);
      }
      if (pub.track && pub.kind === Track.Kind.Audio && audioRef.current) {
        pub.track.attach(audioRef.current);
      }
    });

    // Listen for new tracks
    const handleTrackSubscribed = (track, publication) => {
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
      }
      if (track.kind === Track.Kind.Audio && audioRef.current) {
        track.attach(audioRef.current);
      }
    };

    participant.on('trackSubscribed', handleTrackSubscribed);

    return () => {
      participant.off('trackSubscribed', handleTrackSubscribed);
    };
  }, [participant]);

  // Parse metadata for role
  let role = 'viewer';
  try {
    const metadata = JSON.parse(participant.metadata || '{}');
    role = metadata.role || 'viewer';
  } catch (e) {}

  const displayName = participant.name || participant.identity.split(':').pop();

  return (
    <div className={`participant-tile ${role}`}>
      <video ref={videoRef} autoPlay playsInline muted={isLocal} />
      <audio ref={audioRef} autoPlay />
      <div className="participant-label">
        <span className="participant-name">{displayName}</span>
        {role !== 'viewer' && <span className="participant-role-badge">{role}</span>}
        {isLocal && <span className="participant-local-badge">You</span>}
      </div>
    </div>
  );
};

export default ParticipantTile;
