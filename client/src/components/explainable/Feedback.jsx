import React, { useState } from "react";
import { toast } from "react-toastify";

const FeedbackForm = ({ type }) => {
  const [formData, setFormData] = useState({
    leftFundus: "",
    rightFundus: "",
    leftSeverity: "",
    rightSeverity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Feedback submitted successfully");
    console.log(formData);
  };

  return (
    <div className="max-w-xl mx-auto bg-primary p-6 rounded-lg border border-white px-6 py-3 mt-24">
      <h2 className="text-2xl font-semibold text-center text-secondary mb-6">
        <h2 className="text-2xl font-semibold text-center text-secondary mb-6">
          {type === "Armd" ? "ARMD" : type} Feedback Form
        </h2>
      </h2>
      <form className="space-y-4">
        {/* LEFT FUNDUS */}
        <div>
          <label className="block text-xl font-medium text-secondary">
            Left Fundus:
          </label>
          <select
            name="leftFundus"
            value={formData.leftFundus}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-md bg-secondary"
          >
            <option value="">Select</option>
            {type === "DR"
              ? ["REF DR", "NON-REF DR"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              : type === "Glaucoma"
              ? ["Suspect glaucoma", "Non glaucoma", "Glaucoma"].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )
              : ["ARMD Detected", "No ARMD Detected"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
          </select>
        </div>

        {/* LEFT SEVERITY (Only for DR & Glaucoma) */}
        {type === "DR" && (
          <div className="ml-4">
            <label className="text-md font-medium text-secondary flex">
              ► Severity:
            </label>
            <select
              name="rightSeverity"
              value={formData.leftSeverity}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-md bg-secondary"
            >
              <option value="">Select</option>
              {["No DR", "Mild DR", "Moderate DR", "Severe/Proliferate DR"].map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* RIGHT FUNDUS */}
        <div>
          <label className="block text-xl font-medium text-secondary">
            Right Fundus:
          </label>
          <select
            name="rightFundus"
            value={formData.rightFundus}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-md bg-secondary"
          >
            <option value="">Select</option>
            {type === "DR"
              ? ["REF DR", "NON-REF DR"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              : type === "Glaucoma"
              ? ["Suspect glaucoma", "Non glaucoma", "Glaucoma"].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )
              : ["ARMD detected", "No ARMD detected"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
          </select>
        </div>

        {/* RIGHT SEVERITY (Only for DR & Glaucoma) */}
        {type === "DR" && (
          <div className="ml-4">
            <label className="text-md font-medium text-secondary flex">
              ► Severity:
            </label>
            <select
              name="rightSeverity"
              value={formData.rightSeverity}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-md bg-secondary"
            >
              <option value="">Select</option>
              {["No DR", "Mild DR", "Moderate DR", "Severe/Proliferate DR"].map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center items-center mt-8 mb-4">
          <button
            onClick={handleSubmit}
            className="flex justify-center rounded-md bg-secondary px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
