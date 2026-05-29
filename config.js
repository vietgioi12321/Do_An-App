import { Platform } from 'react-native';

// Định nghĩa SERVER_URL động: Dùng 10.0.2.2 cho Android Emulator và localhost cho iOS/Simulators
global.SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/logs' : 'http://localhost:3000/api/logs';