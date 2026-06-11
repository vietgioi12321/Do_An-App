import React from "react"
import { View, Text,Image } from "react-native"
import AppIcons from "@icons"

export default function HeaderSreen(){
    return(
        <View nativeID="DevCheck" style={{ top: '40%', flexDirection: 'row' }}>
            <Image source={AppIcons.informationCircle} style={{ left: '2%', width: 35, height: 35, tintColor: '#4FB04F' }} />
            <Text style={{ height: 35, width: 113, left: '35%', color: '#4FB04F', fontSize: 24, fontFamily: 'Istok Web', position: 'absolute' }}>DevCheck</Text>
            <Image source={AppIcons.lockOpen} style={{ left: '80%', width: 24, height: 24, tintColor: 'white', position: 'absolute' }} />
            <Image source={AppIcons.menu} style={{ left: '90%', width: 24, height: 24, tintColor: 'white', position: 'absolute' }} />
        </View>
    )
}
