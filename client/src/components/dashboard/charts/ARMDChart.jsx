import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const ARMDChart = ({ armdData, eyeFilter, setEyeFilter }) => {
  // State for chart
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!armdData || armdData.length === 0) {
      setCategories([]);
      setChartSeries([]);
      return;
    }

    // Filter data based on eye selection
    const filteredData = armdData.filter((item) => {
      if (eyeFilter === "both") return true;
      return item._id.eye === eyeFilter;
    });

    // Extract unique dates for x-axis
    const days = [...new Set(filteredData.map((item) => item._id.day))];
    setCategories(days);

    // Initialize data objects
    const armdPredictedData = {};
    const noArmdData = {};

    days.forEach((day) => {
      armdPredictedData[day] = 0;
      noArmdData[day] = 0;
    });

    filteredData.forEach((item) => {
      const day = item._id.day;
      const status = item._id.status;
      const count = item.totalCount;

      if (status === "ARMD Predicted") {
        armdPredictedData[day] += count;
      } else {
        noArmdData[day] += count;
      }
    });

    setChartSeries([
      { name: "ARMD Predicted", data: days.map((day) => armdPredictedData[day] || 0) },
      { name: "No ARMD", data: days.map((day) => noArmdData[day] || 0) },
    ]);
  }, [armdData, eyeFilter]);

  // Chart Configuration
  const chartOptions = {
    chart: {
      type: "line",
      height: 400,
      zoom: { enabled: true },
      toolbar: { show: true },
      animations: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories,
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: "Number of Cases" },
    },
    markers: {
      size: 6,
      hover: { size: 8 },
    },
    legend: {
      position: "top",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (val) => `${val} cases` },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">ARMD Reports Overview</h2>

      {/* Filter Controls */}
      <div className="flex justify-center space-x-4 mb-4">
        {["both", "left", "right"].map((type) => (
          <label key={type} className="flex items-center space-x-2">
            <input
              type="radio"
              name="eyeFilter"
              value={type}
              checked={eyeFilter === type}
              onChange={() => setEyeFilter(type)}
            />
            <span className="capitalize">
              {type === "both" ? "Both Eyes" : `${type} Eye`}
            </span>
          </label>
        ))}
      </div>

      {chartSeries.length === 0 ? (
        <p className="text-center text-secondary">No ARMD data available.</p>
      ) : (
        <Chart options={chartOptions} series={chartSeries} type="line" height={400} />
      )}
    </div>
  );
};

export default ARMDChart;
