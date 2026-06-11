import React from 'react';
import { Image } from 'react-native';
import MonitorCard from '../MonitorCard';
import AppIcons from '@icons';
// 1. Nhập thư viện kiểm tra mạng
import { useNetInfo } from "@react-native-community/netinfo";

export default function NetworkMonitoringScreen() {
  const netInfo = useNetInfo();

  // Kiểm tra xem có đang kết nối Wifi không và lấy tốc độ link speed (chỉ hỗ trợ Android)
  const linkSpeed = netInfo.type === 'wifi' && netInfo.details && 'linkSpeed' in netInfo.details
    ? `${netInfo.details.linkSpeed} Mbps`
    : 'N/A (Cần kết nối Wifi)';

  return (
    <MonitorCard nativeID='networkSystem' title='Mạng' value1='WiFi' value2={linkSpeed}
                  ChartElement={
                    <Image source={AppIcons.wifi} style={{width:30,height:30,tintColor:'#3DE324',transform : [{rotate: '90deg'}]}}></Image>
                  }>

    </MonitorCard>
  );
}