import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const DRChart = ({ drData, eyeFilter, setEyeFilter }) => {
  // Always call hooks in the same order
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!drData || drData.length === 0) {
      setCategories([]);
      setChartSeries([]);
      return;
    }

    // Filter the data based on the eye filter.
    const filteredData = drData.filter((item) => {
      if (eyeFilter === "both") return true;
      return item._id.eye === eyeFilter; // Compare with the added "eye" field
    });

    // Extract unique dates for the X-axis.
    const days = [...new Set(filteredData.map((item) => item._id.day))];
    setCategories(days);

    // Process data for REF and Non‑REF counts.
    const refData = {};
    const nonRefData = {};

    days.forEach((day) => {
      refData[day] = 0;
      nonRefData[day] = 0;
    });

    filteredData.forEach((item) => {
      const day = item._id.day;
      // Use the "fundus" field to determine if the report is REF or not.
      const fundus = item._id.fundus;
      const count = item.totalCount;

      if (fundus === "REF") {
        refData[day] += count;
      } else {
        nonRefData[day] += count;
      }
    });

    setChartSeries([
      { name: "REF", data: days.map((day) => refData[day] || 0) },
      { name: "Non‑REF", data: days.map((day) => nonRefData[day] || 0) },
    ]);
  }, [drData, eyeFilter]);

  // Chart Configuration (same styling as before)
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
      <h2 className="text-2xl font-bold mb-4 text-center">DR Reports Overview</h2>

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
        <p className="text-center text-secondary">No DR data available.</p>
      ) : (
        <Chart options={chartOptions} series={chartSeries} type="line" height={400} />
      )}
    </div>
  );
};

export default DRChart;
