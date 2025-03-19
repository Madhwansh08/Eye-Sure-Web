import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../utils/config";
import NumberCards from "./charts/NumberCards";
import DRChart from "./charts/DRChart";
import ARMDChart from "./charts/ARMDChart";
import GlaucomaChart from "./charts/GlaucomaChart";
import { toast } from "react-toastify";

const Metrics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [drData, setDrData] = useState(null);
  const [glaucomaData , setGlaucomaData]=useState(null)
  const [armdData , setArmdData]=useState(null)
  const [eyeFilter, setEyeFilter] = useState("both"); // Move filter state to Metrics

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/dashboard/data`, {
          withCredentials: true,
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchDRData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/dashboard/data/dr?eye=${eyeFilter}`,
          {
            withCredentials: true,
          }
        );
        setDrData(response.data.data);
      } catch (error) {
        console.error("Error fetching DR dashboard data:", error);
        toast.error("Failed to load DR dashboard data");
      }
    };
    fetchDRData();
  }, [eyeFilter]); // Refetch when filter changes

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
    const fetchArmdData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/dashboard/data/armd?eye=${eyeFilter}`,
          { withCredentials: true }
        );
        setArmdData(response.data.data);
      } catch (error) {
        console.error("Error fetching ARMD data:", error);
        toast.error("Failed to load ARMD data");
      }
    };
    fetchArmdData();
  }, [eyeFilter]);


  console.log(armdData)





  return (
    <div className="p-4 space-y-8">
      {/* Display number cards */}
      <NumberCards
        patientCount={dashboardData?.totalPatients}
        drCount={dashboardData?.totalDRReports}
        glaucomaCount={dashboardData?.totalGlaucomaReports}
        armdCount={dashboardData?.totalArmdReports}
      />

      {/* Pass eyeFilter & update function to DRChart */}
      <DRChart drData={drData} eyeFilter={eyeFilter} setEyeFilter={setEyeFilter} />

      <GlaucomaChart glaucomaData={glaucomaData} eyeFilter={eyeFilter} setEyeFilter={setEyeFilter}/>

      <ARMDChart armdData={armdData} eyeFilter={eyeFilter} setEyeFilter={setEyeFilter}/>

    </div>
  );
};

export default Metrics;
