import React, { useEffect, useRef } from 'react';
import ParticipantTile from './ParticipantTile';

const ParticipantGrid = ({ participants, localParticipant, room }) => {
  const containerRef = useRef(null);
  
  const allParticipants = localParticipant 
    ? [localParticipant, ...participants] 
    : [...participants];

  // Determine grid layout based on number of participants
  const getGridClass = (count) => {
    if (count <= 2) return 'grid-2';
    if (count <= 4) return 'grid-4';
    if (count <= 9) return 'grid-9';
    return 'grid-12';
  };

  return (
    <div className={`participant-grid ${getGridClass(allParticipants.length)}`} ref={containerRef}>
      {allParticipants.map((participant) => (
        <ParticipantTile
          key={participant.identity}
          participant={participant}
          isLocal={participant === localParticipant}
          room={room}
        />
      ))}
    </div>
  );
};

export default ParticipantGrid;
