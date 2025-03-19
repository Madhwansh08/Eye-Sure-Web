import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const GlaucomaChart = ({ glaucomaData, eyeFilter, setEyeFilter }) => {
  // State for chart
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!glaucomaData || glaucomaData.length === 0) {
      setCategories([]);
      setChartSeries([]);
      return;
    }

    // Filter data based on eye selection
    const filteredData = glaucomaData.filter((item) => {
      if (eyeFilter === "both") return true;
      return item._id.eye === eyeFilter;
    });

    // Extract unique dates for x-axis
    const days = [...new Set(filteredData.map((item) => item._id.day))];
    setCategories(days);

    // Initialize data objects
    const glaucomaDataObj = {};
    const nonGlaucomaDataObj = {};
    const suspectGlaucomaDataObj = {};

    days.forEach((day) => {
      glaucomaDataObj[day] = 0;
      nonGlaucomaDataObj[day] = 0;
      suspectGlaucomaDataObj[day] = 0;
    });

    filteredData.forEach((item) => {
      const day = item._id.day;
      const status = item._id.status;
      const count = item.totalCount;

      if (status === "Glaucoma") {
        glaucomaDataObj[day] += count;
      } else if (status === "Non Glaucoma") {
        nonGlaucomaDataObj[day] += count;
      } else if (status === "Suspect Glaucoma") {
        suspectGlaucomaDataObj[day] += count;
      }
    });

    setChartSeries([
      { name: "Glaucoma", data: days.map((day) => glaucomaDataObj[day] || 0) },
      { name: "Non-Glaucoma", data: days.map((day) => nonGlaucomaDataObj[day] || 0) },
      { name: "Suspect Glaucoma", data: days.map((day) => suspectGlaucomaDataObj[day] || 0) },
    ]);
  }, [glaucomaData, eyeFilter]);

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
      <h2 className="text-2xl font-bold mb-4 text-center">Glaucoma Reports Overview</h2>

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
        <p className="text-center text-secondary">No Glaucoma data available.</p>
      ) : (
        <Chart options={chartOptions} series={chartSeries} type="line" height={400} />
      )}
    </div>
  );
};

export default GlaucomaChart;
