import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import API_URL from "../../../utils/config";
import { toast } from "react-toastify";

const DRChart = () => {
  const [drData, setDrData] = useState({});
  const [eyeFilter, setEyeFilter] = useState("both");
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDRData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/dashboard/data/dr?eye=${eyeFilter}`,
          { withCredentials: true }
        );
        setDrData(response.data.data);
      } catch (error) {
        console.error("Error fetching DR data:", error);
        toast.error("Failed to load DR data");
      }
    };
    fetchDRData();
  }, [eyeFilter]);

  useEffect(() => {
    if (!drData || Object.keys(drData).length === 0) {
      setCategories([]);
      setChartSeries([]);
      return;
    }

    const days = Object.keys(drData);
    setCategories(days);

    const leftREF = days.map((day) => drData[day]?.left?.REF || 0);
    const leftNonREF = days.map((day) => drData[day]?.left?.['NON-REF'] || 0);
   

    const rightREF = days.map((day) => drData[day]?.right?.REF || 0);
    const rightNonREF = days.map((day) => drData[day]?.right?.['NON-REF'] || 0);
  

    const combinedSeries = [];

    if (eyeFilter === "left" || eyeFilter === "both") {
      combinedSeries.push(
        { name: "Left REF", data: leftREF },
        { name: "Left Non-REF", data: leftNonREF },
 
      );
    }

    if (eyeFilter === "right" || eyeFilter === "both") {
      combinedSeries.push(
        { name: "Right REF", data: rightREF },
        { name: "Right Non-REF", data: rightNonREF },
   
      );
    }

    setChartSeries(combinedSeries);
  }, [drData, eyeFilter]);

  const chartOptions = {
    chart: { type: "line", height: 400 },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories, labels: { rotate: -45 } },
    yaxis: { title: { text: "Number of Cases" } },
    legend: { position: "top" },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">DR Reports Overview</h2>
      <div className="flex justify-center space-x-4 mb-4">
        {["both", "left", "right"].map((type) => (
          <label key={type} className="flex items-center space-x-2">
            <input
              type="radio"
              name="eyeFilterDR"
              value={type}
              checked={eyeFilter === type}
              onChange={() => setEyeFilter(type)}
            />
            <span>{type === "both" ? "Both Eyes" : `${type} Eye`}</span>
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
