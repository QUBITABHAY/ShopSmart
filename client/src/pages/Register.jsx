import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validatePassword } from "../utils/validators";

function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    clearError();
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (validationErrors[e.target.name]) {
      setValidationErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.message;
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
    );
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform transition-all">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <span className="text-3xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
                ShopSmart
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Create an account
            </h1>
            <p className="text-gray-500 mt-2">
              Join us and start shopping today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-xl text-sm animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 pl-11 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none ${validationErrors.name ? "border-red-500" : "border-gray-200"}`}
                    placeholder="John Doe"
                    required
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1.5 pl-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 pl-11 pr-11 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none ${validationErrors.password ? "border-red-500" : "border-gray-200"}`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1.5 pl-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 pl-11 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none ${validationErrors.confirmPassword ? "border-red-500" : "border-gray-200"}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1.5 pl-1">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all focus:ring-4 focus:ring-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links (optional for auth page) */}
        <div className="mt-6 flex justify-center gap-6 text-sm text-blue-200">
          <Link to="/" className="hover:text-white transition-colors">
            Back to Home
          </Link>
          <span className="opacity-50">•</span>
          <Link to="/help" className="hover:text-white transition-colors">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
