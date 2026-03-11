import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const resumeAPI = {
    create: (data) => axios.post(`${API_BASE}/resume/create`, data),
    getById: (id) => axios.get(`${API_BASE}/resume/${id}`),
    update: (id, data) => axios.put(`${API_BASE}/resume/update/${id}`, data),
    getAll: () => axios.get(`${API_BASE}/resume`),
    delete: (id) => axios.delete(`${API_BASE}/resume/${id}`),
};

export const aiAPI = {
    generateSummary: (data) => axios.post(`${API_BASE}/ai/generate-summary`, data),
    improveExperience: (data) => axios.post(`${API_BASE}/ai/improve-experience`, data),
    suggestSkills: (data) => axios.post(`${API_BASE}/ai/suggest-skills`, data),
};
