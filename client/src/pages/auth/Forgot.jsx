import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  handleGetOtp,
  handleVerifyOtp,
  handleResetPassword,
} from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import logoimg from "../../assets/logo.png";
import forgot from "../../assets/forgot.mp4";

const Forgot = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, otpSent, tempToken, error } = useSelector(
    (state) => state.auth
  );

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    dispatch(handleGetOtp({ email }))
      .unwrap()
      .then(() => {
        toast.success("OTP sent successfully!");
        setStep(2);
      })
      .catch((error) => toast.error(error || "Failed to send OTP."));
  };

  // Handle OTP Verification
  const handleVerifyOtpRequest = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    dispatch(handleVerifyOtp({ email, otp: otpValue }))
      .unwrap()
      .then(() => {
        toast.success("OTP verified successfully!");
        setStep(3);
      })
      .catch((error) => toast.error(error || "Failed to verify OTP."));
  };

  // Handle Password Reset
  const handleResetPasswordRequest = async (e) => {
    e.preventDefault();

    dispatch(handleResetPassword({ tempToken, newPassword }))
      .unwrap()
      .then(() => {
        toast.success("Password reset successful!");
        navigate("/login");
      })
      .catch((error) => toast.error(error || "Failed to reset password."));
  };

  const handleOtpChange = (value, index) => {
    if (/^\d$/.test(value) || value === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Move to next input box if value is entered
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const renderHeadingAndText = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h1 className="mt-8 text-3xl font-bold tracking-tight text-secondary">
              Forgot Password
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              Enter your email to receive the OTP.
            </p>
          </>
        );
      case 2:
        return (
          <>
            <h1 className="mt-8 text-3xl font-bold tracking-tight text-secondary">
              Verify OTP
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              Enter the OTP sent to your email.
            </p>
          </>
        );

      case 3:
        return (
          <>
            <h1 className="mt-8 text-3xl font-bold tracking-tight text-secondary">
              Reset Password
            </h1>
            <p className="mt-3 text-lg text-gray-500">Set your new password.</p>
          </>
        );
      default:
        return null;
    }
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleOtpRequest} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-secondary"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white text-black px-4 py-2 text-lg outline outline-bg-black placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-secondary px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span className="mr-4 text-xl">
                {!loading ? "Send OTP" : "Sending..."}
              </span>
              {!loading ? (
                <svg
                  fill="#ffffff"
                  height={"20px"}
                  width={"20px"}
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 495.003 495.003"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g id="XMLID_51_">
                      {" "}
                      <path
                        id="XMLID_53_"
                        d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616 l-67.6-32.22V456.687z"
                      ></path>{" "}
                      <path
                        id="XMLID_52_"
                        d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422 c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414 l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956 L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z"
                      ></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              ) : (
                ""
              )}
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyOtpRequest} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center text-lg border text-white border-gray-400 rounded-md focus:outline-2 focus:outline-indigo-600"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-secondary px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify OTP
            </button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleResetPasswordRequest} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-secondary"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  name="password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-md bg-white text-black px-4 py-2 text-lg outline outline-bg-black placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-secondary px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Reset Password
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <section className="flex justify-center min-h-screen bg-[#030811] dark:bg-[#fdfdfd] relative overflow-x-hidden overflow-y-hidden">
        {/* Content section */}
        <div className="w-3/5 flex flex-col gap-y-8 items-center justify-center">
          {/* Step Progress Bar */}
          <div className="w-3/5 py-8 px-16 relative">
            {/* Render Heading and Text */}
            <button onClick={() => navigate('/')} className="hover:cursor-pointer">
              <img alt="Your Company" src={logoimg} className="h-14 w-auto" />
            </button>
            <div className="my-12">{renderHeadingAndText()}</div>

            {/* Render Form */}
            <div className="relative z-10 bg-opacity-0">{renderForm()}</div>
          </div>
        </div>

        {/* Background Image section */}
        <div className="w-2/5 flex justify-center items-center bg-white">
          <video
            src={forgot}
            alt="forgot"
            className="object-cover transition-transform duration-300 group-hover:scale-110 pl-8"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
    </div>
  );
};

export default Forgot;
