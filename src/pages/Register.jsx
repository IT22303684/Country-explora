import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUserPlus,
  FiMail,
  FiLock,
  FiUser,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  // Check password strength whenever password changes
  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const checkPasswordStrength = (password) => {
    const hasMinLength = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    if (hasMinLength) score++;
    if (hasLowercase) score++;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    setPasswordStrength({
      score,
      hasMinLength,
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
    });
  };

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

    // Special case: Validate confirmPassword when password changes
    if (name === "password" && formData.confirmPassword) {
      validateField("confirmPassword", formData.confirmPassword, value);
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
  const validateField = (name, value, passwordValue = formData.password) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          fieldErrors.name = "Name is required";
        } else if (value.trim().length < 2) {
          fieldErrors.name = "Name must be at least 2 characters";
        } else {
          fieldErrors.name = "";
        }
        break;

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

      case "confirmPassword":
        if (!value) {
          fieldErrors.confirmPassword = "Please confirm your password";
        } else if (value !== passwordValue) {
          fieldErrors.confirmPassword = "Passwords do not match";
        } else {
          fieldErrors.confirmPassword = "";
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
      await registerUser(formData.email, formData.password, formData.name);
      navigate("/");
    } catch (error) {
      setSubmitError(
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get the strength color for the password meter
  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-yellow-500";
    if (score <= 3) return "bg-yellow-400";
    if (score === 4) return "bg-green-400";
    return "bg-green-500";
  };

  // Get text description of password strength
  const getPasswordStrengthText = () => {
    const { score } = passwordStrength;
    if (score <= 1) return "Weak";
    if (score <= 2) return "Fair";
    if (score <= 3) return "Good";
    if (score === 4) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-500 to-blue-600 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Sign in
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
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none pl-10 block w-full px-3 py-3 border ${
                    touched.name && errors.name
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none`}
                  placeholder="John Doe"
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1 h-4 w-4 flex-shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
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
                  placeholder="you@example.com"
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1 h-4 w-4 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none pl-10 block w-full px-3 py-3 border ${
                    touched.password && errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none`}
                  placeholder="••••••••"
                />
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1 h-4 w-4 flex-shrink-0" />
                  {errors.password}
                </p>
              )}

              {/* Password strength meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs ml-2 font-medium text-gray-600 w-20">
                      {getPasswordStrengthText()}
                    </span>
                  </div>

                  <ul className="text-xs space-y-1 mt-2">
                    <li
                      className={`flex items-center ${
                        passwordStrength.hasMinLength
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasMinLength ? (
                        <FiCheck className="mr-1 h-3 w-3" />
                      ) : (
                        <FiAlertCircle className="mr-1 h-3 w-3" />
                      )}
                      At least 6 characters
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordStrength.hasUppercase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasUppercase ? (
                        <FiCheck className="mr-1 h-3 w-3" />
                      ) : (
                        <FiAlertCircle className="mr-1 h-3 w-3" />
                      )}
                      Contains uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordStrength.hasNumber
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasNumber ? (
                        <FiCheck className="mr-1 h-3 w-3" />
                      ) : (
                        <FiAlertCircle className="mr-1 h-3 w-3" />
                      )}
                      Contains number
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordStrength.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasSpecialChar ? (
                        <FiCheck className="mr-1 h-3 w-3" />
                      ) : (
                        <FiAlertCircle className="mr-1 h-3 w-3" />
                      )}
                      Contains special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none pl-10 block w-full px-3 py-3 border ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none`}
                  placeholder="••••••••"
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1 h-4 w-4 flex-shrink-0" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FiUserPlus className="h-5 w-5 text-primary-300 group-hover:text-primary-200" />
              </span>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
