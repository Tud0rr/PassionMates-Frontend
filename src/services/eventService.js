import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json', // îi spunem backend-ului că trimitem JSON
  },
});

// Exportăm funcții specifice pentru fiecare operație cu evenimente
// Fiecare funcție returnează un Promise (operație asincronă)

// GET /api/events — obține toate evenimentele
export const getAllEvents = () => api.get('/events');

// GET /api/events/:id — obține un eveniment după ID
export const getEventById = (id) => api.get(`/events/${id}`);

// POST /api/events — creează un eveniment nou (îl vom folosi mai târziu)
export const createEvent = (eventData) => api.post('/events', eventData);

// Vom adăuga join, delete etc. pe măsură ce avansăm