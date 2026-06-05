import React from 'react';

const FanFavoriteBar = ({ tallies, contestants }) => {
  const maxVotes = Math.max(...Object.values(tallies), 1);
  const sorted = [...contestants].sort((a,b) => (tallies[b.id]||0) - (tallies[a.id]||0));

  return (
    <div className="fan-favorite-bar">
      <h4>❤️ Fan Favorite Leaderboard</h4>
      {sorted.map(c => {
        const votes = tallies[c.id] || 0;
        const width = (votes / maxVotes) * 100;
        return (
          <div key={c.id} className="ff-row">
            <span className="ff-name">{c.name}</span>
            <div className="ff-bar-bg">
              <div className="ff-bar" style={{ width: `${width}%` }}></div>
            </div>
            <span className="ff-votes">{votes}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FanFavoriteBar;
