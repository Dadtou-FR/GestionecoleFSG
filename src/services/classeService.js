import axios from 'axios';

const API_URL = 'http://localhost:8080/api/classes';

export const getClasses = () => axios.get(API_URL);
export const getClasse = (id) => axios.get(`${API_URL}/${id}`);
export const createClasse = (classe) => axios.post(API_URL, classe);
export const updateClasse = (id, classe) => axios.put(`${API_URL}/${id}`, classe);
export const deleteClasse = (id) => axios.delete(`${API_URL}/${id}`); 