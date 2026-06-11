import React, { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import MemoryChart from '@/assets/icons/ChartIcon';

import MonitorCard from '../MonitorCard';

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

      const total = romResult?.totalGB ?? 0
      const used = romResult?.usedGB ?? 0

      setRomTotal(total);
      setRomUsed(used);

      if (total > 0) {
        const usePercent = Math.round((used / total) * 100);
        setPieRomUse(usePercent);
        setPieRomFree(100 - usePercent);
      }
    };
    handleCheckRom();
    const interval = setInterval(handleCheckRom, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
      <MonitorCard nativeID='romMonitoring' 
                  title='ROM' 
                  value1={`${romTotal} GB`} 
                  value2={`${romUsed} GB`}
                  ChartElement={
                    <MemoryChart size={40} pie1={pieRomUse} pie2={pieRomFree} />
                  }
        >
        </MonitorCard>
  );
}
