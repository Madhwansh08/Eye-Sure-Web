// src/pages/Analysis.jsx
import React, { useEffect, useState, useRef } from "react";
import Header from "../components/common/Header";
import AnnotationToolBar from "../components/analysis/AnnotationToolBar";
import ImageToolBar from "../components/analysis/ImageToolBar";
import KonvaCanvas from "../components/analysis/KonvaCanvas";
import { FiArrowLeft, FiArrowRight, FiDownload } from "react-icons/fi";
import Draggable from "react-draggable";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/config";
import { useDispatch, useSelector } from "react-redux";
import { initReportState, setTool } from "../redux/slices/annotationSlice";
import store from "../redux/store";
import RgbToggles from "../components/explainable/RgbToggles";
import RightPanelToggle from "../components/explainable/RightPanelToggle";

const Explainable = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [toolbarMode, setToolbarMode] = useState("annotation");
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    negative: false,
    zoom: 1,
    rgbRed: 1,
    rgbGreen: 1,
    rgbBlue: 1
  });
  const [resetPanTrigger, setResetPanTrigger] = useState(0);
  const [rightPanelTab , setRightPanelTab]=useState("Explainable AI")

  // Read current tool from Redux (default is now null)
  const currentTool = useSelector((state) => {
    const data = state.annotation.byReportId[reportId];
    return data?.currentTool;
  });

  const toggleButtonRef = useRef(null);
  const backButtonRef = useRef(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/report/${reportId}`, {
          withCredentials: true
        });
        setReport(response.data.report);
        setPatient(response.data.patient);
        dispatch(
          initReportState({
            reportId,
            leftAnnotations: response.data.report.leftFundusAnnotationCoordinates || [],
            rightAnnotations: response.data.report.rightFundusAnnotationCoordinates || []
          })
        );
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
  }, [reportId, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col bg-primary h-screen items-center justify-center">
        <Header />
        <p className="text-white text-2xl mt-8">Loading report...</p>
      </div>
    );
  }

  const imagesData = [
    { side: "left", src: report?.leftFundusImage },
    { side: "right", src: report?.rightFundusImage }
  ].filter((item) => item.src);

  const toggleToolbar = () => {
    if (toolbarMode === "annotation") {
      // When switching to image toolbar, clear the active tool.
      dispatch(setTool({ reportId, tool: null }));
      setToolbarMode("image");
    } else {
      // When switching back, leave tool as null until user selects one.
      dispatch(setTool({ reportId, tool: null }));
      setToolbarMode("annotation");
    }
  };

  const handleSetTool = (tool) => {
    dispatch(setTool({ reportId, tool }));
  };

  const goPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + imagesData.length) % imagesData.length);
  };

  const goNext = () => {
    setCarouselIndex((prev) => (prev + 1) % imagesData.length);
  };

  const handleResetPan = () => {
    setResetPanTrigger((prev) => prev + 1);
  };

  const handleRGBChange = (channel, value) => {
    setAdjustments((prev) => ({
      ...prev,
      [channel]: parseFloat(value)
    }));
  };

  const handleSaveAnnotations = async () => {
    try {
      const state = store.getState().annotation;
      const data = state.byReportId[reportId];
      const payload = {
        leftFundusAnnotationCoordinates: data.leftImageAnnotations,
        rightFundusAnnotationCoordinates: data.rightImageAnnotations
      };
      const response = await axios.patch(`${API_URL}/api/report/${reportId}/annotations`, payload, {
        withCredentials: true
      });
      console.log("Annotations saved:", response.data);
      alert("Annotations saved successfully!");
    } catch (error) {
      console.error("Error saving annotations:", error);
      alert("Failed to save annotations");
    }
  };

  const handleExplainableAI = () => {
    navigate(`/explainable/${reportId}`);
  };

  const currentSideLabel = imagesData[carouselIndex]?.side === "left" ? "Left Eye" : "Right Eye";

  return (
    <div className="flex flex-col bg-primary h-screen overflow-hidden relative">
      <Header />
      {toolbarMode === "annotation" ? (
        <AnnotationToolBar
          onToggle={toggleToolbar}
          currentTool={currentTool}
          setCurrentTool={handleSetTool}
          onSaveAnnotations={handleSaveAnnotations}
          reportId={reportId}
        />
      ) : (
        <ImageToolBar onToggle={toggleToolbar} onAdjust={setAdjustments} onResetPan={handleResetPan} />
      )}
      <Draggable nodeRef={toggleButtonRef}>
        <button
          ref={toggleButtonRef}
          onClick={handleExplainableAI}
          className="fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg text-primary border border-[#5c60c6] hover:bg-hover-ai transition flex items-center bg-animated-ai"
        >
          <FiDownload size={28} className="text-white" />
        </button>
      </Draggable>
      <div className="flex flex-row flex-1 p-8 space-x-8">
        {/* Left Column: Patient Demographics & History */}
        <div className="flex-1 bg-primary p-4 rounded-b-xl rounded-t-xl shadow overflow-auto">
         <RgbToggles adjustments={adjustments} handleRGBChange={handleRGBChange}/>

        </div>

        {/* Middle Column: Image Canvas */}
        <div className="flex-1 bg-primary p-4 rounded shadow flex flex-col items-center justify-center">
        <h3 className="text-secondary font-semibold uppercase text-xl ">{currentSideLabel}</h3>
          {imagesData.length > 0 ? (
            <div className="relative" style={{ width: "800px", height: "800px" }}>
              <KonvaCanvas
                reportId={reportId}
                side={imagesData[carouselIndex].side}
                imageSrc={imagesData[carouselIndex].src}
                width={800}
                height={800}
                adjustments={adjustments}
                resetPanTrigger={resetPanTrigger}
                currentTool={currentTool}
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

        <div className="flex-1 bg-primary p-4 h-screen rounded shadow flex flex-col items-center overflow-auto">
          <div className="mt-10 pt-5">
          <RightPanelToggle activeTab={rightPanelTab} setActiveTab={setRightPanelTab} />
          </div>
          {rightPanelTab === "Clahe Images" ? (
            <div className="mt-6 w-full">
              <h3 className="text-xl font-semibold text-center gradient-text">CLAHE Images</h3>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {report.leftEyeClahe && (
                  <div className="flex flex-col items-center">
                    <img src={report.leftEyeClahe} alt="Left Eye Clahe" className="w-[50%] object-contain" />
                    <span className="text-secondary mt-1 text-lg font-semibold">Left Eye Clahe</span>
                  </div>
                )}
                {report.rightEyeClahe && (
                  <div className="flex flex-col items-center">
                    <img src={report.rightEyeClahe} alt="Right Eye Clahe" className="w-[50%] object-contain" />
                    <span className="text-secondary mt-1 text-lg font-semibold">Right Eye Clahe</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 w-full">
              <h2 className="text-3xl gradient-text font-bold mb-8 text-center">Explainable AI</h2>
              {report.analysisType === "DR" ? (
                <div className="flex flex-col items-center text-center text-secondary">
                  <div className="text-xl font-bold bg-primary  rounded-3xl uppercase px-3 py-1">
                    Smart Heatmap Left Eye
                  </div>
                  <img className="mt-5  object-contain" src={report.explainableAiLeftFundusImage} alt="Left Heatmap" />
                  <div className="text-xl font-bold bg-primary rounded-3xl uppercase mt-10 px-3 py-1">
                    Smart Heatmap Right Eye
                  </div>
                  <img className="mt-5  object-contain" src={report.explainableAiRightFundusImage} alt="Right Heatmap" />
                </div>
              ) : report.analysisType === "Glaucoma" ? (
                <div className="flex flex-col items-center text-center text-secondary">
                
                  <img className="  object-contain w-50"  src={report.contorLeftFundusImage} alt="Left Contour" />
                  <div className="text-xl font-bold mt-2 px-3 py-1">
                    Left Eye Heatmap
                  </div>
               
                  <img className="mt-2  object-contain w-50" src={report.contorRightFundusImage} alt="Right Contour" />
                  <div className="text-xl font-bold bg-primary mt-3 px-3 py-1">
                    Right Eye Heatmap
                  </div>
                </div>
              ) : report.analysisType === "Armd" ? (
                <div className="flex flex-col items-center text-center text-secondary">
                  <div className="text-3xl font-bold bg-primary border-2 border-[#5c60c6] rounded-3xl uppercase">
                    Left Fundus ARMD
                  </div>
                  <h1 className="text-4xl gradient-text font-semibold mt-5">
                    {report.leftFundusArmdPrediction || "N/A"}
                  </h1>
                  <div className="text-3xl font-bold bg-primary border-2 border-[#5c60c6] rounded-3xl uppercase mt-10">
                    Right Fundus ARMD
                  </div>
                  <h1 className="text-4xl gradient-text font-semibold mt-5">
                    {report.rightFundusArmdPrediction || "N/A"}
                  </h1>
                </div>
              ) : (
                <p className="text-secondary text-center">Analysis type unknown.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Draggable nodeRef={backButtonRef}>
        <button
          ref={backButtonRef}
          onClick={() => navigate(-1)}
          className="fixed bottom-4 left-4 z-50 p-3 bg-primary rounded-full shadow-lg text-primary border border-[#5c60c6] hover:bg-gray-200 transition flex items-center"
        >
          <FiArrowLeft size={24} />
        </button>
      </Draggable>
    </div>
  );
};

export default Explainable;
