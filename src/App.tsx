import React, { useState,useEffect } from 'react';
import { View,Text,Button} from 'react-native';
import HeaderSreen from './layout/Header';
import MenuScreen,{ MenuScreenProps } from './layout/menu/Menu';

import BatteryScreen from './components/Devices/BatteryScreen';
import ControlPanelSreen from './layout/menu/tabDevice/ControlPanelScreen';
import HardwareScreen from './layout/menu/tabDevice/HardwareScreen';
import SystemScreen from './layout/menu/tabDevice/SystemScreen';

import * as Style from '../assets/styles/configStyle'

import { sendDeviceSpecs,sendAppError } from './services/sendDeviceServece';
import { ErrorBoundary } from '@sentry/react-native';

// 1. Bắt lỗi JavaScript ngầm (Global JS Errors)
const defaultErrorHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler(async (error, isFatal) => {
  // TRUYỀN QUA ĐÂY: Gọi hàm của bạn và truyền các tham số tương ứng
  await sendAppError(
    error.name || 'Global_JS_Error',
    error.message,
    error.stack || '',
    isFatal ? 'FATAL' : 'ERROR'
  );
  
  // Trả lại quyền cho hệ thống xử lý mặc định
  defaultErrorHandler(error, isFatal);
});

// 2. Bắt lỗi bất đồng bộ quên try/catch (Unhandled Promise Rejections)
const promise = require('promise/setimmediate/rejection-tracking');
promise.enable({
  allRejections: true,
  onUnhandled: async (id: any, error: any) => {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
    const errStack = error instanceof Error ? error.stack : '';
    
    // TRUYỀN QUA ĐÂY: Bắn lỗi API hỏng hoặc hàm async hỏng về server
    await sendAppError(
      'Unhandled_Promise_Rejection',
      errMsg,
      errStack || `Promise ID: ${id}`,
      'WARNING'
    );
  },
});

export default function App() {
  const [currentTab, setCurrentTab] = useState<MenuScreenProps['activeTab']>('dashboard')

  useEffect(() => {
    sendDeviceSpecs();
  },[])
  
  return (
    <ErrorBoundary
      fallback={<View style={{flex: 1, backgroundColor: 'red'}}></View>}
      onError={async (error, componentStack) => {
        // BƯỚC 1: Ép kiểu và trích xuất dữ liệu cực kỳ nghiêm ngặt
        let errorName = 'UI_Render_Error';
        let errorMessage = 'Lỗi giao diện không rõ nguyên nhân';

        if (error instanceof Error) {
          errorName = error.name || errorName;
          errorMessage = error.message || errorMessage;
        } else if (typeof error === 'object' && error !== null) {
          errorName = (error as any).name || errorName;
          errorMessage = (error as any).message || JSON.stringify(error);
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        // TRUYỀN QUA ĐÂY: Đẩy lỗi sập giao diện UI kèm theo componentStack cây thư mục lỗi
        await sendAppError(
          errorName,                                      // 1. name
          errorMessage,                                   // 2. errorMessage
          componentStack || (error as any)?.stack || '',  // 3. stackTrace
          'CRITICAL'                                      // 4. logLevel
        );
      }}>
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

      {/* KHU VỰC NÚT BẤM TEST LỖI (Xóa đi sau khi test xong đồ án) */}
    <View style={{ padding: 10, backgroundColor: '#fff', gap: 10 }}>
       <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>KHU VỰC THỬ NGHIỆM HỆ THỐNG LỖI</Text>
       
       {/* 1. Test lỗi Render Giao diện (Tầng ErrorBoundary) */}
       <Button 
         title="Kích nổ lỗi Render UI (Critical)" 
         color="red"
         onPress={() => {
           // Ép biến null thực hiện hàm map để giao diện bị sập lập tức
           const fakeArray: any = null;
           fakeArray.map((item: any) => item);
         }} 
       />

       {/* 2. Test lỗi Bất đồng bộ (Tầng Unhandled Promise Rejection) */}
       <Button 
         title="Kích nổ lỗi Async API (Warning)" 
         color="orange"
         onPress={() => {
           // Tạo một Promise bị từ chối nhưng cố tình không viết .catch() hoặc try/catch
           new Promise((_, reject) => {
             reject(new Error("Lỗi giả lập: Không thể kết nối đến API Gateway do nghẽn băng thông!"));
           });
         }} 
       />

       {/* 3. Test lỗi Code Logic Ngầm (Tầng Global JS Error) */}
       <Button 
         title="Kích nổ lỗi Logic Ngầm (Fatal)" 
         color="purple"
         onPress={() => {
           // Gọi đến một hàm hoàn toàn không tồn tại trong hệ thống
           (window as any).hamNayKhongTonTaiVaSeLamSapApp();
         }} 
       />
    </View>
    </ErrorBoundary>
  );
}