import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import API_URL from "../../../utils/config";
import { toast } from "react-toastify";

const ARMDChart = () => {
  const [armdData, setArmdData] = useState({});
  const [eyeFilter, setEyeFilter] = useState("both");
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch ARMD Data
  useEffect(() => {
    const fetchARMDData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/dashboard/data/armd?eye=${eyeFilter}`,
          { withCredentials: true }
        );
        setArmdData(response.data.data || {});
      } catch (error) {
        console.error("Error fetching ARMD data:", error);
        toast.error("Failed to load ARMD data");
      }
    };
    fetchARMDData();
  }, [eyeFilter]);

  console.log(armdData);

  // Process and Set Chart Data
  useEffect(() => {
    const days = Object.keys(armdData);
    if (days.length === 0) {
      setCategories([]);
      setChartSeries([]);
      return;
    }

    setCategories(days);

    const armdPredictedData = days.map((day) => {
      const left = armdData[day]?.left?.ARMDPredicted || 0;
      const right = armdData[day]?.right?.ARMDPredicted || 0;
      return left + right;
    });

    const noArmdData = days.map((day) => {
      const left = armdData[day]?.left?.NoARMD || 0;
      const right = armdData[day]?.right?.NoARMD || 0;
      return left + right;
    });

    setChartSeries([
      { name: "ARMD Predicted", data: armdPredictedData },
      { name: "No ARMD", data: noArmdData },
    ]);
  }, [armdData]);

  // Chart Configuration
  const chartOptions = {
    chart: { type: "line", height: 400, zoom: { enabled: true } },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories, labels: { rotate: -45 } },
    yaxis: { title: { text: "Number of Cases" } },
    markers: { size: 6, hover: { size: 8 } },
    legend: { position: "top" },
    tooltip: { shared: true, intersect: false, y: { formatter: (val) => `${val} cases` } },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">ARMD Reports Overview</h2>

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
            <span className="capitalize">{type === "both" ? "Both Eyes" : `${type} Eye`}</span>
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
