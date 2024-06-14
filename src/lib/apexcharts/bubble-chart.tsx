// components/BubbleChart.tsx
import React from 'react';
import { Bubble } from 'react-chartjs-2';
import 'chart.js/auto';

interface BubbleChartProps {
  data: { x: number; y: number; r: number }[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'Bubble Dataset',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bubble data={chartData} options={options} />;
};

export default BubbleChart;
