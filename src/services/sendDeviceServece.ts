import { API_ROUTES } from '../config/config';
import { DeviceSystem } from '../utils/deviceSystem';
import { logErrorInfo } from '../utils/logError';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { collectHardwareInfo } from '../utils/hardwareInfo';

/**
 * Thu thập cấu hình chi tiết của thiết bị và gửi lên API:
 * http://localhost:5000/api/device/add_device
 */
export async function sendDeviceSpecs() {
  try {
    const payload = await DeviceSystem();

    console.log("Đang gửi cấu hình thiết bị lên Server:", API_ROUTES.addDevice);
    console.log("Dữ liệu gửi đi:", JSON.stringify(payload, null, 2));

    const response = await fetch(API_ROUTES.addDevice, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log("Kết quả gửi cấu hình thiết bị:", response.status);
    const respText = await response.text();
    console.log("Phản hồi từ Server:", respText);
    return response.ok;
  } catch (error) {
    console.error("Lỗi khi gửi cấu hình thiết bị lên Server:", error);
    return false;
  }
}

/**
 * Gửi báo cáo lỗi hệ thống kèm thông số thiết bị chi tiết lên API theo đúng cấu trúc yêu cầu:
 * http://localhost:5000/api/logentry/add_logentry
 */
export async function sendAppError(
  name: string,
  errorMessage: string,
  stackTrace: string = '',
  logLevel: string = 'ERROR'
) {
  try {
    const deviceUniqueId = await DeviceInfo.getUniqueId();
    const hardwareInfo = await collectHardwareInfo();

    const payload = {
      name,
      logLevel,
      errorMessage,
      stackTrace,
      userId: 1,
      deviceUniqueId: deviceUniqueId,
      hardwareInfo,
      timestamp: new Date().toISOString()
    };

    console.log(`Đang gửi báo cáo lỗi (${name}) lên Server:`, API_ROUTES.addError);
    console.log("Dữ liệu lỗi gửi đi:", JSON.stringify(payload, null, 2));

    const response = await fetch(API_ROUTES.addError, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log("Kết quả gửi lỗi:", response.status);
    const respText = await response.text();
    console.log("Phản hồi báo lỗi từ Server:", respText);
    return response.ok;
  } catch (error) {
    console.error("Lỗi khi gửi báo cáo lỗi lên Server:", error);
    return false;
  }
}

/**
 * Hàm gửi lỗi crash ứng dụng (ErrorBoundary) theo đúng cấu trúc yêu cầu
 */
export async function sendErrorToServer(error: any, info: any) {
  try {
    const deviceUniqueId = await DeviceInfo.getUniqueId();
    const hardwareInfo = await collectHardwareInfo();

    const payload = {
      name: error?.name || "AppCrashError",
      logLevel: "ERROR",
      errorMessage: error?.message || error?.toString() || "Unknown App Crash",
      stackTrace: info?.componentStack || "",
      deviceUniqueId,
      hardwareInfo,
      timestamp: {
        $date: new Date().toISOString()
      }
    };

    console.log("Đang gửi bug crash ứng dụng lên Server qua địa chỉ:", API_ROUTES.addError);
    
    const response = await fetch(API_ROUTES.addError, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log("Trạng thái phản hồi lỗi từ Server:", response.status);
  } catch (err) {
    console.error("Lỗi khi gửi crash log:", err);
  }

  // Log nội bộ tại local
  logErrorInfo(error, info);
}

// Send hardware info on app launch
export async function sendHardwareInfoOnLaunch() {
  try {
    const hardwareInfo = await import('../utils/hardwareInfo').then(m => m.collectHardwareInfo());
    const response = await fetch(API_ROUTES.addError, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hardware: hardwareInfo,
        hardwareInfo: hardwareInfo,
        timestamp: {
          $date: new Date().toISOString()
        },
      }),
    });
    console.log('Hardware info POST response status:', response.status);
    const respText = await response.text();
    console.log('Server response body:', respText);
    if (!response.ok) {
      console.warn('Server responded with error:', respText);
    }
  } catch (err) {
    console.error('Failed to send hardware info:', err);
  }
}