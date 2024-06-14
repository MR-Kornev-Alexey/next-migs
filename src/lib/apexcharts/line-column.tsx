import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const LineColumnPlot = ({ seriesRF251 }) => {
  // Define state using useState hook
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: 'Отклонение',
        type: 'column',
        data: [440, 505]
      },
      {
        name: 'Температура',
        type: 'line',
        data: [23, 42]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line'
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: 'Температура'
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: [
        '01 Jan 2001', '02 Jan 2001'
      ],
      xaxis: {
        type: 'datetime'
      },
      yaxis: [
        {
          title: {
            text: 'Температура'
          }
        },
        {
          opposite: true,
          title: {
            text: 'Отклонение'
          }
        }
      ]
    }
  });

  return (
    <Chart options={chartOptions.options} series={seriesRF251} type="line" height={350} />
  );
};

export default LineColumnPlot;
