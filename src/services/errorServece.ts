import { SERVER_URL } from '../config/config.js';
import { logErrorInfo } from '../utils/logError';


export async function sendErrorToServer(error: any, info: any) {
    // Gather hardware and environment info
    const hardwareInfo = await import('../utils/hardwareInfo').then(m => m.collectHardwareInfo());
  
    console.log("Đang gửi bug lên Server qua địa chỉ:", SERVER_URL);
    // Simple fire-and-forget POST; include hardware info and timestamp
    fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.toString(),
        info,
        hardware: hardwareInfo,
        timestamp: new Date().toISOString(),
      }),
    }).then((response) => {
      console.log("Trạng thái phản hồi từ Server:", response.status);
    }).catch(() => {});
    // Log hardware info locally (optional)
    logErrorInfo(error, info);
  }

    // Send hardware info on app launch
export async function sendHardwareInfoOnLaunch() {
    try {
        const hardwareInfo = await import('../utils/hardwareInfo').then(m => m.collectHardwareInfo());
        const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hardware: hardwareInfo,
            hardwareInfo: hardwareInfo,
            timestamp: new Date().toISOString(),
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
        // Alert removed to avoid warning when Activity not attached
        // Optionally, you could show a toast or log only
    }
}