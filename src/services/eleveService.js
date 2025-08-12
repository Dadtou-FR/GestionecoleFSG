import axios from 'axios';

const API_URL = 'http://localhost:8080/api/eleves';

export const getEleves = () => axios.get(API_URL);
export const getEleve = (id) => axios.get(`${API_URL}/${id}`);
export const createEleve = (eleve) => axios.post(API_URL, eleve);
export const updateEleve = (id, eleve) => axios.put(`${API_URL}/${id}`, eleve);
export const deleteEleve = (id) => axios.delete(`${API_URL}/${id}`); 