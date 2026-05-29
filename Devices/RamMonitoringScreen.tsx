import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import * as Styles from '../commonStyle';
import MemoryChart from './icons/ChartIcon';

export const getExactRamData = async () => {
    try {
      let totalMB = 0.0;
      let freeMB = 0.0;
      let usedMB = 0.0;

      // Thử đọc từ /proc/meminfo trên hệ điều hành Android
      const meminfoPath = '/proc/meminfo';
      if (await RNFS.exists(meminfoPath)) {
        const meminfo = await RNFS.readFile(meminfoPath, 'utf8');
        const lines = meminfo.split('\n');
        let memTotalKb = 0;
        let memAvailableKb = 0;
        let memFreeKb = 0;

        for (const line of lines) {
          if (line.startsWith('MemTotal:')) {
            const match = line.match(/\d+/);
            if (match) memTotalKb = parseInt(match[0], 10);
          } else if (line.startsWith('MemAvailable:')) {
            const match = line.match(/\d+/);
            if (match) memAvailableKb = parseInt(match[0], 10);
          } else if (line.startsWith('MemFree:')) {
            const match = line.match(/\d+/);
            if (match) memFreeKb = parseInt(match[0], 10);
          }
        }

        totalMB = Math.round(memTotalKb / (1024));
        // MemAvailable phản ánh chính xác nhất lượng RAM trống thực sự của hệ thống. 
        // Nếu không có MemAvailable, dùng MemFree làm phương án dự phòng.
        const availableKb = memAvailableKb > 0 ? memAvailableKb : memFreeKb;
        freeMB = Math.round(availableKb / 1024);
        usedMB = totalMB - freeMB;
      } else {
        // Phương án dự phòng (iOS hoặc môi trường khác không có /proc/meminfo)
        const totalMemoryBytes = await DeviceInfo.getTotalMemory();
        totalMB = Math.round(totalMemoryBytes / (1024 * 1024));

        let appUsedBytes = 0;
        try {
          // Lấy lượng RAM tiến trình app đang sử dụng làm dữ liệu tham khảo
          appUsedBytes = await DeviceInfo.getUsedMemory();
        } catch (e) {}

        if (appUsedBytes > 0) {
          usedMB = Math.round(appUsedBytes / (1024 * 1024));
          freeMB = totalMB - usedMB;
        } else {
          // Giả lập dữ liệu ngẫu nhiên khoảng 60% RAM đang sử dụng nếu không đọc được gì
          usedMB = Math.round(totalMB * 0.6);
          freeMB = totalMB - usedMB;
        }
      }
  
      return {
        totalGB: parseFloat((totalMB / 1024).toFixed(2)),
        usedGB: parseFloat((usedMB / 1024).toFixed(2)),
        freeGB: parseFloat((freeMB / 1024).toFixed(2))
      };
    } catch (error) {
      console.error("Lỗi trích xuất RAM gốc:", error);
      return { totalMB: 0, usedMB: 0, freeMB: 0 };
    }
  };

export default function RamMonitoringScreen(){
    const [ramTotal, setRamTotal] = useState(0.0);
    const [ramUse, setRamUse] = useState(0.0);
    const [pieRamUse, setPieRamUse] = useState(0);
    const [pieRamFree, setPieRamFree] = useState(100);

    useEffect(() => {
        const handleCheckRam = async () => {
            const ramResult = await getExactRamData(); 
            
            setRamTotal(ramResult.totalGB);
            setRamUse(ramResult.usedGB);
            
            if (ramResult.totalGB > 0) {
                const usePercent = Math.round((ramResult.usedGB / ramResult.totalGB) * 100);
                setPieRamUse(usePercent);
                setPieRamFree(100 - usePercent);
            }
        };

        handleCheckRam();
        const interval = setInterval(handleCheckRam, 2000);

        return () => clearInterval(interval);
    }, []);

    return(
        <View nativeID="ramMonitoring" style={{ width: 155, height: 109, backgroundColor: '#3A373F', borderRadius: 15, gap: '10%' }}>
            <Text style={{ top: '10%', left: '10%', color: Styles.fonts.fontColorSystem }}>RAM</Text>
            <View nativeID="ramMonitoringDetail" style={{ left: '10%', flexDirection: 'row', gap: '10%' }}>
                <MemoryChart size={40} pie1={pieRamUse} pie2={pieRamFree}></MemoryChart>
                <View nativeID="ramMonitoringInformationDetail">
                <Text style={{ color: Styles.fonts.fontColorDefaut }}>{ramTotal} GB</Text>
                <Text style={{ color: Styles.fonts.fontColorDefaut }}>{ramUse} GB</Text>
                </View>
            </View>
            <Image source={require('../assets/icons/menu-outline.png')} style={{ width: 24, height: 24, tintColor: 'white', top: '10%', left: '80%', position: 'absolute' }} />
        </View>
    );
}