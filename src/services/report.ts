import api from './api';

export interface Report {
  id: number;
  latitude: number;
  longitude: number;
  comment?: string;
  createdAt?: string;
}

export async function getReports(token: string): Promise<Report[]> {
  const response = await api.get('/reports', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
