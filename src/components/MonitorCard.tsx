import React from 'react';
import { View, Text,Image } from 'react-native';
import * as Styles from '../../assets/styles/configStyle';
import AppIcons from "@icons"


interface MonitorCardProps {
    nativeID: string;
    title: string;
    value1: string | number;
    value2: string | number;
    icon?: any;
    IconComponent?: React.ComponentType<{ size: number; color: string }>;
    ChartElement: React.ReactNode
  }

export default function MonitorCard(props : MonitorCardProps){
    return (
        <View nativeID={props.nativeID} style={{height: 109, backgroundColor: '#3A373F', borderRadius: 15, gap: '10%' }}>
          <Text style={{ top: '10%', left: '10%', color: Styles.fonts.fontColorSystem }}>{props.title}</Text>
          <View nativeID={props.nativeID + "Detail"} style={{ left: '10%', flexDirection: 'row', gap: '5%' }}>
            {props.ChartElement}
            <View nativeID={props.nativeID+ "InformationDetail"} style={{ width:'50%', justifyContent: 'center' }}>
              <Text style={{ color: Styles.fonts.fontColorDefaut }} numberOfLines={2}>{props.value1}</Text>
              <Text style={{ color: Styles.fonts.fontColorDefaut }} numberOfLines={2}>{props.value2}</Text>
            </View>
          </View>
          <Image source={AppIcons.menu} style={{ width: 24, height: 24, tintColor: 'white', top: '10%', left: '80%', position: 'absolute' }} />
        </View>
      );
}