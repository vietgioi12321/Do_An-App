import React from "react";
import {View,Text} from "react-native"
import * as Devide from 'react-native-device-info'

export default function InfoDevice(){
    let device : Record<string, any> = {}

    device.battery = Devide.useBatteryLevel();
    device.cpu = Devide.useDeviceName()
    device.batteryLevel=Devide.useBatteryLevelIsLow()
    device.Brightness = Devide.useBrightness()
    device.FirstInstallTime=  Devide.useFirstInstallTime()
    device.BluetoothHeadphonesConnected = Devide.useIsBluetoothHeadphonesConnected()
    device.Emulator=  Devide.useIsEmulator()
    device.HeadphonesConnected =  Devide.useIsHeadphonesConnected()
    device.WiredHeadphonesConnected =  Devide.useIsWiredHeadphonesConnected()
    device.Manufacturer=  Devide.useManufacturer()
    device.PowerState =  Devide.usePowerState()


    return(
        <View>
            <Text style={{color:'white'}}>{JSON.stringify(device,null,' ')}</Text>
        </View>
    )
}