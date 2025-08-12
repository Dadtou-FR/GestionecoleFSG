import axios from 'axios';

const API_URL = 'http://localhost:8080/api/emploisdutemps';

export const getEmploisDuTemps = () => axios.get(API_URL);
export const getEmploiDuTempsById = (id) => axios.get(`${API_URL}/${id}`);
export const createEmploiDuTemps = (emploiDuTemps) => axios.post(API_URL, emploiDuTemps);
export const updateEmploiDuTemps = (id, emploiDuTemps) => axios.put(`${API_URL}/${id}`, emploiDuTemps);
export const deleteEmploiDuTemps = (id) => axios.delete(`${API_URL}/${id}`); 