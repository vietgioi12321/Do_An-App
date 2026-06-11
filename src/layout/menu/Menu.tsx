import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {getTabStyle} from '@/assets/styles/MenuStyle'

export interface MenuScreenProps {
  activeTab: 'dashboard' | 'hardware' | 'system' | 'battery';
  onTabPress: (tabName: 'dashboard' | 'hardware' | 'system' | 'battery') => void;
  bageNumber ?: number;
}

export default function MenuScreen({ activeTab, onTabPress }: MenuScreenProps) {
  return (
    <View nativeID="Menu" style={{ bottom: '5%', position: 'absolute', left: 20, right: 0, flexDirection: 'row', gap: 20, alignItems: 'flex-end' }}>
      
      {/* 🌟 Bọc các Text bằng TouchableOpacity và bắt sự kiện onPress */}
      <TouchableOpacity onPress={() => onTabPress('dashboard')}>
        <Text numberOfLines={1} style={getTabStyle('dashboard',activeTab)}>Bảng điều khiển</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => onTabPress('hardware')}>
        <Text numberOfLines={1} style={getTabStyle('hardware',activeTab)}>Phần cứng</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => onTabPress('system')}>
        <Text numberOfLines={1} style={getTabStyle('system',activeTab)}>Hệ thống</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onTabPress('battery')}>
        <Text numberOfLines={1} style={getTabStyle('battery',activeTab)}>Pin</Text>
      </TouchableOpacity>

    </View>
  );
}