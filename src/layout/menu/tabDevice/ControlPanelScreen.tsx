import React from "react";
import {View,Text,Button,Image, ScrollView} from 'react-native'
import * as Styles from '@/assets/styles/configStyle';
import AppIcons from "@icons";


import BatteryScreen from '../../../components/Devices/BatteryScreen';
import CpuMonitoringScreen from '../../../components/Devices/CpuMonitoringScreen';
import NetworkMonitoringScreen from '../../../components/Devices/NetworkMonitoringScreen';
import AppCounterScreen from '../../../components/Devices/AppCounterScreen';
import DisplayMonitoringScreen from '../../../components/Devices/DisplayMonitoringScreen';
import RamMonitoringScreen from '../../../components/Devices/RamMonitoringScreen';
import RomMonitoringScreen from '../../../components/Devices/RomMonitoringScreen';

import { sendHardwareInfoOnLaunch, sendErrorToServer } from "../../../services/sendDeviceServece";

export default function ControlPanelSreen(){
    return(
        <ScrollView nativeID="full-screen" 
                    style={{backgroundColor: '#2F2E33', flex: 1}}
                    contentContainerStyle={{ flexDirection: 'column', gap: 10, paddingBottom: 40 }}>
            <CpuMonitoringScreen />
            <View nativeID="System" style={{ width: '100%', 
                                            flexDirection: 'row', 
                                            flexWrap: 'wrap', 
                                            justifyContent: 'space-between',
                                            rowGap: 12}}>
              <View style={{ width: '48.5%' }}><BatteryScreen /></View>
              <View style={{ width: '48.5%' }}><NetworkMonitoringScreen /></View>
              <View style={{ width: '48.5%' }}><AppCounterScreen /></View>
              <View style={{ width: '48.5%' }}><DisplayMonitoringScreen /></View>
              <View style={{ width: '48.5%' }}><RamMonitoringScreen /></View>
              <View style={{ width: '48.5%' }}><RomMonitoringScreen /></View>
            </View>

          <View style={{ left: '5%', height: 81, width: 120, backgroundColor: '#3A373F', borderTopStartRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={AppIcons.checkmark} style={{ width: 20, height: 20, tintColor: '#3DE324' }} />
            <Text style={{ color: Styles.fonts.fontColorDefaut }}>Kiểm tra</Text>
          </View>
              <Button title="Test RAM overflow" onPress={() => { try { throw new Error('RAM overflow simulated'); } catch (e) { sendErrorToServer(e, { componentStack: 'Button onPress' }); console.log('RAM overflow log sent to server'); } }} />
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
    )     
}

            