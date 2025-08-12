import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cours';

export const getCours = () => axios.get(API_URL);
export const getCoursByClasse = (classe) => axios.get(`${API_URL}/classe/${classe}`);
export const getCoursById = (id) => axios.get(`${API_URL}/${id}`);
export const createCours = (cours) => axios.post(API_URL, cours);
export const updateCours = (id, cours) => axios.put(`${API_URL}/${id}`, cours);
export const deleteCours = (id) => axios.delete(`${API_URL}/${id}`); 