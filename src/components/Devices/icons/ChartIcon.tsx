import React from 'react';
import { View} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface MemoryChartProps {
  size: number;
  pie1: number;
  pie2: number;
}

export default function MemoryChart({size , pie1,pie2}: MemoryChartProps) {
  // Dữ liệu mẫu (Thay bằng số liệu RAM/ROM thực tế từ Native Bridge)
  const data = [
    {
      name: 'Used',
      population: pie1, // Tương đương ~40% màu xanh đậm như icon
      color: '#3DE324', // Màu xanh đậm
    },
    {
      name: 'Free',
      population: pie2, // Phần còn lại màu xanh nhạt
      color: '#40693D', // Màu xanh nhạt
    },
  ];

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <PieChart
        data={data}
        width={size}
        height={size}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"10"}
        absolute // Hiển thị số liệu phần trăm trực tiếp
        hasLegend={false} // Ẩn chú thích chữ nếu bạn chỉ muốn lấy nguyên cái icon tròn
      />
    </View>
  );
}