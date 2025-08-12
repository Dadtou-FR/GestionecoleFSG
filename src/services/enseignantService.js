import axios from 'axios';

const API_URL = 'http://localhost:8080/api/enseignants';

export const getEnseignants = () => axios.get(API_URL);
export const getEnseignant = (id) => axios.get(`${API_URL}/${id}`);
export const createEnseignant = (enseignant) => axios.post(API_URL, enseignant);
export const updateEnseignant = (id, enseignant) => axios.put(`${API_URL}/${id}`, enseignant);
export const deleteEnseignant = (id) => axios.delete(`${API_URL}/${id}`); 