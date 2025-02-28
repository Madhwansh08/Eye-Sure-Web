// src/pages/Analysis.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import AnnotationToolBar from "../components/analysis/AnnotationToolBar";
import ImageToolBar from "../components/analysis/ImageToolBar";
import KonvaCanvas from "../components/analysis/KonvaCanvas";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import axios from "axios";
import { useParams } from "react-router-dom";
import API_URL from "../utils/config";

const Analysis = () => {
  const { reportId } = useParams();

  // Declare hooks unconditionally at the top level.
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [toolbarMode, setToolbarMode] = useState("annotation"); // "annotation" or "image"
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    negative: false,
    zoom: 1,
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/report/${reportId}`, {
          withCredentials: true,
        });
        setReport(response.data.report);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex flex-col bg-primary h-screen items-center justify-center">
        <Header />
        <p className="text-white text-2xl mt-8">Loading report...</p>
      </div>
    );
  }

  console.log(report);

  // Prepare images array for the carousel.
  const imagesData = [
    { side: "left", src: report?.leftFundusImage },
    { side: "right", src: report?.rightFundusImage },
  ].filter((item) => item.src);

  const toggleToolbar = () => {
    setToolbarMode((prev) => (prev === "annotation" ? "image" : "annotation"));
  };

  const goPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + imagesData.length) % imagesData.length);
  };

  const goNext = () => {
    setCarouselIndex((prev) => (prev + 1) % imagesData.length);
  };

  return (
    <div className="flex flex-col bg-primary h-screen overflow-hidden relative">
      <Header />
      {toolbarMode === "annotation" ? (
        <AnnotationToolBar onToggle={toggleToolbar} />
      ) : (
        <ImageToolBar onToggle={toggleToolbar} onAdjust={setAdjustments} />
      )}

      <div className="flex flex-row flex-1 p-8 space-x-8">
        {/* Left Column: Patient ID & Patient History */}
        <div className="flex-1 bg-primary p-4 rounded-b-xl rounded-t-xl shadow overflow-auto">
          <h2 className="text-3xl text-secondary font-bold mt-10">Patient ID</h2>
          <p className="mt-2 text-lg text-secondary">12345678</p>
          <div className="mt-10">
            <h3 className="text-3xl mt-5 font-semibold text-secondary">Patient History</h3>
            {/* ... your table as before ... */}
          </div>
        </div>

        {/* Middle Column: Konva Canvas + Carousel */}
        <div className="flex-1 bg-[#1b1b1b] p-4 rounded shadow flex flex-col items-center justify-center">
          {imagesData.length > 0 ? (
            <div className="relative" style={{ width: "800px", height: "800px" }}>
              <KonvaCanvas
                side={imagesData[carouselIndex].side}
                imageSrc={imagesData[carouselIndex].src}
                width={800}
                height={800}
                adjustments={adjustments}
              />
              {imagesData.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <FiArrowLeft size={24} />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <FiArrowRight size={24} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="flex items-center justify-center h-full text-white">
              No images available.
            </p>
          )}
        </div>

        {/* Right Column: Stacked Previews */}
        <div className="flex-1 bg-primary p-4 rounded shadow flex flex-col items-center overflow-auto">
          <h2 className="text-3xl mt-20 text-secondary font-bold mb-4">Analysis Results</h2>
          <div className="flex flex-col gap-4">
            {/* Make sure leftImage and rightImage are defined or handled appropriately */}
          </div>
          <p className="mt-4 text-lg text-secondary text-center">
            The images above show detailed analysis of the retina. Additional insights and recommendations will be provided after further evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
