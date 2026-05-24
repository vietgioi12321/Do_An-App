import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

/**
 * Collect real hardware and environment information.
 * Returns a JSON‑serializable object.
 */
export async function collectHardwareInfo() {
  // ----- CPU / Device -------------------------------------------------
  const cpuInfo = {
    brand: await DeviceInfo.getBrand(),
    model: await DeviceInfo.getModel(),
    // Android only – number of logical processors (fallback to 0)
    cores: (await (DeviceInfo as any).getNumberOfProcessors?.()) ?? 0,
  };

  // ----- Battery ----------------------------------------------------
  const batteryInfo = {
    // getBatteryLevel returns a float between 0‑1; convert to percent
    level: Math.round((await DeviceInfo.getBatteryLevel()) * 100),
    isCharging: await DeviceInfo.isBatteryCharging(),
  };

  // ----- Network ----------------------------------------------------
  const netState = await NetInfo.fetch();
  const networkInfo = {
    type: netState.type,
    isConnected: netState.isConnected,
    ipAddress: netState.details?.ipAddress ?? '0.0.0.0',
  };

  // ----- GPU (no generic JS API) -----------------------------------
  // Keep placeholder or implement a native bridge later.
  const gpuInfo = {
    brand: 'Unknown GPU',
    memoryMB: 0,
  };

  // ----- Platform ---------------------------------------------------
  const platform = Platform.OS; // "android" | "ios" | "web"

  return {
    cpu: cpuInfo,
    gpu: gpuInfo,
    battery: batteryInfo,
    network: networkInfo,
    platform,
    timestamp: new Date().toISOString(),
  };
}
