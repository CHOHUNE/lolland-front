import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const RatingChart = ({ ratingDistribution }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = Object.keys(ratingDistribution);
    const data = Object.values(ratingDistribution);

    const chartData = {
      labels: labels.map(Number),
      datasets: [
        {
          data: data,
          backgroundColor: "red",
          // borderColor: "rgba(75,192,192,1)",
          // borderWidth: 1,
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
        },
        y: {
          beginAtZero: true,
          display: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    chartRef.current = new Chart(document.getElementById("rating-chart"), {
      type: "bar",
      data: chartData,
      options: options,
    });

    return () => {
      chartRef.current.destroy();
    };
  }, [ratingDistribution]);

  return <canvas id="rating-chart" height="300" />;
};

export default RatingChart;
