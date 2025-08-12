import axios from 'axios';

const API_URL = 'http://localhost:8080/api/emargements';

export const getEmargements = () => axios.get(API_URL);
export const getEmargementById = (id) => axios.get(`${API_URL}/${id}`);
export const createEmargement = (emargement) => axios.post(API_URL, emargement);
export const updateEmargement = (id, emargement) => axios.put(`${API_URL}/${id}`, emargement);
export const deleteEmargement = (id) => axios.delete(`${API_URL}/${id}`); 