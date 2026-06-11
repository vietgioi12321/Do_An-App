import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as Device from 'expo-device';
import RNFS from 'react-native-fs';

/**
 * Đọc số lõi (cores) CPU thực tế từ file hệ thống /proc/cpuinfo trên Android.
 * Phương án dự phòng là getNumberOfProcessors hoặc mặc định là 8 nhân.
 */
async function getCpuCores(): Promise<number> {
  try {
    if (Platform.OS === 'android') {
      const cpuinfoPath = '/proc/cpuinfo';
      if (await RNFS.exists(cpuinfoPath)) {
        const cpuinfo = await RNFS.readFile(cpuinfoPath, 'utf8');
        const lines = cpuinfo.split('\n');
        // Đếm số dòng bắt đầu bằng chữ "processor" (mỗi lõi CPU có 1 dòng tương ứng)
        const processors = lines.filter(line => 
          line.toLowerCase().trim().startsWith('processor')
        );
        if (processors.length > 0) {
          return processors.length;
        }
      }
    }
  } catch (error) {
    console.log("Lỗi khi đọc số lõi CPU từ /proc/cpuinfo:", error);
  }

  // Phương án dự phòng 1: Gọi hàm từ DeviceInfo (nếu thư viện có hỗ trợ ở bản build này)
  try {
    const nativeCores = await (DeviceInfo as any).getNumberOfProcessors?.();
    if (nativeCores && nativeCores > 0) {
      return nativeCores;
    }
  } catch (e) {}

  // Phương án dự phòng 2: Hầu hết điện thoại Android tầm trung/cao cấp hiện nay đều có 8 nhân
  return 8; 
}

export async function DeviceSystem() {
    // 5. Thiết bị GPU (Dựa trên logic tự động nhận diện từ hãng sản xuất)
    const hardwareModel = (Device.designName || Device.productName || '').toLowerCase();
    const manufacturer = (Device.manufacturer || '').toLowerCase();
    let gpuDevice = 'Adreno ™ Graphics';
    if (manufacturer.includes('samsung')) {
      gpuDevice = hardwareModel.includes('s5e') ? 'Xclipse ™ Graphics' : 'Mali ™ Graphics';
    } else if (hardwareModel.includes('pks') || hardwareModel.includes('sm') || hardwareModel.includes('crow')) {
      gpuDevice = 'Adreno ™ 720 / 730';
    } else if (manufacturer.includes('google')) {
      gpuDevice = 'Tensor ™ GPU';
    } else if (hardwareModel.includes('mt') || hardwareModel.includes('dimensity')) {
      gpuDevice = 'Mali ™ G-Series';
    } else if (!Device.isDevice) {
      gpuDevice = 'SwiftShader (Máy ảo Emulator)';
    }

    // 7. RAM (GB)
    const totalRAMBytes = await DeviceInfo.getTotalMemory();
    // 8. ROM (GB)
    const totalDiskBytes = await DeviceInfo.getTotalDiskCapacity();

    const device = {
        brand: await DeviceInfo.getBrand(), //hãng
        model: await DeviceInfo.getModel(), //dòng máy
        osVersion: `${Platform.OS} ${await DeviceInfo.getSystemVersion()}`, //thiết bị Android hoặc IOS
    };

    // Lấy số lõi CPU thông qua hàm bổ trợ mới
    const cpuCoresCount = await getCpuCores();

    // ----- CPU / Device -------------------------------------------------
    const cpuInfo = {
        device: Platform.OS === 'android' ? await DeviceInfo.getHardware() : 'Apple CPU',
        cores : cpuCoresCount,
    };

    // ----- Memory (RAM & ROM) ---------------------------------------
    const memoryInfo = {
        ramGB: parseFloat((totalRAMBytes / (1024 * 1024 * 1024)).toFixed(2)),
        romGB: parseFloat((totalDiskBytes / (1024 * 1024 * 1024)).toFixed(2)),
    };

    // Địa chỉ MAC (Bị giới hạn bảo mật bởi Android 10+ và iOS)
    let macAddress = '';
    try {
        const realMac = await DeviceInfo.getMacAddress();
        if (realMac && realMac !== "" && realMac !== "02:00:00:00:00:00") {
            macAddress = realMac;
        }
    } catch (e) {}

    // Nếu hệ điều hành Android 10+ chặn không cho đọc (trả về rỗng hoặc 02:00:00:00:00:00)
    // Ta tự động tạo MAC ảo từ Device Unique ID để đảm bảo gửi lên Server không bị rỗng
    if (!macAddress) {
        const uniqueId = await DeviceInfo.getUniqueId();
        // Lấy 12 ký tự hex của uniqueId và định dạng thành XX:XX:XX:XX:XX:XX
        const hex = uniqueId.replace(/[^a-fA-F0-9]/g, '').padEnd(12, '0').substring(0, 12);
        macAddress = hex.match(/.{1,2}/g)?.join(':').toLowerCase() ?? "02:00:00:00:00:00";
    }

    const network = {
        macAddress: macAddress,
    }

    // ----- GPU (no generic JS API) -----------------------------------
    const gpuInfo = {
        brand: gpuDevice,
        memoryMB: 0,
    };

    return {
        deviceUniqueId: await DeviceInfo.getUniqueId(),
        device : device,
        cpu: cpuInfo,
        gpu: gpuInfo,
        network: network,
        memory: memoryInfo,
        timestamp: new Date().toISOString(),
    };
}
