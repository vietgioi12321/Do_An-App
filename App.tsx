import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button } from 'react-native';
import HeaderSreen from 'layout/Header';
import MenuScreen from 'menu/Menu';
import { MenuScreenProps } from 'menu/Menu';

import BatteryScreen from 'Devices/BatteryScreen';
import ControlPanelSreen from './menu/tabDevice/ControlPanelScreen';
import HardwareScreen from 'menu/tabDevice/HardwareScreen';
import SystemScreen from 'menu/tabDevice/SystemScreen';

import * as Style from './commonStyle'

import { ErrorBoundary } from '@sentry/react-native';
import { sendErrorToServer } from 'services/errorServece';

import Sentry from './config'

export default function App() {
  const [currentTab, setCurrentTab] = useState<MenuScreenProps['activeTab']>('dashboard')
  return (
    <ErrorBoundary
      onError={(error, componentStack) => {
        sendErrorToServer(error, componentStack);
        }}>
      <View nativeID="header" style={{ height: '18%', borderWidth: 1, borderColor: 'black',backgroundColor: Style.background.backgroundSystem }}>
        <HeaderSreen></HeaderSreen>
        <MenuScreen activeTab={currentTab} 
                    onTabPress={(tabName) => {
                                console.log("File cha đã biết bạn vừa ấn vào tab:", tabName);
                                setCurrentTab(tabName); // Cập nhật state để đổi màu chữ và đổi màn hình luôn
                              }}>
        </MenuScreen>
      </View>

      <View style={{ flex: 1 , backgroundColor: Style.background.backgroundSystem}}>
        {(() => {
          switch(currentTab) {
            case 'dashboard': // Hoặc 'Bảng Điều Khiển' tùy theo State của bạn
              return <ControlPanelSreen/>;
              
            case 'hardware':
              return <HardwareScreen />;
              
            case 'system':
              return <SystemScreen />;
              
            case 'battery':
              return <BatteryScreen />;
              
            default:
              return <ControlPanelSreen />; // Màn hình mặc định lỗi/phòng hờ
          }
        })()}
      </View>
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