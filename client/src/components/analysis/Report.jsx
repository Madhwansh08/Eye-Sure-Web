import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/logo.png";

const DownloadReport = ({ patient, report }) => {
  const handleDownloadPDF = () => {
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
      y += 7;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      // Patient Name
      doc.text("PATIENT NAME:", 10, y);
      doc.setFont("helvetica", "normal");

      y += 7;

      // Patient ID
      doc.setFont("helvetica", "bold");
      doc.text("PATIENT ID:", 10, y);
      doc.setFont("helvetica", "normal");

      y += 7;

      // Gender
      doc.setFont("helvetica", "bold");
      doc.text("GENDER:", 10, y);
      doc.setFont("helvetica", "normal");

      y += 7;

      // Age
      doc.setFont("helvetica", "bold");
      doc.text("AGE:", 10, y);
      doc.setFont("helvetica", "normal");

      y += 7;

      // Location
      doc.setFont("helvetica", "bold");
      doc.text("LOCATION:", 10, y);
      doc.setFont("helvetica", "normal");


      const rightX = 110;
      let yRight = y - 30; 
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);

      // Date of Examination
      doc.text("DATE OF EXAMINATION:", rightX, yRight);
      doc.setFont("helvetica", "normal");

      yRight += 10;

      // Referred Physician
      doc.setFont("helvetica", "bold");
      doc.text("REFERRED PHYSICIAN:", rightX, yRight);
      doc.setFont("helvetica", "normal");

      yRight += 7;

      // Radiologist
      doc.setFont("helvetica", "bold");
      doc.text("OPHTHALMOLOGIST:", rightX, yRight);
      doc.setFont("helvetica", "normal");

      yRight += 7;

      // Location
      doc.setFont("helvetica", "bold");
      doc.text("EXAMINATION TYPE:", rightX, yRight);
      doc.setFont("helvetica", "normal");
      doc.text("X-RAY", rightX + 45, yRight);
      yRight += 7;

      // Body Part Examined
      doc.setFont("helvetica", "bold");
      doc.text("BODY PART EXAMINED:", rightX, yRight);
      doc.setFont("helvetica", "normal");
      doc.text("Eyes", rightX + 45, yRight);
      yRight += 7;

      y = Math.max(y, yRight) + 10;

      // ----------------- Findings Section -----------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 128);
      doc.text("FINDINGS", x, y);
      doc.setDrawColor(0, 0, 128);
      doc.setLineWidth(0.025); // Thin line
      doc.line(x, y + 1, x + 20, y + 1);
      y += 14;

      x += 13;
      // Abnormalities Found
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Abnormalities Found:", x, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);


      y += 10;
      checkYPosition(10);


      // ----------------- Doctors Notes -----------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Doctors Notes:", x, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 15;
      checkYPosition(15);

      x -= 13;

      // ----------------- Differential Section -----------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 128);
      doc.text("Differential", x, y);
      doc.setDrawColor(0, 0, 128);
      doc.setLineWidth(0.025); // Thin line
      doc.line(x, y + 1, x + 22, y + 1);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      y += 10;
      checkYPosition(10);

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

      // ----------------- X-ray Image Section -----------------
      y += 10;
      checkYPosition(200);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 128);
      doc.text("X-Ray", x, y);
      doc.setLineWidth(0.025); // Thin line
      doc.line(x, y + 1, x + 10, y + 1);
      y += 15;
      // Draw border for image placeholder
      doc.setDrawColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      // Load and add the X-ray image
      const img = new Image();
      img.crossOrigin = "anonymous";


    doc.setLineWidth(0.025); // Thin line
    doc.line(x, y, doc.internal.pageSize.getWidth() - x, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("*** End of Report ***", 105, y + 5, { align: "center" });

    y += 15;
    // Dotted underline for signature
    doc.setLineDash([1, 1], 0);
    doc.line(x, y, x + 50, y);
    y += 10;

    // Doctor's name and designation
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("(MD,ophthalmologist)", x, y);

    // Save the PDF
    doc.save(
      'Report.pdf'
    );
  };

  return (
    <div>
      <button
        onClick={handleDownloadPDF}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Report
      </button>
    </div>
  );
};

export default DownloadReport;
