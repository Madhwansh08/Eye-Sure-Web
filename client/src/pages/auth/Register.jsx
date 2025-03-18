import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoimg from "../../assets/logo.png";
import login from "../../assets/login.mp4";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Registration successful");
      navigate("/login");
    } else {
      console.error("Registration failed:", resultAction.payload);
      toast.error(resultAction.payload);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side (form) - 60% */}
      <div className="flex w-3/5 bg-primary flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <img alt="Your Company" src={logoimg} className="h-14 w-auto" />
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-secondary">
              Create your account
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-lg text-secondary hover:text-primary"
              >
                Sign In
              </button>
            </p>
          </div>

          <div className="mt-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-secondary"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-primary px-4 py-2 text-lg text-secondary outline  outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-secondary"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-primary px-4 py-2 text-lg text-secondary outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-medium text-secondary"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-primary px-4 py-2 text-lg text-secondary outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-secondary px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side (image) - 40% */}
      <div className="relative hidden w-2/5 lg:block">
        <video
          src={login}
          alt="register"
          className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-110"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
};

export default Register;
