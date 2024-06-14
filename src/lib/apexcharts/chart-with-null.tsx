import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const LineColumnPlot = ({ seriesDistance, title, categories, color }) => {
  // Define state using useState hook
  const [chartOptions, setChartOptions] = useState({
    options: {
      chart: {
        type: 'area',
        height: 350,
        animations: {
          enabled: true
        },
        zoom: {
          enabled: true
        },
        toolbar: {
          show: true
        }
      },
      colors: [color], // Notice the correction from 'color' to 'colors'
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.8,
        type: 'pattern',
        pattern: {
          style: ['verticalLines', 'horizontalLines'],
          width: 5,
          height: 6
        },
      },
      markers: {
        size: 5,
        hover: {
          size: 9
        }
      },
      title: {
        text: title
      },
      tooltip: {
        intersect: true,
        shared: false
      },
      theme: {
        palette: 'palette1'
      },
      xaxis: {
        categories: categories
      },
      yaxis: {
        title: {
          text: 'Значение'
        },
        min: 0 // Ensure y-axis starts from 0
      }
    },
  });

  return (
    <Chart options={chartOptions.options} series={seriesDistance} type="area" height={350} />
  );
};

export default LineColumnPlot;
