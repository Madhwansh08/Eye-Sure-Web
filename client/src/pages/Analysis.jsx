import React, { useEffect, useState, useRef } from "react";
import Header from "../components/common/Header";
import AnnotationToolBar from "../components/analysis/AnnotationToolBar";
import ImageToolBar from "../components/analysis/ImageToolBar";
import KonvaCanvas from "../components/analysis/KonvaCanvas";
import { FiArrowLeft, FiArrowRight, FiDownload } from "react-icons/fi";
import Draggable from "react-draggable";
import axios from "axios";
import icon from "../assets/aiicon.gif";
import { AiFillOpenAI } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/config";
import SemiCircle from "../components/analysis/SemiCircle";
import { useDispatch, useSelector } from "react-redux";
import { initReportState, setTool } from "../redux/slices/annotationSlice";
import store from "../redux/store";
import { toast } from "react-toastify";
import PatientHistoryTable from "../components/analysis/PatientHistoryTable";
import { handleDownloadPDF } from "../components/analysis/Report"; // Import the handleDownloadPDF function

const Analysis = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [toolbarMode, setToolbarMode] = useState("image");
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    negative: false,
    zoom: 1,
  });
  const [resetPanTrigger, setResetPanTrigger] = useState(0);
  const [note, setNote] = useState("");

  // Read current tool from Redux (default is null)
  const currentTool = useSelector((state) => {
    const data = state.annotation.byReportId[reportId];
    return data?.currentTool;
  });

  const toggleButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const downloadReportRef = useRef(null); // Add reference for download report button

  const [patientHistory, setPatientHistory] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/report/${reportId}`, {
          withCredentials: true,
        });
        setReport(response.data.report);
        setPatient(response.data.patient);
        dispatch(
          initReportState({
            reportId,
            leftAnnotations:
              response.data.report.leftFundusAnnotationCoordinates || [],
            rightAnnotations:
              response.data.report.rightFundusAnnotationCoordinates || [],
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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/patient/${report.patientId}/history`,
          {
            withCredentials: true,
          }
        );
        setPatientHistory(response.data.history);
      } catch (error) {
        console.error("Error fetching patient history:", error);
      }
    };
    if (patient) {
      fetchHistory();
    }
  }, [patient]);

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
    { side: "right", src: report?.rightFundusImage },
  ].filter((item) => item.src);

  const toggleToolbar = () => {
    if (toolbarMode === "annotation") {
      // When switching to image toolbar, clear the active tool.
      dispatch(setTool({ reportId, tool: null }));
      setToolbarMode("image");
    } else {
      dispatch(setTool({ reportId, tool: null }));
      setToolbarMode("annotation");
    }
  };

  const handleSetTool = (tool) => {
    dispatch(setTool({ reportId, tool }));
  };

  const goPrev = () => {
    setCarouselIndex(
      (prev) => (prev - 1 + imagesData.length) % imagesData.length
    );
  };

  const goNext = () => {
    setCarouselIndex((prev) => (prev + 1) % imagesData.length);
  };

  const handleResetPan = () => {
    setResetPanTrigger((prev) => prev + 1);
  };

  const handleSaveAnnotations = async () => {
    try {
      const state = store.getState().annotation;
      const data = state.byReportId[reportId];
      const payload = {
        leftFundusAnnotationCoordinates: data.leftImageAnnotations,
        rightFundusAnnotationCoordinates: data.rightImageAnnotations,
      };
      const response = await axios.patch(
        `${API_URL}/api/report/${reportId}/annotations`,
        payload,
        {
          withCredentials: true,
        }
      );
      toast.success("Annotations saved successfully!");
    } catch (error) {
      toast.error("Failed to save annotations");
      alert("Failed to save annotations");
    }
  };

  const handleExplainableAI = () => {
    navigate(`/explainable/${reportId}`);
  };

  const handleSubmitNote = async () => {
    try {
      const payload = { note };
      const response = await axios.patch(
        `${API_URL}/api/report/${reportId}/note`,
        payload,
        { withCredentials: true }
      );
      toast.success("Note updated successfully!");
      // Optionally update the report state if needed:
      setReport(response.data.report);
      setNote(""); // Clear the note after successful update
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleDownloadReport = () => {
    handleDownloadPDF(patient, report);
    console.log("patient", patient);
  };

  // Determine the label to show above the canvas based on current image side.
  const currentSideLabel =
    imagesData[carouselIndex]?.side === "left" ? "Left Eye" : "Right Eye";

    console.log("Report", report);

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
        <ImageToolBar
          onToggle={toggleToolbar}
          onAdjust={setAdjustments}
          onResetPan={handleResetPan}
        />
      )}
      {/* <Draggable nodeRef={toggleButtonRef}> */}
      <button
        ref={toggleButtonRef}
        onClick={handleExplainableAI}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg text-primary border border-[#5c60c6] hover:bg-hover-ai transition flex items-center bg-animated-ai hover:cursor-pointer"
      >
        <img src={icon} alt="AI" className="w-10 h-10 grayscale-[100]" />
      </button>
      {/* </Draggable> */}
      <div className="flex flex-row flex-1 p-8 space-x-8">
        {/* Left Column: Patient Demographics & History */}
        <div className="flex-1 bg-primary p-4 rounded-b-xl rounded-t-xl shadow overflow-auto">
          <h2 className="text-3xl gradient-text font-semibold mt-10">
            Patient Demographics
          </h2>
          <p className="mt-4 text-lg text-secondary">ID: {report.patientId}</p>
          <p className="mt-2 text-lg text-secondary">Name: {patient.name}</p>
          <p className="mt-2 text-lg text-secondary">Age: {patient.age}</p>
          <p className="mt-2 text-lg text-secondary">
            Gender: {patient.gender}
          </p>
          <p className="mt-2 text-lg text-secondary">
            Location: {patient.location || "Not Available"}
          </p>

          <div className="mt-10">
            <PatientHistoryTable patientHistory={patientHistory} />
          </div>

          <div className="mt-5 bottom-20">
            {/* <h2 className="text-3xl gradient-text font-semibold mb-2">Note</h2> */}
            <textarea
              id="note"
              className="w-full border-2 border-[#387AA4] text-secondary rounded-lg px-4 pt-6 pr-16 focus:outline-none bg-transparent"
              value={note}
              placeholder="Add Note"
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
            <button
              onClick={handleSubmitNote}
              className=" mt-2 bg-[#387AA4] text-white px-4 py-1 rounded-full hover:bg-[#4a4f9c] transition"
            >
              Submit
            </button>
          </div>
        </div>
        {/* Middle Column: Konva Canvas + Carousel */}
        <div className="flex-1 bg-primary p-4 rounded shadow flex flex-col items-center justify-center">
          {/* Label above the canvas */}
          <h3 className="text-secondary font-semibold uppercase text-xl ">
            {currentSideLabel}
          </h3>
          {imagesData.length > 0 ? (
            <div
              className="relative"
              style={{ width: "800px", height: "800px" }}
            >
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
        {/* Right Column: Analysis Details */}
        <div className="flex-1 bg-primary p-4 h-screen  rounded shadow flex flex-col items-center overflow-auto">
          <h2 className="text-4xl mt-10 gradient-text font-bold mb-20 text-center">
            Analysis Results
          </h2>
          {report.analysisType === "DR" ? (
            <div className="text-secondary text-center">
              <div className="text-3xl font-bold bg-primary rounded-3xl uppercase">
                Left Fundus
              </div>
              <h1 className="text-2xl gradient-text border border-[#5c60c6] rounded-xl px-3 py-1 font-semibold mt-5">
                {report.leftFundusPrediction?.primary_classification
                  ?.class_name || "N/A"}
              </h1>
              <div className="flex justify-center mt-2">
                <SemiCircle
                  classNameDR={
                    report.leftFundusPrediction?.sub_classes?.class_name
                  }
                />
              </div>
              <div className="text-3xl font-bold bg-primary  rounded-3xl uppercase mt-16">
                Right Fundus
              </div>
              <h1 className="text-2xl gradient-text border border-[#5c60c6] rounded-xl px-3 py-1 font-semibold mt-5">
                {report.rightFundusPrediction?.primary_classification
                  ?.class_name || "N/A"}
              </h1>
              <div className="flex justify-center mt-2">
                <SemiCircle
                  classNameDR={
                    report.rightFundusPrediction?.sub_classes?.class_name
                  }
                />
              </div>
            </div>
          ) : report.analysisType === "Glaucoma" ? (
            <div className="text-secondary text-center">
              <div className="text-3xl font-bold bg-primary uppercase">
                Left Fundus
              </div>
              <div className="flex justify-center mt-2 ">
                <SemiCircle
                  classNameGlaucoma={report.contorLeftGlaucomaStatus || "N/A"}
                />
              </div>
              <h1 className="text-xl gradient-text uppercase border border-[#5c60c6] px-3 py-1 rounded-xl font-semibold mt-5">
                {report.contorLeftGlaucomaStatus || "N/A"}
              </h1>

              <div className="text-3xl font-bold bg-primary uppercase mt-16">
                Right Fundus
              </div>
              <div className="flex justify-center mt-2">
                <SemiCircle
                  classNameGlaucoma={ report.contorRightGlaucomaStatus || "N/A"}
                />
              </div>
              <h1 className="text-xl gradient-text uppercase border-1 border-[#5c60c6] rounded-xl px-3 py-1 font-semibold mt-5">
                {report.contorRightGlaucomaStatus || "N/A"}
              </h1>
            </div>
          ) : report.analysisType === "Armd" ? (
            <div className="text-secondary text-center">
              {/* Left Fundus ARMD */}
              <div className="text-3xl font-bold bg-primary uppercase">
                Left Fundus ARMD
              </div>
              <h1 className="text-2xl gradient-text border border-[#5c60c6] rounded-xl px-3 py-1  font-semibold mt-5">
                {typeof report.leftFundusArmdPrediction === "string"
                  ? report.leftFundusArmdPrediction === "1"
                    ? "ARMD Detected"
                    : "No ARMD Detected"
                  : "N/A"}
              </h1>

              {/* Right Fundus ARMD */}
              <div className="text-3xl font-bold bg-primary uppercase mt-16">
                Right Fundus ARMD
              </div>
              <h1 className="text-2xl gradient-text border border-[#5c60c6] rounded-xl px-3 py-1  font-semibold mt-5">
                {typeof report.rightFundusArmdPrediction === "string"
                  ? report.rightFundusArmdPrediction === "1"
                    ? "ARMD Detected"
                    : "No ARMD Detected"
                  : "N/A"}
              </h1>
            </div>
          ) : (
            <p className="text-secondary">Analysis type unknown.</p>
          )}
        </div>
      </div>
      <Draggable nodeRef={downloadReportRef}>
        <button
          ref={downloadReportRef}
          onClick={handleDownloadReport} 
          className="fixed bottom-4 right-30 z-50 p-3 bg-primary rounded-full shadow-lg text-primary border border-[#387AA4] hover:bg-gray-200 transition flex items-center hover:cursor-pointer"
        >
          <FiDownload size={24} />
        </button>
      </Draggable>
      <Draggable nodeRef={backButtonRef}>
        <button
          ref={backButtonRef}
          onClick={() => navigate(-1)}
          className="fixed bottom-4 left-4 z-50 p-3 bg-primary rounded-full shadow-lg text-primary border border-[#387AA4] hover:bg-gray-200 transition flex items-center hover:cursor-pointer"
        >
          <FiArrowLeft size={24} />
        </button>
      </Draggable>
    </div>
  );
};

export default Analysis;