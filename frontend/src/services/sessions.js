import api from './api';

export const getUpcomingSessions = () => api.get('/sessions/upcoming').then(res => res.data);
export const joinSession = (sessionId, role) => api.post('/sessions/join', { sessionId, role }).then(res => res.data);
export const getLiveKitToken = (sessionId) => api.get(`/sessions/${sessionId}/live-token`).then(res => res.data);
export const submitGasCard = (sessionId, targetId, percentage) => api.post(`/sessions/${sessionId}/gas-card`, { target_id: targetId, percentage }).then(res => res.data);
export const disqualify = (sessionId, contestantId, reason) => api.post(`/sessions/${sessionId}/disqualify`, { contestant_id: contestantId, reason }).then(res => res.data);
