import React from "react";
import {View,Text,Button,Image} from 'react-native'
import * as Styles from '../commonStyle';


import BatteryScreen from '../Devices/BatteryScreen';
import CpuMonitoringScreen from '../Devices/CpuMonitoringScreen';
import NetworkMonitoringScreen from '../Devices/NetworkMonitoringScreen';
import AppCounterScreen from '../Devices/AppCounterScreen';
import DisplayMonitoringScreen from '../Devices/DisplayMonitoringScreen';
import RamMonitoringScreen from '../Devices/RamMonitoringScreen';
import RomMonitoringScreen from '../Devices/RomMonitoringScreen';

import { Platform } from 'react-native';
import { logErrorInfo } from '../utils/logError';
// Định nghĩa SERVER_URL động: Dùng 10.0.2.2 cho Android Emulator và localhost cho iOS/Simulators
const SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/logs' : 'http://localhost:3000/api/logs';

async function sendErrorToServer(error: any, info: any) {
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
  async function sendHardwareInfoOnLaunch() {
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

export default function ControlPanelSreen(){
    return(
        <View nativeID="full-screen" style={{ flexDirection: 'column', gap: 10, backgroundColor: '#2F2E33', flex: 1 }}>
            <CpuMonitoringScreen />
            <View nativeID="System" style={{ gap: '3%', width: '93%', flexDirection: 'row', flexWrap: 'wrap', overflow: 'scroll' }}>
              <BatteryScreen />
              <NetworkMonitoringScreen />
              <AppCounterScreen></AppCounterScreen>
              <DisplayMonitoringScreen></DisplayMonitoringScreen>
              <RamMonitoringScreen></RamMonitoringScreen>
              <RomMonitoringScreen></RomMonitoringScreen>
            </View>

          <View style={{ left: '5%', height: 81, width: 120, backgroundColor: '#3A373F', borderTopStartRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../assets/icons/checkmark-outline.png')} style={{ width: 20, height: 20, tintColor: '#3DE324' }} />
            <Text style={{ color: Styles.fonts.fontColorDefaut }}>Kiểm tra</Text>
          </View>
              <Button title="Test RAM overflow" onPress={() => { try { throw new Error('RAM overflow simulated'); } catch (e) { sendErrorToServer(e, { componentStack: 'Button onPress' }); } }} />
              <Button title="Send Hardware Info Now" onPress={async () => {
                            console.log('Manual hardware info send triggered');
                            try {
                              await sendHardwareInfoOnLaunch();
                              console.log('Hardware info sent successfully');
                            } catch (e) {
                              console.error('Failed to send hardware info', e);
                            }
                          }} />
        </View>               
    )     
}

            