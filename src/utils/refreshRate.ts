import { NativeModules } from 'react-native';

const { RefreshRateModule } = NativeModules;
// Debug: show what modules are available
console.log('NativeModules map keys:', Object.keys(NativeModules));
// If the native module is not present, warn and fallback to DeviceInfo (if available)
const hasNative = !!RefreshRateModule && typeof RefreshRateModule.getRefreshRate === 'function';
if (!hasNative) {
  console.warn('RefreshRateModule not found – will fallback to DeviceInfo if possible');
}

console.log('NativeModules available:', NativeModules);

/**
 * Calls the native RefreshRateModule to obtain the device's current display refresh rate.
 * Returns a formatted string like "60Hz".
 * If the native call fails, it resolves to "unknown".
 */
export async function getRefreshRate(): Promise<string> {
  if (hasNative) {
    try {
      const rate: number = await RefreshRateModule.getRefreshRate();
      return `${rate}Hz`;
    } catch (e) {
      console.warn('Refresh‑rate native call failed:', e);
      return 'unknown';
    }
  } else {
    // Optional fallback using react-native-device-info if it ever implements getRefreshRate
    try {
      const DeviceInfo = require('react-native-device-info').default;
      if (DeviceInfo && typeof DeviceInfo.getRefreshRate === 'function') {
        const rate = await DeviceInfo.getRefreshRate();
        return `${Math.round(rate)}Hz`;
      }
    } catch (_) {}
    return 'unknown';
  }
}

