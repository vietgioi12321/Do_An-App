import * as FileSystem from 'expo-file-system/legacy';
import * as Battery from 'expo-battery';
import * as Network from '@react-native-community/netinfo';
// Placeholder imports for CPU/GPU – you may replace with actual native modules
// import { getCpuInfo, getGpuInfo } from './nativeHardware';

export async function logErrorInfo(error: any, componentStack: any) {
  try {
    // Gather hardware info (fallback values if unavailable)
    const batteryLevel = await Battery.getBatteryLevelAsync();
    const batteryState = await Battery.getBatteryStateAsync();
    const networkInfo = await Network.fetch();
    // CPU/GPU mock values – replace with real sensors if you have them
    const cpuInfo = { usage: 'N/A', temperature: 'N/A' };
    const gpuInfo = { temperature: 'N/A' };

    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error?.toString(),
      componentStack,
      cpu: cpuInfo,
      gpu: gpuInfo,
      ram: { usage: 'N/A' }, // you can fill with actual RAM usage if available
      pin: { level: batteryLevel, state: batteryState },
      network: networkInfo,
    };

    const logString = JSON.stringify(logEntry) + '\n';
    const logUri = FileSystem.documentDirectory + 'error_logs.txt';
    // Read existing content if file exists
    let existing = '';
    try {
      existing = await FileSystem.readAsStringAsync(logUri);
    } catch (e) {
      // File may not exist yet; ignore
    }
    await FileSystem.writeAsStringAsync(logUri, existing + logString);
    console.log('Error info logged to', logUri);
  } catch (e) {
    console.warn('Failed to log error info', e);
  }
}
