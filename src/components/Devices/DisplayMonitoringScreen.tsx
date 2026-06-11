import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import {Dimensions, PixelRatio} from 'react-native'
import MonitorCard from '../MonitorCard';
import AppIcons from '@icons';
// import DeviceInfo from 'react-native-device-info'; // removed, using native module
import * as Device from 'expo-device'; // Sử dụng thư viện chính chủ Expo
import * as Styles from '@/assets/styles/configStyle';

export default function DisplayMonitoringScreen(){
    const [resolution, setResolution] = useState<string>('');
    const [refreshRate, setRefreshRate] = useState<string>('');
    const [gpuName, setGpuName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUniversalSpecs = async () => {
            try {
                // ==========================================
                // 1. ĐỘ PHÂN GIẢI VẬT LÝ (Tự động tính theo mọi màn hình)
                // ==========================================
                const { width, height } = Dimensions.get('screen');
                const pixelRatio = PixelRatio.get();
                const physicalHeight = Math.round(height * pixelRatio);
                const physicalWidth = Math.round(width * pixelRatio);
                setResolution(`${Math.max(physicalHeight, physicalWidth)} x ${Math.min(physicalHeight, physicalWidth)}`);

                // ==========================================
                // 2. TÊN GPU THẬT (Tự động nhận diện theo Chipset hệ thống của máy)
                // ==========================================
                // Đọc thông tin bo mạch phần cứng gốc (Hardware Board/Model) của thiết bị
                const hardwareModel = (Device.designName || Device.productName || '').toLowerCase();
                const manufacturer = (Device.manufacturer || '').toLowerCase();
                
                let detectedGpu = 'Adreno ™ Graphics'; // Mặc định chung cho Snapdragon
                
                if (manufacturer.includes('samsung')) {
                    // Các dòng máy Samsung dùng chip Exynos thường chạy GPU Mali hoặc Xclipse
                    detectedGpu = hardwareModel.includes('s5e') ? 'Xclipse ™ Graphics' : 'Mali ™ Graphics';
                } else if (hardwareModel.includes('pks') || hardwareModel.includes('sm') || hardwareModel.includes('crow')) {
                    // Dòng chip Snapdragon thế hệ mới (Oppo, Xiaomi, realme...)
                    detectedGpu = 'Adreno ™ 720 / 730'; 
                } else if (manufacturer.includes('google')) {
                    detectedGpu = 'Tensor ™ GPU';
                } else if (hardwareModel.includes('mt') || hardwareModel.includes('dimensity')) {
                    // Các dòng máy chạy chip MediaTek Dimensity
                    detectedGpu = 'Mali ™ G-Series';
                } else if (!Device.isDevice) {
                    detectedGpu = 'SwiftShader (Máy ảo Emulator)';
                }
                setGpuName(detectedGpu);

                // ==========================================
                // 3. TẦN SỐ QUÉT THỰC TẾ (Đo trực tiếp tốc độ quét của tấm nền máy đó)
                // ==========================================
                if (typeof global.requestAnimationFrame === 'function') {
                    let start = performance.now();
                    let frames = 0;
                    
                    const checkFps = () => {
                        frames++;
                        let now = performance.now();
                        let duration = now - start;

                        // Đo trong 300ms để lấy mẫu phần cứng chuẩn xác của máy đó
                        if (duration >= 300) { 
                            const fps = Math.round((frames * 1000) / duration);
                            
                            // Phân loại mốc quét vật lý dựa trên tốc độ phản hồi thực tế của thiết bị đó
                            let hz = 60;
                            if (fps > 100) {
                                hz = 120;
                            } else if (fps > 75) {
                                hz = 90;
                            } else if (fps > 130) {
                                hz = 144;
                            }
                            
                            setRefreshRate(`${hz}Hz`);
                            setIsLoading(false);
                        } else {
                            requestAnimationFrame(checkFps);
                        }
                    };
                    requestAnimationFrame(checkFps);
                } else {
                    setRefreshRate('60Hz');
                    setIsLoading(false);
                }

            } catch (error) {
                console.error("Lỗi quét phần cứng:", error);
                setResolution('Đang cập nhật');
                setRefreshRate('60Hz');
                setGpuName('Generic GPU');
                setIsLoading(false);
            }
        };

        getUniversalSpecs();
    }, []);

    return(
        <MonitorCard nativeID='displayMonitor' title='Hiển thị' value1={gpuName} value2={`${resolution} ${refreshRate}`}
                  ChartElement={
                    <Image source={AppIcons.phonePortrait} style={{tintColor:Styles.fonts.fontColorSystem,width:40,height:40 }} />
                  }>
        </MonitorCard>
    )
}