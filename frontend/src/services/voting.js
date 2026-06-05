import api from './api';

export const submitVote = (sessionId, targetId, category, weight = 1) =>
  api.post('/voting/vote', { sessionId, targetId, category, weight }).then(res => res.data);
export const getVoteTallies = (sessionId, category) =>
  api.get(`/voting/tallies/${sessionId}`, { params: { category } }).then(res => res.data);
export const predictWinner = (sessionId, predictedWinnerId) =>
  api.post('/voting/predict', { sessionId, predictedWinnerId }).then(res => res.data);
