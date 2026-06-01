import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export interface MenuScreenProps {
  activeTab: 'dashboard' | 'hardware' | 'system' | 'battery';
  onTabPress: (tabName: 'dashboard' | 'hardware' | 'system' | 'battery') => void;
  bageNumber ?: number;
}

export default function MenuScreen({ activeTab, onTabPress }: MenuScreenProps) {
  const getTabStyle = (tabName: string) => {
    const isActive = activeTab === tabName;
    return {
      color: isActive ? '#4FB04F' : '#FFFFFF',
      fontFamily: 'Istok Web',
      fontSize: 16,
      fontWeight: isActive ? 'bold' as const : 'normal' as const,
      paddingBottom: 4,
      borderBottomWidth: isActive ? 3 : 0,
      borderBottomColor: '#4FB04F',
    };
  };

  return (
    <View nativeID="Menu" style={{ bottom: '5%', position: 'absolute', left: 20, right: 0, flexDirection: 'row', gap: 20, alignItems: 'flex-end' }}>
      
      {/* 🌟 Bọc các Text bằng TouchableOpacity và bắt sự kiện onPress */}
      <TouchableOpacity onPress={() => onTabPress('dashboard')}>
        <Text numberOfLines={1} style={getTabStyle('dashboard')}>Bảng điều khiển</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => onTabPress('hardware')}>
        <Text numberOfLines={1} style={getTabStyle('hardware')}>Phần cứng</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => onTabPress('system')}>
        <Text numberOfLines={1} style={getTabStyle('system')}>Hệ thống</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onTabPress('battery')}>
        <Text numberOfLines={1} style={getTabStyle('battery')}>Pin</Text>
      </TouchableOpacity>

    </View>
  );
}