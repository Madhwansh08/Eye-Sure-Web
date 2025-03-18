import React from "react";

// Utility function to format a date into "10th March 2025"
function formatDateLong(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);

  const day = date.getDate();
  const year = date.getFullYear();

  // Determine ordinal suffix (st, nd, rd, th)
  let suffix = "th";
  if (day % 10 === 1 && day !== 11) suffix = "st";
  else if (day % 10 === 2 && day !== 12) suffix = "nd";
  else if (day % 10 === 3 && day !== 13) suffix = "rd";

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July",    "August",   "September", "October", "November", "December"
  ];
  const monthName = monthNames[date.getMonth()];

  return `${day}${suffix} ${monthName} ${year}`;
}

export default function PatientHistoryTable({ patientHistory }) {
  return (
    <div className="mt-10">
      <h3 className="text-3xl mt-5 font-semibold gradient-text">Patient History</h3>
      {patientHistory && patientHistory.length > 0 ? (
        <table className="w-full mt-4 border  border-gray-500 text-sm table-auto bg-primary">
          <thead>
            <tr className="bg-secondary text-secondary uppercase text-sm font-bold tracking-wider">
              <th className="p-2 border border-gray-500 text-left">Date</th>
              <th className="p-2 border border-gray-500 text-left">Analysis</th>
              <th className="p-2 border border-gray-500 text-left">Left Result</th>
              <th className="p-2 border border-gray-500 text-left">Right Result</th>
            </tr>
          </thead>
          <tbody>
            {patientHistory.map((entry, index) => (
              <tr
                key={index}
                className="hover:bg-[#387AA4] transition-colors text-secondary"
              >
                <td className="p-2 border border-gray-500">
                  {formatDateLong(entry.date)}
                </td>
                <td className="p-2 border border-gray-500">{entry.analysisType}</td>
                <td className="p-2 border border-gray-500">{entry.leftResult}</td>
                <td className="p-2 border border-gray-500">{entry.rightResult}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-secondary mt-4">No history available.</p>
      )}
    </div>
  );
}
