import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import logoimg from "../../assets/logo.png";
import login from "../../assets/login.mp4";
import pdf from "../../assets/T&C and PP - Eyesure.pdf";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character")
    .required("Password is required"),
  terms: Yup.bool().oneOf([true], "You must accept the Terms & Conditions"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    const resultAction = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Registration successful");
      navigate("/login");
    } else {
      toast.error(resultAction.payload);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="flex w-3/5 bg-primary flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <button onClick={() => navigate('/')} className="hover:cursor-pointer">
            <img alt="Logo" src={logoimg} className="h-14 w-auto" />
          </button>
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-secondary">
            Create your account
          </h2>
          <p className="mt-3 mb-3 text-lg text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-lg text-secondary hover:text-primary hover:underline"
            >
              Sign In
            </button>
          </p>

          {/* Formik Form */}
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              terms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-8">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-secondary">
                    Full Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="block w-full rounded-md bg-white px-4 py-2 text-lg text-black outline outline-gray-300 placeholder:text-gray-400"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500" />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-secondary">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full rounded-md bg-white px-4 py-2 text-lg text-black outline outline-gray-300 placeholder:text-gray-400"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-lg font-medium text-secondary">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="block w-full rounded-md bg-white px-4 py-2 text-lg text-black outline outline-gray-300 placeholder:text-gray-400"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>

                {/* Terms & Conditions */}
                <div className="flex gap-3">
                  <Field
                    type="checkbox"
                    name="terms"
                    id="terms"
                    className="h-5 w-5 text-indigo-600"
                  />
                  <label htmlFor="terms" className="block text-lg text-secondary">
                    I agree to the{" "}
                    <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                <ErrorMessage name="terms" component="div" className="text-red-500" />

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="flex w-full justify-center rounded-md bg-secondary px-4 py-2 text-lg font-semibold text-white"
                  >
                    {isSubmitting || loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right Side - Video */}
      <div className="relative hidden w-2/5 lg:block">
        <video
          src={login}
          alt="register"
          className="object-cover h-full w-full"
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
