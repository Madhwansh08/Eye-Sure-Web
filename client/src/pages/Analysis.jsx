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
  const [patient , setPatient]=useState(null)
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
  const [resetPanTrigger , setResetPanTrigger] = useState(0)
  const [note , setNote]=useState("")
  const [selectedImage , setSelectedImage]=useState(null) 

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/report/${reportId}`, {
          withCredentials: true,
        });
        setReport(response.data.report);
        setPatient(response.data.patient)
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



  console.log(report)

  if (loading) {
    return (
      <div className="flex flex-col bg-primary h-screen items-center justify-center">
        <Header />
        <p className="text-white text-2xl mt-8">Loading report...</p>
      </div>
    );
  }





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

  const handleResetPan=()=>{
    setResetPanTrigger((prev)=>prev+1)
  }

  const handleNoteSubmit=()=>{
    console.log("Note Submitted" , note)
    setNote("")
  }

  const images = [
    {
      src: report?.explainableAiLeftFundusImage,
      alt: "Left Image",
      text: "Left Fundus Image",
    },
    {
      src: report?.explainableAiRightFundusImage,
      alt: "Right Image",
      text: "Right Fundus Image",
    },
    {
      src: report?.contorLeftFundusImage,
      alt: "Left Contour",
      text: "Left Contour Image",
    },
    {
      src: report?.contorRightFundusImage,
      alt: "Right Contour",
      text: "Right Contour Image",
    },
    {
      src: report?.leftEyeClahe,
      alt: "Left Clahe",
      text: "Left Eye Clahe",
    }
    ,
    {
      src: report?.rightEyeClahe,
      alt: "Right Clahe",
      text: "Right Eye Clahe",
    }
    
  ];





  return (
    <div className="flex flex-col bg-primary h-screen overflow-hidden relative">
      <Header />
      {toolbarMode === "annotation" ? (
        <AnnotationToolBar onToggle={toggleToolbar} />
      ) : (
        <ImageToolBar onToggle={toggleToolbar} onAdjust={setAdjustments} onResetPan={handleResetPan} />
      )}

      <div className="flex flex-row flex-1 p-8 space-x-8">
        {/* Left Column: Patient ID & Patient History */}
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
    onClick={handleNoteSubmit}
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
      <h2 className="text-3xl mt-20 gradient-text font-bold mb-8">Explainable AI</h2>

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((item, index) => (
          <div
            key={index}
            className="rounded-lg shadow overflow-hidden flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedImage(item)}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-40 h-40 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-300 mt-2">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative p-4">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
            <p className="text-center text-white mt-4">{selectedImage.text}</p>
          </div>
        </div>
      )}
      </div>

      </div>
    </div>
  );
};

export default Analysis;
