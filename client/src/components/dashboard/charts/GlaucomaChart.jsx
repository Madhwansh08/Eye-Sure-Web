import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import API_URL from "../../../utils/config";
import { toast } from "react-toastify";

const GlaucomaChart = () => {
  const [glaucomaData, setGlaucomaData] = useState({});
  const [eyeFilter, setEyeFilter] = useState("both");
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchGlaucomaData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/dashboard/data/glaucoma?eye=${eyeFilter}`,
          { withCredentials: true }
        );
        setGlaucomaData(response.data.data);
      } catch (error) {
        console.error("Error fetching Glaucoma data:", error);
        toast.error("Failed to load Glaucoma data");
      }
    };
    fetchGlaucomaData();
  }, [eyeFilter]);

  useEffect(() => {
    if (!glaucomaData || Object.keys(glaucomaData).length === 0) {
      setCategories([]);
      setChartSeries([]);
      return;
    }

    const days = Object.keys(glaucomaData);
    setCategories(days);

    // Extract Data Safely
    const getValue = (day, eye, status) =>
      glaucomaData?.[day]?.[eye]?.[status] || 0;

    // Create Chart Series
    const seriesData = [];

    const addSeries = (eye, label) => {
      seriesData.push(
        {
          name: `${label} Glaucoma`,
          data: days.map((day) => getValue(day, eye, "Glaucoma")),
        },
        {
          name: `${label} Non Glaucoma`,
          data: days.map((day) => getValue(day, eye, "Non Glaucoma")),
        },
        {
          name: `${label} Suspect Glaucoma`,
          data: days.map((day) => getValue(day, eye, "Suspect Glaucoma")),
        }
      );
    };

    if (eyeFilter === "left" || eyeFilter === "both") {
      addSeries("left", "Left");
    }
    if (eyeFilter === "right" || eyeFilter === "both") {
      addSeries("right", "Right");
    }

    setChartSeries(seriesData);
  }, [glaucomaData, eyeFilter]);

  const chartOptions = {
    chart: { type: "line", height: 400 },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories, labels: { rotate: -45 } },
    yaxis: { title: { text: "Number of Cases" } },
    legend: { position: "top" },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Glaucoma Reports Overview</h2>
      <div className="flex justify-center space-x-4 mb-4">
        {["both", "left", "right"].map((type) => (
          <label key={type} className="flex items-center space-x-2">
            <input
              type="radio"
              name="eyeFilterGlaucoma"
              value={type}
              checked={eyeFilter === type}
              onChange={() => setEyeFilter(type)}
            />
            <span>{type === "both" ? "Both Eyes" : `${type} Eye`}</span>
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
