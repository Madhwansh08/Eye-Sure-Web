import React, { useState } from "react";
import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/20/solid";

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
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[date.getMonth()];
  
  return `${day}${suffix} ${monthName} ${year}`;
}

export default function PatientHistoryTable({ patientHistory }) {
  const pageSize = 4; // Number of records per page
  const isPaginationNeeded = patientHistory.length > pageSize;
  
  // Pagination state (only relevant if there are more than 4 records)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = isPaginationNeeded ? Math.ceil(patientHistory.length / pageSize) : 1;
  
  // Slice data for the current page or use the full array if no pagination is needed
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = isPaginationNeeded
    ? patientHistory.slice(startIndex, startIndex + pageSize)
    : patientHistory;

  // Handlers for navigation
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // Generate an array of page numbers for pagination links (if needed)
  const pageNumbers = isPaginationNeeded
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : [];

  return (
    <div className="mt-10">
      <h3 className="text-3xl mt-5 font-semibold gradient-text">Patient History</h3>
      {patientHistory && patientHistory.length > 0 ? (
        <>
          <table className="w-full mt-4 border border-gray-500 text-sm table-auto bg-primary">
            <thead>
              <tr className="bg-secondary text-secondary uppercase text-sm font-bold tracking-wider">
                <th className="p-2 border border-gray-500 text-left">Date</th>
                <th className="p-2 border border-gray-500 text-left">Analysis</th>
                <th className="p-2 border border-gray-500 text-left">Left Result</th>
                <th className="p-2 border border-gray-500 text-left">Right Result</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((entry, index) => (
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

          {/* Only show pagination if needed */}
          {isPaginationNeeded && (
            <nav className="flex items-center justify-between px-4 sm:px-0 mt-4">
              {/* Previous button */}
              <div className="-mt-px flex w-0 flex-1">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium
                    text-secondary hover:border-[#387AA4] hover:text-[#387AA4] 
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowLongLeftIcon aria-hidden="true" className="mr-3 h-5 w-5 text-gray-200" />
                  Previous
                </button>
              </div>

              {/* Page number links */}
              <div className="hidden md:-mt-px md:flex">
                {pageNumbers.map((page) => {
                  const isCurrent = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium
                        ${
                          isCurrent
                            ? "border-[#387AA4] text-[#387AA4]"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <div className="-mt-px flex w-0 flex-1 justify-end">
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium
                    text-gray-500 hover:border-[#387AA4] hover:text-[#387AA4]
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Next
                  <ArrowLongRightIcon aria-hidden="true" className="ml-3 h-5 w-5 text-gray-400 hover:text-[#387AA4]" />
                </button>
              </div>
            </nav>
          )}
        </>
      ) : (
        <p className="text-secondary mt-4">No history available.</p>
      )}
    </div>
  );
}
