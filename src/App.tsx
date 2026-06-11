import React, { useState } from 'react';
import { View} from 'react-native';
import HeaderSreen from './layout/Header';
import MenuScreen,{ MenuScreenProps } from './layout/menu/Menu';

import BatteryScreen from './components/Devices/BatteryScreen';
import ControlPanelSreen from './layout/menu/tabDevice/ControlPanelScreen';
import HardwareScreen from './layout/menu/tabDevice/HardwareScreen';
import SystemScreen from './layout/menu/tabDevice/SystemScreen';

import * as Style from '../assets/styles/configStyle'

import { ErrorBoundary } from '@sentry/react-native';
import { sendErrorToServer } from './services/errorServece';

export default function App() {
  const [currentTab, setCurrentTab] = useState<MenuScreenProps['activeTab']>('dashboard')
  return (
    <ErrorBoundary
      onError={(error, componentStack) => {sendErrorToServer(error, componentStack);}}>
      <View nativeID="header" style={{ height: '18%', borderWidth: 1, borderColor: 'black',backgroundColor: Style.background.backgroundSystem }}>
        <HeaderSreen></HeaderSreen>
        <MenuScreen activeTab={currentTab} 
                    onTabPress={(tabName) => {setCurrentTab(tabName);}}>
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