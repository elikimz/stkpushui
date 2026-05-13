import axios from 'axios';
import { STKPushRequest, STKPushResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://pesafluxapi-a5dfaaa8h7ebhrfv.southafricanorth-01.azurewebsites.net';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initiateSTKPush = async (data: STKPushRequest): Promise<STKPushResponse> => {
  const response = await api.post<STKPushResponse>('/api/payments/stk-push', data);
  return response.data;
};

export default api;
