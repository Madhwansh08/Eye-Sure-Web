// src/pages/Analysis.jsx
import React, { useEffect, useState, useRef } from "react";
import Header from "../components/common/Header";
import AnnotationToolBar from "../components/analysis/AnnotationToolBar";
import ImageToolBar from "../components/analysis/ImageToolBar";
import KonvaCanvas from "../components/analysis/KonvaCanvas";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Draggable from "react-draggable";
import axios from "axios";
import { AiFillOpenAI } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/config";
import SemiCircle from "../components/analysis/SemiCircle";

const Analysis = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // Report & Patient data
  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  // For image carousel
  const [carouselIndex, setCarouselIndex] = useState(0);
  // Toggle between annotation and image toolbars
  const [toolbarMode, setToolbarMode] = useState("annotation"); // "annotation" or "image"
  // Image adjustment settings for Konva canvas
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    negative: false,
    zoom: 1,
  });
  const [resetPanTrigger, setResetPanTrigger] = useState(0);
  const [note, setNote] = useState("");
  // Local annotation state per image (report-specific)
  const [leftAnnotations, setLeftAnnotations] = useState([]);
  const [rightAnnotations, setRightAnnotations] = useState([]);
  // Local state for the current drawing tool (rectangle, oval, point)
  const [currentTool, setCurrentTool] = useState("rectangle");

  // Refs for draggable floating buttons
  const toggleButtonRef = useRef(null);
  const backButtonRef = useRef(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/report/${reportId}`, {
          withCredentials: true,
        });
        setReport(response.data.report);
        setPatient(response.data.patient);
        // Initialize annotation arrays if they exist; else, remain empty.
        setLeftAnnotations(response.data.report.leftFundusAnnotationCoordinates || []);
        setRightAnnotations(response.data.report.rightFundusAnnotationCoordinates || []);
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

  // Prepare images array for the carousel
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

  const handleResetPan = () => {
    setResetPanTrigger((prev) => prev + 1);
  };

  // API call to update the annotation coordinates with labels for the current report.
  const handleSaveAnnotations = async () => {
    try {
      const payload = {
        leftFundusAnnotationCoordinates: leftAnnotations,
        rightFundusAnnotationCoordinates: rightAnnotations,
      };
      const response = await axios.patch(
        `${API_URL}/api/report/${reportId}/annotations`,
        payload,
        { withCredentials: true }
      );
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

console.log("Right annotations" , rightAnnotations);
console.log("Left annotations" , leftAnnotations);



  return (
    <div className="flex flex-col bg-primary h-screen overflow-hidden relative">
      <Header />

      {toolbarMode === "annotation" ? (
        <AnnotationToolBar
          onToggle={toggleToolbar}
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          onSaveAnnotations={handleSaveAnnotations}
        />
      ) : (
        <ImageToolBar
          onToggle={toggleToolbar}
          onAdjust={setAdjustments}
          onResetPan={handleResetPan}
        />
      )}

      <Draggable nodeRef={toggleButtonRef}>
        <button
          ref={toggleButtonRef}
          onClick={handleExplainableAI}
          className="fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg text-primary border border-[#5c60c6] hover:bg-hover-ai transition flex items-center bg-animated-ai"
        >
          <AiFillOpenAI size={28} className="text-white" />
        </button>
      </Draggable>

      <div className="flex flex-row flex-1 p-8 space-x-8">
        {/* Left Column: Patient Demographics & History */}
        <div className="flex-1 bg-primary p-4 rounded-b-xl rounded-t-xl shadow overflow-auto">
          <h2 className="text-3xl gradient-text font-semibold mt-10">Patient Demographics</h2>
          <p className="mt-4 text-lg text-secondary">ID: {report.patientId}</p>
          <p className="mt-2 text-lg text-secondary">Name: {patient.name}</p>
          <p className="mt-2 text-lg text-secondary">Age: {patient.age}</p>
          <p className="mt-2 text-lg text-secondary">Gender: {patient.gender}</p>
          <p className="mt-2 text-lg text-secondary">City: {patient.city}</p>

          <div className="mt-10">
            <h3 className="text-3xl mt-5 font-semibold gradient-text">Patient History</h3>
            <table className="w-full mt-4 text-secondary border-collapse border border-gray-500">
              <thead>
                <tr className="bg-primary text-secondary">
                  <th className="p-2 border border-gray-500">Date</th>
                  <th className="p-2 border border-gray-500">Diagnosis</th>
                  <th className="p-2 border border-gray-500">Treatment</th>
                  <th className="p-2 border border-gray-500">Doctor</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index} className="bg-primary text-secondary">
                    <td className="p-2 border border-gray-500">2023-12-0{index + 1}</td>
                    <td className="p-2 border border-gray-500">Condition {index + 1}</td>
                    <td className="p-2 border border-gray-500">Medication {index + 1}</td>
                    <td className="p-2 border border-gray-500">Dr. Smith</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 relative">
            <textarea
              id="note"
              className="w-full border-2 border-[#5c60c6] text-secondary rounded-lg px-4 pt-6 pr-16 focus:outline-none bg-transparent"
              value={note}
              placeholder="Enter Note here"
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
            <button
              onClick={() => {
                console.log("Note Submitted:", note);
                setNote("");
              }}
              className="absolute right-2 bottom-2 mb-1 bg-[#5c60c6] text-white px-4 py-1 rounded-full hover:bg-[#4a4f9c] transition"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Middle Column: Konva Canvas + Carousel */}
        <div className="flex-1 bg-primary p-4 rounded shadow flex flex-col items-center justify-center">
          {imagesData.length > 0 ? (
            <div className="relative" style={{ width: "800px", height: "800px" }}>
              <KonvaCanvas
                side={imagesData[carouselIndex].side}
                imageSrc={imagesData[carouselIndex].src}
                width={800}
                height={800}
                adjustments={adjustments}
                resetPanTrigger={resetPanTrigger}
                currentTool={currentTool}
                // Pass the annotation state and setter based on side of image.
                annotations={
                  imagesData[carouselIndex].side === "left"
                    ? leftAnnotations
                    : rightAnnotations
                }
                setAnnotations={
                  imagesData[carouselIndex].side === "left"
                    ? setLeftAnnotations
                    : setRightAnnotations
                }
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

        {/* Right Column: Analysis Details */}
        <div className="flex-1 bg-primary p-4 h-screen rounded shadow flex flex-col items-center overflow-auto">
          <h2 className="text-3xl mt-10 gradient-text font-bold mb-8">Analysis Results</h2>
          {report.analysisType === "DR" ? (
            <div className="text-secondary text-center">
              <div className="text-3xl font-bold bg-primary border-2 border-[#5c60c6] rounded-3xl uppercase">
                Left Fundus
              </div>
              <h1 className="text-4xl gradient-text font-semibold mt-5">
                {report.leftFundusPrediction?.predictions?.primary_classification?.class_name || "N/A"}
              </h1>
              <div className="flex justify-center mt-2">
                <SemiCircle
                  percentage={
                    (report.leftFundusPrediction?.predictions?.primary_classification?.accuracy * 100).toFixed(2) || "0"
                  }
                />
              </div>
              <h1 className="text-2xl font-semibold text-secondary mt-2">
                {report.leftFundusPrediction?.predictions?.sub_classes?.class_name || "N/A"}
              </h1>
              <div className="flex justify-center mt-2">
                <SemiCircle
                  percentage={
                    (report.leftFundusPrediction?.predictions?.sub_classes?.accuracy * 100).toFixed(2) || "0"
                  }
                />
              </div>
              <div className="text-3xl font-bold bg-primary border-2 border-[#5c60c6] rounded-3xl uppercase mt-10">
                Right Fundus
              </div>
              <h1 className="text-4xl gradient-text font-semibold mt-5">
                {report.rightFundusPrediction?.predictions?.primary_classification?.class_name || "N/A"}
              </h1>
              <div className="flex justify-center mt-2">
                <SemiCircle
                  percentage={
                    (report.rightFundusPrediction?.predictions?.primary_classification?.accuracy * 100).toFixed(2) || "0"
                  }
                />
              </div>
              <h1 className="text-2xl font-semibold text-secondary mt-2">
                {report.rightFundusPrediction?.predictions?.sub_classes?.class_name || "N/A"}
              </h1>
              <div className="flex justify-center mt-2">
                <SemiCircle
                  percentage={
                    (report.rightFundusPrediction?.predictions?.sub_classes?.accuracy * 100).toFixed(2) || "0"
                  }
                />
              </div>
            </div>
          ) : report.analysisType === "Glaucoma" ? (
            <div className="text-secondary text-center">
              <div className="text-3xl font-bold bg-primary border-2 border-[#5c60c6] rounded-3xl uppercase">
                Left Fundus
              </div>
              <h1 className="text-2xl gradient-text uppercase font-semibold mt-5">
                {report.contorLeftGlaucomaStatus || "N/A"}
              </h1>
              <div className="flex justify-center mt-2">
                <SemiCircle percentage={(report.contorLeftVCDR * 100).toFixed(2) || "0"} />
              </div>
              <div className="text-3xl font-bold bg-primary border-2 border-[#5c60c6] rounded-3xl uppercase mt-10">
                Right Fundus
              </div>
              <h1 className="text-2xl gradient-text uppercase font-semibold mt-5">
                {report.contorRightGlaucomaStatus || "N/A"}
              </h1>
              <div className="flex justify-center mt-2">
                <SemiCircle percentage={(report.contorRightVCDR * 100).toFixed(2) || "0"} />
              </div>
            </div>
          ) : report.analysisType === "Armd" ? (
            <div className="text-secondary text-center">
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
            <p className="text-secondary">Analysis type unknown.</p>
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

export default Analysis;
