import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/logo.png";

export const handleDownloadPDF = (patient, report, user) => {
  // console.log("Patient1: ", patient);
  // console.log("Report1: ", report);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const addLogo = () => {
    doc.addImage(logo, "PNG", 12, 4, 59, 20);
  };

  addLogo();

  // Set Font for Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 128);

  // Starting coordinates
  let x = 10;
  let y = 36;
  const pageHeight = doc.internal.pageSize.getHeight();

  // Function to add new page if content exceeds page size
  const checkYPosition = (height) => {
    if (y + height > pageHeight - 30) {
      // leave space for disclaimer
      doc.addPage();
      addLogo();
      y = 36; // reset y position with some top margin
      x = 10; // reset x position if needed
    }
  };
  y -= 5;
  // ----------------- Report Title -----------------
  doc.text("Fundus Medical Report", 105, y, { align: "center" });
  y += 4;

  // Add Header Divider (Centered)
  doc.setDrawColor(0, 0, 128);
  doc.setLineWidth(0.1);
  doc.line(10, y + 1, doc.internal.pageSize.getWidth() - 10, y + 1);
  y += 10;

  // ----------------- Patient Details Section -----------------
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT DETAILS", x, y);
  doc.setDrawColor(0, 0, 128);
  doc.setLineWidth(0.025); // Thin line
  doc.line(x, y + 1, x + 37, y + 1);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // Patient Name
  doc.text("PATIENT NAME:", 10, y);
  doc.setFont("helvetica", "normal");
  doc.text(patient.name || "N/A", 40, y);

  y += 6;

  // Patient ID
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT ID:", 10, y);
  doc.setFont("helvetica", "normal");
  doc.text(patient._id || "N/A", 40, y);

  y += 6;

  // Gender
  doc.setFont("helvetica", "bold");
  doc.text("GENDER:", 10, y);
  doc.setFont("helvetica", "normal");
  doc.text(patient.gender || "N/A", 40, y);

  y += 6;

  // Age
  doc.setFont("helvetica", "bold");
  doc.text("AGE:", 10, y);
  doc.setFont("helvetica", "normal");
  doc.text(patient.age.toString() || "N/A", 40, y);

  y += 6;

  // Location
  doc.setFont("helvetica", "bold");
  doc.text("LOCATION:", 10, y);
  doc.setFont("helvetica", "normal");
  doc.text(patient.location || "N/A", 40, y);

  const rightX = 110;
  let yRight = y - 30;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);

  yRight += 6;

  // Date of Examination
  doc.text("DATE OF EXAMINATION:", rightX, yRight);
  doc.setFont("helvetica", "normal");
  doc.text(
    report.createdAt
      ? new Date(report.createdAt).toLocaleDateString()
      : "N/A",
    rightX + 45,
    yRight
  );

  yRight += 6;

  // OPHTHALMOLOGIST
  doc.setFont("helvetica", "bold");
  doc.text("OPHTHALMOLOGIST:", rightX, yRight);
  doc.setFont("helvetica", "normal");
  doc.text(user || "N/A", rightX + 45, yRight);

  yRight += 6;

  doc.setFont("helvetica", "bold");
  doc.text("EXAMINATION TYPE:", rightX, yRight);
  doc.setFont("helvetica", "normal");
  doc.text("Retina", rightX + 45, yRight);
  yRight += 6;

  // Body Part Examined
  doc.setFont("helvetica", "bold");
  doc.text("BODY PART EXAMINED:", rightX, yRight);
  doc.setFont("helvetica", "normal");
  doc.text("Eyes", rightX + 45, yRight);
  yRight += 6;

  y = Math.max(y, yRight) + 10;
  // ----------------- Transformed Image Section -----------------
  // checkYPosition(200);
  doc.setDrawColor(0, 0, 128);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 128);
  doc.text("AI-Screening Summary", x, y);
  doc.setLineWidth(0.025); // Thin line
  doc.line(x, y + 1, x + 47, y + 1);
  y += 14;


  y += 36;
  // Abnormalities Found
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("Left Eye:", 10, y);
  doc.setFontSize(10);
  y += 7;
  let leftName = report?.analysisType === "DR" ? (report?.leftFundusPrediction?.primary_classification?.class_name) : (report?.analysisType === "Glaucoma") ? report?.contorLeftGlaucomaStatus
    : (report?.leftFundusArmdPrediction == 1 ? "ARMD detected" : "ARMD not detected");

  // Define the maximum width for the text
  const maxWidth = 40; // Adjust this value based on your page width
  let ynew=y;
  // Split the text if it is too long
  if (doc.getTextWidth("Result: " + leftName) > maxWidth) {
    // Split the text into multiple lines
    const leftNameLines = doc.splitTextToSize("Result: " + leftName, maxWidth);

    // Print each line
    leftNameLines.forEach(line => {
      doc.text(line || "N/A", 10, ynew);
      ynew += 7;
    });
  } else {
    doc.text("Result: " + leftName || "N/A", 10, ynew);
    ynew += 7;
  }

  y += 60;
  checkYPosition(10);

  y += 15;
  // Abnormalities Found
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("Right Eye :", 10, y);
  y += 7;
  doc.setFontSize(10);
  let rightName = report?.analysisType === "DR" ? (report?.rightFundusPrediction?.primary_classification?.class_name) : (report?.analysisType === "Glaucoma") ? report?.contorRightGlaucomaStatus
    : (report?.rightFundusArmdPrediction == 1 ? "ARMD detected" : "ARMD not detected");
  
  ynew = y;  
  // Split the text if it is too long
  if (doc.getTextWidth("Result: " + rightName) > maxWidth) {
    // Split the text into multiple lines
    const rightNameLines = doc.splitTextToSize("Result: " + rightName, maxWidth);

    // Print each line
    rightNameLines.forEach(line => {
      doc.text(line || "N/A", 10, ynew);
      ynew += 7;
    });
  } else {
    doc.text("Result: " + rightName || "N/A", 10, ynew);
    ynew += 7;
  }
  y -= 15;
  y -= 110;
  x += 43;
  // Draw border for image placeholder
  doc.setDrawColor(0, 0, 0);
  doc.rect(x, y, 75, 75);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // Load and add the transformed image
  const transformedImg1 = new Image();
  transformedImg1.crossOrigin = "anonymous";
  transformedImg1.src = report?.leftFundusImage;
  transformedImg1.onload = () => {
    doc.addImage(transformedImg1, "PNG", x, y, 75, 75);
    doc.setFontSize(12);
    doc.text("Left Eye", x, y - 2);

    // Draw border for transformed image
    doc.setDrawColor(0, 0, 0);
    doc.rect(x + 77, y, 75, 75);

    // Load and add the transformed image2
    const transformedImg2 = new Image();
    transformedImg2.crossOrigin = "anonymous";
    transformedImg2.src = report?.leftEyeClahe;
    transformedImg2.onload = () => {
      doc.addImage(transformedImg2, "PNG", x + 77, y, 75, 75);
      doc.text("Clahe", x + 80, y - 2);

      // Draw border for transformed image
      doc.setDrawColor(0, 0, 0);
      doc.rect(x + 77, y, 75, 75);

      y += 82;

      //second row
      // Draw border for image placeholder
      doc.setDrawColor(0, 0, 0);
      doc.rect(x, y, 75, 75);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      // Load and add the transformed image
      const transformedImg3 = new Image();
      transformedImg3.crossOrigin = "anonymous";
      transformedImg3.src = report?.rightFundusImage;
      transformedImg3.onload = () => {
        doc.addImage(transformedImg3, "PNG", x, y, 75, 75);
        doc.setFontSize(12);
        doc.text("Right Eye", x, y - 2);

        // Draw border for transformed image
        doc.setDrawColor(0, 0, 0);
        doc.rect(x + 77, y, 75, 75);

        // Load and add the transformed image2
        const transformedImg4 = new Image();
        transformedImg4.crossOrigin = "anonymous";
        transformedImg4.src = report?.rightEyeClahe;
        transformedImg4.onload = () => {
          doc.addImage(transformedImg4, "PNG", x + 77, y, 75, 75);
          doc.text("Clahe", x + 80, y - 2);

          // Draw border for transformed image
          doc.setDrawColor(0, 0, 0);
          doc.rect(x + 77, y, 75, 75);

          y += 90;
          x -= 17;
          x += 13;

          y += 10;
          checkYPosition(200);

          // ----------------- Doctors Notes -----------------
          doc.setDrawColor(0, 0, 128);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 128);
          doc.text("Recommendation", x, y);
          doc.setDrawColor(0, 0, 128);
          doc.setLineWidth(0.025); // Thin line
          doc.line(x, y + 1, x + 36, y + 1);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          y += 7;
          doc.setFontSize(10);
          doc.text(report?.note || "N/A", 30, y);
          doc.setFont("helvetica", "normal");
          y += 15;
          checkYPosition(15);

          y += pageHeight - 105;

          doc.setLineWidth(0.025); // Thin line
          doc.line(x, y, doc.internal.pageSize.getWidth() - x, y);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.text("*** End of Report ***", 105, y + 5, {
            align: "center",
          });

          y += 15;
          // Dotted underline for signature
          doc.setLineDash([1, 1], 0);
          doc.line(x, y, x + 50, y);
          y += 10;

          // Doctor's name and designation
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(user , x, y);
          y += 7;
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text("(MD,Opthalmologist)", x, y);

          // Save the PDF
          doc.save(`Fundus-Report.pdf`);
        };
      };
    };
  };


  // ----------------- Disclaimer Section -----------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Disclaimer", 105, pageHeight - 30, { align: "center" });
  doc.setLineWidth(0.025); // Thin line
  doc.line(
    55,
    pageHeight - 29,
    doc.internal.pageSize.getWidth() - 55,
    pageHeight - 29
  );
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This report is generated as a collaborative effort between AI analysis and a qualified radiologist. The findings are to be used for diagnostic purposes in consultation with a licensed physician.",
    105,
    pageHeight - 25,
    { align: "center", maxWidth: 190 }
  );

};

const DownloadReport = ({ patient, report }) => {
  return (
    <div>
      <button
        onClick={() => handleDownloadPDF(patient, report, user)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Report
      </button>
    </div>
  );
};

export default DownloadReport;