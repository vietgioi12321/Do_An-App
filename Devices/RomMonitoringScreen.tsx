import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as Styles from '../commonStyle';
import MemoryChart from './icons/ChartIcon';

/**
 * Retrieves total and free disk storage (ROM) in megabytes.
 */
export const getExactRomData = async () => {
  try {
    const totalBytes = await DeviceInfo.getTotalDiskCapacity();
    const freeBytes = await DeviceInfo.getFreeDiskStorage();
    const totalMB = Math.round(totalBytes / (1024 * 1024));
    const freeMB = Math.round(freeBytes / (1024 * 1024));
    const usedMB = totalMB - freeMB;
    return {  totalGB: parseFloat((totalMB / 1024).toFixed(2)), 
              usedGB : parseFloat((usedMB / 1024).toFixed(2)), 
              freeGB : parseFloat((freeMB / 1024).toFixed(2))};
  } catch (error) {
    console.error('Error fetching ROM info:', error);
    return { totalMB: 0, usedMB: 0, freeMB: 0 };
  }
};

export default function RomMonitoringScreen() {
  const [romTotal, setRomTotal] = useState(0);
  const [romUsed, setRomUsed] = useState(0);
  const [pieRomUse, setPieRomUse] = useState(0);
  const [pieRomFree, setPieRomFree] = useState(100);

  useEffect(() => {
    const handleCheckRom = async () => {
      const romResult = await getExactRomData();
      setRomTotal(romResult.totalGB);
      setRomUsed(romResult.usedGB);
      if (romResult.totalGB > 0) {
        const usePercent = Math.round((romResult.usedGB / romResult.totalGB) * 100);
        setPieRomUse(usePercent);
        setPieRomFree(100 - usePercent);
      }
    };
    handleCheckRom();
    const interval = setInterval(handleCheckRom, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View nativeID="romMonitoring" style={{ width: 155, height: 109, backgroundColor: '#3A373F', borderRadius: 15, gap: '10%' }}>
      <Text style={{ top: '10%', left: '10%', color: Styles.fonts.fontColorSystem }}>ROM</Text>
      <View nativeID="romMonitoringDetail" style={{ left: '10%', flexDirection: 'row', gap: '10%' }}>
        <MemoryChart size={40} pie1={pieRomUse} pie2={pieRomFree} />
        <View nativeID="romMonitoringInformationDetail">
          <Text style={{ color: Styles.fonts.fontColorDefaut }}>{romTotal} GB</Text>
          <Text style={{ color: Styles.fonts.fontColorDefaut }}>{romUsed} GB</Text>
        </View>
      </View>
      <Image source={require('../assets/icons/menu-outline.png')} style={{ width: 24, height: 24, tintColor: 'white', top: '10%', left: '80%', position: 'absolute' }} />
    </View>
  );
}

const styles = StyleSheet.create({});
