import React from 'react';
import Chart from 'react-apexcharts';

const BarsChartCommon = ({barChart, namesChart}) => {


  const options = {
    chart: {
      height: 400,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        columnWidth: '60px',
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return val;
      },
      style: {
        colors: ['#304758']
      }
    },
    stroke: {
      width: 0
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2']
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: namesChart,
      tickPlacement: 'on'
    },
    yaxis: {
      title: {
        text: 'Значения',
      },
    },
    tooltip: {
      y: {
        formatter: function(val, opts) {
          return  val;
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      },
    }
  };

  return (
    <Chart options={options} series={barChart} type="bar" height={400} />
  );
};

export default BarsChartCommon;
