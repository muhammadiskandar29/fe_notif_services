export interface NotificationRoute {
  id?: number;
  event_code: string;
  description: string;
  web_target: string;
  mobile_target: string;
  target_roles_id?: string | number[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationPayload {
  module?: string;
  reference_id?: number | string | null;
  [key: string]: any;
}

export interface PushNotificationRequest {
  event_code: string;
  title: string;
  message: string;
  user_id?: number;
  user_ids?: number[];
  employee_id?: number;
  type?: 'info' | 'warning' | 'approval' | 'success' | 'danger';
  reference_id?: number | string;
  payload?: Record<string, any>;
  channels?: ('database' | 'fcm' | 'email')[];
  provider_id?: number;
  branch_id?: number;
}

export interface InAppNotification {
  id: number;
  notification_id: number;
  name: string;
  title?: string;
  message: string;
  payload: NotificationPayload;
  mobile_target?: string | null;
  web_target?: string | null;
  is_read: boolean;
  status_id: number;
  created_at: string;
}

export interface ApiResponse<T = any> {
  statusCode: string;
  statusMsg: string;
  totalRow: number;
  data: T;
}
