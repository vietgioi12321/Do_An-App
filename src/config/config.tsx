import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';

export default Sentry.init({
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Replace with real DSN
    enableNative: true,
    // You can add other config options here
  });


// 1. Định nghĩa địa chỉ gốc của Server tùy theo thiết bị
export const BASE_URL = Platform.OS === 'android' 
  ? 'http://192.168.1.9:8000' 
  : 'http://localhost:8000';

// 2. Gom tất cả các API (Endpoints) về một mối
export const API_ROUTES = {
  testHello: `${BASE_URL}/test-hello`,
  login: `${BASE_URL}/api/login`,
  register: `${BASE_URL}/api/register`,
  getRealtimeData: `${BASE_URL}/api/data/realtime`,
  updateProfile: `${BASE_URL}/api/user/update`,
};