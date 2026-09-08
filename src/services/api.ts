import axios from 'axios';
import { ApiResponse, NotificationRoute, PushNotificationRequest } from '../types';

export const DEFAULT_API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost/rs_keuanganGL_V2/api/hr' 
    : 'https://daytrack.apbagroup.com/api/hr');

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('API_BASE_URL') || DEFAULT_API_BASE_URL;
  }
  return DEFAULT_API_BASE_URL;
};

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('API_AUTH_TOKEN') || '';
  }
  return '';
};

export const createApiClient = () => {
  const client = axios.create({
    baseURL: getBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

// API Functions
export const fetchNotificationRoutes = async (search = ''): Promise<NotificationRoute[]> => {
  const api = createApiClient();
  try {
    const response = await api.post<ApiResponse<NotificationRoute[]>>('/notification_route/list', {
      search,
      limit: 100,
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error: any) {
    console.warn('API fetch routes error, checking local fallback:', error);
    throw error;
  }
};

export const saveNotificationRoute = async (routeData: NotificationRoute): Promise<NotificationRoute> => {
  const api = createApiClient();
  const response = await api.post<ApiResponse<NotificationRoute>>('/notification_route/store', {
    event_code: routeData.event_code,
    description: routeData.description,
    web_target: routeData.web_target,
    mobile_target: routeData.mobile_target,
    target_roles_id: routeData.target_roles_id,
  });
  return response.data.data;
};

export const deleteNotificationRoute = async (event_code: string): Promise<boolean> => {
  const api = createApiClient();
  const response = await api.post<ApiResponse>('/notification_route/delete', {
    event_code,
  });
  return response.data.statusCode === '00';
};

export const sendPushNotification = async (payload: PushNotificationRequest): Promise<any> => {
  const api = createApiClient();
  const response = await api.post<ApiResponse>('/notification/push', payload);
  return response.data;
};

export const registerFCMDeviceToken = async (fcm_token: string): Promise<any> => {
  const api = createApiClient();
  const response = await api.post<ApiResponse>('/notification/register_device_token', {
    fcm_token,
    device_type: 'web',
  });
  return response.data;
};

export const fetchInboxNotifications = async (): Promise<any[]> => {
  const api = createApiClient();
  const response = await api.post<ApiResponse<{ notifications: any[] }>>('/notification_list', {
    limit: 20,
  });
  return response.data?.data?.notifications || [];
};
