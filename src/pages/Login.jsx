import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUserPlus,
  FiLogIn,
  FiMail,
  FiLock,
  FiAlertCircle,
} from "react-icons/fi";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, formData[name]);
  };

  // Validate a specific field
  const validateField = (name, value) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "email":
        if (!value) {
          fieldErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          fieldErrors.email = "Invalid email format";
        } else {
          fieldErrors.email = "";
        }
        break;
      case "password":
        if (!value) {
          fieldErrors.password = "Password is required";
        } else if (value.length < 6) {
          fieldErrors.password = "Password must be at least 6 characters";
        } else {
          fieldErrors.password = "";
        }
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
    return !fieldErrors[name];
  };

  // Validate the entire form
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    let newTouched = {};

    // Mark all fields as touched
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    setTouched(newTouched);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await loginUser(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      setSubmitError(
        error.message || "Failed to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-500 to-blue-600 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {submitError && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            {submitError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none pl-10 block w-full px-3 py-3 border ${
                    touched.email && errors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none`}
                  placeholder="Email address"
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1 h-4 w-4 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none pl-10 block w-full px-3 py-3 border ${
                    touched.password && errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none`}
                  placeholder="Password"
                />
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1 h-4 w-4 flex-shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FiLogIn className="h-5 w-5 text-primary-300 group-hover:text-primary-200" />
              </span>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
