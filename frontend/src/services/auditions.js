import api from './api';

export const submitAudition = (data) => api.post('/auditions', data).then(res => res.data);
export const getAuditions = () => api.get('/auditions').then(res => res.data);
export const updateAuditionStatus = (id, status, adminNotes) => api.put(`/auditions/${id}`, { status, admin_notes: adminNotes }).then(res => res.data);
