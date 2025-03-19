import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import API_URL from "../../utils/config";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

// Utility function to format the date as "10th March 2025"
function formatDateLong(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = date.getDate();
  const year = date.getFullYear();
  let suffix = "th";
  if (day % 10 === 1 && day !== 11) suffix = "st";
  else if (day % 10 === 2 && day !== 12) suffix = "nd";
  else if (day % 10 === 3 && day !== 13) suffix = "rd";
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[date.getMonth()];
  return `${day}${suffix} ${monthName} ${year}`;
}

const RecentReportsDrawer = ({ isOpen, onClose }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const fetchReports = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}/api/report/recent/reports`, {
            withCredentials: true,
          });
          setReports(response.data.reports);
        } catch (error) {
          console.error("Error fetching recent reports:", error);
          toast.error("Failed to fetch recent reports");
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    }
  }, [isOpen]);

  const handleRowClick = (reportId) => {
    onClose();
    navigate(`/analysis/${reportId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 bg-primary/60 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-1/2 max-w-4xl bg-primary shadow-lg z-50 overflow-y-auto"
      >
        <div className="p-8 flex justify-between items-center border-b">
          <h3 className="text-xl font-bold">Recent Reports</h3>
          <button onClick={onClose} className="text-secondary hover:text-gray-800">
            <IoMdClose size={28} />
          </button>
        </div>
        <div className="p-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-primary">
                <tr>
                  <th className="px-4 py-2 border border-gray-500 text-left text-lg font-semibold text-secondary">
                    Report ID
                  </th>
                  <th className="px-4 py-2 border border-gray-500 text-left text-lg font-semibold text-secondary">
                    Created At
                  </th>
                  <th className="px-4 py-2 border border-gray-500 text-left text-lg font-semibold text-secondary">
                    Analysis Type
                  </th>
                  <th className="px-4 py-2 border border-gray-500 text-left text-lg font-semibold text-secondary">
                    Left Image
                  </th>
                  <th className="px-4 py-2 border border-gray-500 text-left text-lg font-semibold text-secondary">
                    Right Image
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report._id}
                    className="hover:bg-[#387AA4] cursor-pointer"
                    onClick={() => handleRowClick(report._id)}
                  >
                    <td className="px-4 py-2 border text-sm text-secondary">
                      {report._id}
                    </td>
                    <td className="px-4 py-2 border text-sm text-secondary">
                      {formatDateLong(report.createdAt)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-secondary">
                      {report.analysisType}
                    </td>
                    <td className="px-4 py-2 border text-sm text-secondary">
                      <img
                        src={report.leftFundusImage}
                        alt="Left"
                        className="w-20 h-20 object-contain"
                      />
                    </td>
                    <td className="px-4 py-2 border text-sm text-secondary">
                      <img
                        src={report.rightFundusImage}
                        alt="Right"
                        className="w-20 h-20 object-contain"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecentReportsDrawer;
