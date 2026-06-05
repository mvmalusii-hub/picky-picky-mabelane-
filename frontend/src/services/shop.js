import api from './api';

export const getShopItems = () => api.get('/shop/items').then(res => res.data);
export const buyItem = (itemType, sessionId, targetContestantId) =>
  api.post('/shop/buy', { itemType, sessionId, targetContestantId }).then(res => res.data);
export const useItem = (purchaseId) => api.post(`/shop/use/${purchaseId}`).then(res => res.data);
