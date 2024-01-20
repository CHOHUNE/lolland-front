import React, { useRef, useEffect } from "react";
import { Chart, Tooltip, TooltipItem } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const RatingChart = ({ ratingDistribution }) => {
  const labels = [0, 1, 2, 3, 4, 5];
  const data = labels.map((label) =>
    ratingDistribution[label] !== undefined ? ratingDistribution[label] : 0,
  );

  const chartData = {
    labels: labels.map(String),
    datasets: [
      {
        data: data,
        backgroundColor: 'orange',
      },
    ],
  };

    const options = {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          grid: {
            display: false,
          },
          ticks: {
            minTicksLimit: 6,
            maxTicksLimit: 6,
          },
        },
        y: {
          beginAtZero: true,
          display: false,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "평점 비율",
          font: { size: 20 },
          padding: {
            top: 10,
            bottom: 30,
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: "orange",
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (context) {
              const value = context.parsed.y;
              const displayValue =
                typeof value !== "undefined" ? value + "명" : "0명";
              return displayValue;
            },
          },
          displayColors: false,
          titleColor: "#000",
          bodyColor: "white",
          yAlign: "bottom",
        },
      },
    };

  return <Bar data={chartData} options={options} />;
};

export default RatingChart;
