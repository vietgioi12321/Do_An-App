import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import * as Styles from '../commonStyle';
// 1. Nhập thư viện kiểm tra mạng
import { useNetInfo } from "@react-native-community/netinfo";

export default function NetworkMonitoringScreen() {
  const netInfo = useNetInfo();

  // Kiểm tra xem có đang kết nối Wifi không và lấy tốc độ link speed (chỉ hỗ trợ Android)
  const linkSpeed = netInfo.type === 'wifi' && netInfo.details && 'linkSpeed' in netInfo.details
    ? `${netInfo.details.linkSpeed} Mbps`
    : 'N/A (Cần kết nối Wifi)';

  return (
      <View nativeID='networkSystem' style={{width:155 , height: 109, backgroundColor: '#3A373F',borderRadius: 15,gap: '10%'}}>
        <Text style={{top:'10%', left:'10%', color: Styles.fonts.fontColorSystem}}>Mạng</Text>
        <View nativeID='batteryInformation' style={{left:'10%',flexDirection:'row', gap: '10%'}}>
          <Image source={require('../assets/icons/wifi-outline.png')} style={{width:30,height:30,tintColor:'#3DE324',transform : [{rotate: '90deg'}]}}></Image>
          <View nativeID='batteryInformationDetail' style={{}}>
            <Text style={{color: Styles.fonts.fontColorDefaut}}>WiFi</Text>
            <Text style={{color: Styles.fonts.fontColorDefaut}}>{linkSpeed}</Text>
          </View>
        </View>
        <Image source={require('../assets/icons/menu-outline.png')} style={{width:24,height:24,tintColor:'white',top:'10%',left : '80%', position: 'absolute' }}></Image>
      </View>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: '#2D2C34', borderRadius: 16, padding: 16, margin: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  panelTitle: { color: '#4CAF50', fontSize: 16, fontWeight: '600' },
  menuIcon: { color: '#AAAAAA', fontSize: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  label: { color: '#E5E5E7', fontSize: 16 },
  value: { color: '#00ff00', fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold' },
});