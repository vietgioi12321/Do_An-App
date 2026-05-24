import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { View, Text, Image, ScrollView, StyleSheet, Button } from 'react-native';
import * as Styles from './commonStyle';
import BatteryScreen from './Devices/BatteryScreen';
import CpuMonitoringScreen from './Devices/CpuMonitoringScreen';
import NetworkMonitoringScreen from './Devices/NetworkMonitoringScreen';
import AppCounterScreen from './Devices/AppCounterScreen';
import DisplayMonitoringScreen from './Devices/DisplayMonitoringScreen';

import * as Sentry from '@sentry/react-native';
import { ErrorBoundary } from '@sentry/react-native';
import { logErrorInfo } from './utils/logError';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Replace with real DSN
  enableNative: true,
  // You can add other config options here
});

import { Platform } from 'react-native';
import AppCounterSreen from './Devices/AppCounterScreen';

async function sendErrorToServer(error: any, info: any) {
  // Gather hardware and environment info
  const hardwareInfo = await import('./utils/hardwareInfo').then(m => m.collectHardwareInfo());

  // Choose correct server address based on environment
  // Choose correct server address based on environment
  const SERVER_URL = Platform.OS === 'android' ? 'http://192.168.1.9:3000/api/logs' : 'http://192.168.217.1:3000/api/logs';

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
    const hardwareInfo = await import('./utils/hardwareInfo').then(m => m.collectHardwareInfo());
    const SERVER_URL = Platform.OS === 'android' ? 'https://abcd1234.ngrok.io/api/logs' : 'http://192.168.217.1:3000/api/logs';
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

export default function App() {
  useEffect(() => {
    sendHardwareInfoOnLaunch();
  }, []);
  return (
    <ErrorBoundary
      onError={(error, componentStack) => {
        sendErrorToServer(error, componentStack);
      }}
    >
      <ScrollView nativeID="full-screen" style={{ flexDirection: 'column', gap: 10, backgroundColor: '#2F2E33', flex: 1 }}>
        <View nativeID="header" style={{ height: '18%', borderWidth: 1, borderColor: 'black' }}>
          <View nativeID="DevCheck" style={{ top: '40%', flexDirection: 'row' }}>
            <Image source={require('./assets/icons/information-circle-outline.png')} style={{ left: '2%', width: 35, height: 35, tintColor: '#4FB04F' }} />
            <Text style={{ height: 35, width: 113, left: '35%', color: '#4FB04F', fontSize: 24, fontFamily: 'Istok Web', position: 'absolute' }}>DevCheck</Text>
            <Image source={require('./assets/icons/lock-open-outline.png')} style={{ left: '80%', width: 24, height: 24, tintColor: 'white', position: 'absolute' }} />
            <Image source={require('./assets/icons/menu-outline.png')} style={{ left: '90%', width: 24, height: 24, tintColor: 'white', position: 'absolute' }} />
          </View>
          <View nativeID="Menu" style={{ bottom: '5%', position: 'absolute', left: 0, right: 0, flexDirection: 'row', gap: '5%' }}>
            <Text numberOfLines={1} style={{ color: Styles.fonts.fontColorDefaut, fontFamily: 'Istok Web', fontSize: 16 }}>Bảng điều khiển</Text>
            <Text numberOfLines={1} style={{ color: Styles.fonts.fontColorDefaut, fontFamily: 'Istok Web', fontSize: 16 }}>Phần cứng</Text>
            <Text numberOfLines={1} style={{ color: Styles.fonts.fontColorDefaut, fontFamily: 'Istok Web', fontSize: 16 }}>Hệ thống</Text>
          </View>
        </View>

        <View nativeID="body" style={{ left: '3%', top: '1%', position: 'relative', alignSelf: 'stretch', gap: '2%' }}>
          <CpuMonitoringScreen />
          <ScrollView>
            <View nativeID="System" style={{ gap: '3%', width: '93%', flexDirection: 'row', flexWrap: 'wrap', overflow: 'scroll' }}>
              <BatteryScreen />
              <NetworkMonitoringScreen />
              <AppCounterScreen></AppCounterScreen>
              <DisplayMonitoringScreen></DisplayMonitoringScreen>
              {/* <View nativeID="appCouter" style={{ width: 155, height: 109, backgroundColor: '#3A373F', borderRadius: 15, gap: '10%' }}>
                <Text style={{ top: '10%', left: '10%', color: Styles.fonts.fontColorSystem }}>Ứng dụng</Text>
                <View nativeID="appCouterDetail" style={{ left: '10%', flexDirection: 'row', gap: '10%' }}>
                  <Text style={{ fontSize:30, color:Styles.fonts.fontColorSystem }} >80</Text>
                  <View nativeID="appCouterInformationDetail">
                    <Text style={{ color: Styles.fonts.fontColorDefaut }}>62 Ng. dùng</Text>
                    <Text style={{ color: Styles.fonts.fontColorDefaut }}>20 hệ thống</Text>
                  </View>
                </View>
                <Image source={require('./assets/icons/menu-outline.png')} style={{ width: 24, height: 24, tintColor: 'white', top: '10%', left: '80%', position: 'absolute' }} />
              </View> */}
            </View>
          </ScrollView>

          <View style={{ left: '5%', height: 81, width: 120, backgroundColor: '#3A373F', borderTopStartRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('./assets/icons/checkmark-outline.png')} style={{ width: 20, height: 20, tintColor: '#3DE324' }} />
            <Text style={{ color: Styles.fonts.fontColorDefaut }}>Kiểm tra</Text>
          </View>
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
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  horizontalLine: {
    height: 100,               // Độ dày của đường kẻ
    backgroundColor: '#CCCCCC', // Màu sắc
    width: '100%',            // Chiều rộng (có thể điều chỉnh)
    marginVertical: 10,       // Khoảng cách trên dưới
  },
});