const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://deploy-f-latest.onrender.com/api";

export const API = {
  BASE: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/login`,
  EVENTS: `${API_BASE_URL}/events`,
  EVENTS_NEAREST: `${API_BASE_URL}/events/nearest`,
  EVENTS_IMAGES: (id: number) => `${API_BASE_URL}/events/images/${id}`,
  TEAM: `${API_BASE_URL}/team`,
  TEAM_IMAGES: (id: number) => `${API_BASE_URL}/team/images/${id}`,
  FACULTY: `${API_BASE_URL}/faculty`,
  FACULTY_IMAGES: (id: number) => `${API_BASE_URL}/faculty/images/${id}`,
  REGISTRATIONS: `${API_BASE_URL}/registrations`,
};
