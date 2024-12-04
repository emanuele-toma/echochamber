import { CONFIG } from '@/config';
import axios from 'axios';

export const internalApi = axios.create({
  baseURL: CONFIG.BACKEND_URL,
});

export const api = axios.create({
  baseURL: CONFIG.PUBLIC_BACKEND_URL,
});
