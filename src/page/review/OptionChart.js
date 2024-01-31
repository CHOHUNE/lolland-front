import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function OptionChart({ sellRateData, boxDimensions }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const chartContainer = document.getElementById("option-chart");
    chartContainer.width = boxDimensions.width;
    chartContainer.height = boxDimensions.height;

    const chartData = {
      labels: sellRateData.map((option) => option.option_name),
      datasets: [
        {
          data: sellRateData.map((option) => option.totalQuantitySold),
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    const chartOptions = {
      scales: {
        x: {
          display: false,
        },
        y: {
          beginAtZero: false,
          display: false,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "옵션 별 선호도",
          font: { size: 20 },
        },
        padding: {
          top: 10,
          bottom: 40,
        },
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
    };

    chartRef.current = new Chart(document.getElementById("option-chart"), {
      type: "doughnut",
      data: chartData,
      options: chartOptions,
    });

    return () => {
      chartRef.current.destroy();
    };
  }, [sellRateData, boxDimensions]);
  return <canvas id="option-chart" />;
}

export default OptionChart;
