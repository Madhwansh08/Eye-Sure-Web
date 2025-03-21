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

  return (
    <div className="p-4 space-y-8">
      <NumberCards
        patientCount={dashboardData?.totalPatients}
        drCount={dashboardData?.totalDRReports}
        glaucomaCount={dashboardData?.totalGlaucomaReports}
        armdCount={dashboardData?.totalArmdReports}
      />
      <DRChart />
      <GlaucomaChart />
      <ARMDChart />
    </div>
  );
};

export default Metrics;
