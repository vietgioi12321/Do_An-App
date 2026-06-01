import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';

export default Sentry.init({
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Replace with real DSN
    enableNative: true,
    // You can add other config options here
  });


export const SERVER_URL = Platform.OS === 'android' ? 'http://192.168.1.9:8000/test-hello' : 'http://localhost:8000/test-hello';