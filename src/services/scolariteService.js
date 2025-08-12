import axios from 'axios';

const API_URL = 'http://localhost:8080/api/scolarites';

export const getScolarites = () => axios.get(API_URL);
export const getScolariteById = (id) => axios.get(`${API_URL}/${id}`);
export const createScolarite = (scolarite) => axios.post(API_URL, scolarite);
export const updateScolarite = (id, scolarite) => axios.put(`${API_URL}/${id}`, scolarite);
export const deleteScolarite = (id) => axios.delete(`${API_URL}/${id}`); 