import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import AppIcons from '@icons';
import MonitorCard from '../MonitorCard';
import * as Device from 'expo-device';
import * as Battery from 'expo-battery';

export default function BatteryScreen() {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryState, setBatteryState] = useState('');

  // 1. Lấy thông tin phần cứng & Hệ điều hành (Đồng bộ)
  const brand = Device.brand;          // Hãng sản xuất (Apple, Samsung...)
  const modelName = Device.modelName;  // Tên model (iPhone 13, Galaxy S21...)
  const osName = Device.osName;        // Tên OS (Android hoặc iOS)
  const osVersion = Device.osVersion;  // Phiên bản OS (14, 15...)

  // Hàm chuyển đổi trạng thái Pin từ số (Enum) sang chữ
  const getBatteryStateLabel = (status: Battery.BatteryState) => {
    const stateMapping: Record<number, string> = {
      1: 'Không sạc',
      2: 'Đang sạc ⚡',
      3: 'Pin đầy',
      0: 'Không rõ'
    };
    return stateMapping[status] || 'Không rõ';
  };

  useEffect(() => {
    let batteryLevelSubscription: Battery.Subscription | null = null;
    let batteryStateSubscription: Battery.Subscription | null = null;

    async function setupRealTimeBattery() {
      // 1. Lấy dữ liệu mặc định ban đầu khi vừa vào app
      const initialLevel = await Battery.getBatteryLevelAsync();
      setBatteryLevel(Math.round(initialLevel * 100));

      const initialState = await Battery.getBatteryStateAsync();
      setBatteryState(getBatteryStateLabel(initialState));

      // 2. LẮNG NGHE REAL-TIME: Tự động cập nhật khi phần trăm pin thay đổi
      batteryLevelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
        setBatteryLevel(Math.round(batteryLevel * 100));
        console.log("Pin thay đổi real-time:", Math.round(batteryLevel * 100));
      });

      // 3. LẮNG NGHE REAL-TIME: Tự động cập nhật khi CẮM hoặc RÚT sạc
      batteryStateSubscription = Battery.addBatteryStateListener(({ batteryState }) => {
        setBatteryState(getBatteryStateLabel(batteryState));
        console.log("Trạng thái sạc thay đổi real-time:", batteryState);
      });
    }

    setupRealTimeBattery();
    
    // HÀM CLEANUP: Hủy lắng nghe khi người dùng rời khỏi màn hình này (tránh rò rỉ bộ nhớ)
      return () => {
        if (batteryLevelSubscription) batteryLevelSubscription.remove();
        if (batteryStateSubscription) batteryStateSubscription.remove();
      };
  }, []);

  return (
    <MonitorCard nativeID='batterySystem' title='PIN' value1={`${batteryLevel}%`} value2={batteryState}
                  ChartElement={
                  <Image source={AppIcons.batteryFull} style={{width:30,height:30,tintColor:'#3DE324',transform : [{rotate: '-90deg'}]}}/>
                  }>

    </MonitorCard>
  );
}