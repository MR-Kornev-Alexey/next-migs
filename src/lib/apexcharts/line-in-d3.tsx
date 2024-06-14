import {calculateDistance} from "@/lib/calculate/calculate-distance";
import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import LineColumnPlot from "@/lib/apexcharts/line-column";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

 const LineInD3 = ({ seriesDistance, title, categories }) => {


  const  options= {
        chart: {
          height: 350,
          type: 'area',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          zoom: {
            enabled: true
          },
          toolbar: {
            show: true
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: title,
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: categories,
          title: {
            text: 'Время'
          }
        },
        yaxis: {
          title: {
            text: 'Отклонение'
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
          floating: true,
          offsetY: -15,
          offsetX: -5
        }};

    return (
      <Box>
        <Chart options={options} series={seriesDistance} type="line" height={350} />
      </Box>

  );
}


export default LineInD3;
