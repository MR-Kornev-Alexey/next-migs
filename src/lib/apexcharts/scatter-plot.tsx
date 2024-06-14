import React from 'react';
import Chart from 'react-apexcharts';

const ScatterPlot = ({ seriesInD3 }) => {
  // Определяем фиксированные цвета для серий
  const colors = ['#FF4560', '#00E396', '#775DD0', '#FEB019', '#FF4560', '#775DD0'];

  const options = {
    chart: {
      type: 'bubble',
      toolbar: { show: true },
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },
    colors: colors, // Устанавливаем цвета серий
    markers: {
      size: 16, // Увеличиваем размер маркеров
      shape: 'circle' // Можно указать 'circle', 'square', 'triangle' или использовать SVG
      // customSVG: { // Пример использования SVG
      //   offsetX: 0,
      //   offsetY: 0,
      //   svgPath: 'M2 2h4v4H2z' // Здесь вы можете вставить путь SVG
      // }
    },
    dataLabels: {
      enabled: true, // Включаем отображение значений
      formatter: function (val) {
        return val// Форматируем значения, например (X, Y)
      },
      style: {
        fontSize: '12px',
        colors: ['#304758']
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#304758',
        opacity: 0.9
      },
      offsetY: -12 // Смещаем метки выше маркеров
    },
    xaxis: {
      tickAmount: 12,
      type: 'category',
      title: {
        text: 'Данные по X' // Название оси X
      }
    },
    yaxis: {
      title: {
        text: 'Данные по Y' // Название оси Y
      }
    }
  };

  // Проверяем, что каждая серия имеет уникальный идентификатор
  const seriesWithIds = seriesInD3.map((serie, index) => ({
    ...serie,
    id: serie.id || `series-${index}`
  }));

  return (
    <Chart options={options} series={seriesWithIds} type="bubble"  height={400} />
  );
};

export default ScatterPlot;
