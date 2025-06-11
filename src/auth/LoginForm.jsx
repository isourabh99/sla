import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaSpinner,
} from "react-icons/fa";

const InputField = ({ icon: Icon, type = "text", ...props }) => (
  <div className="relative">
    <div className="flex items-center w-full px-3 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-md shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent">
      <Icon className="h-5 w-5 text-white/70 mr-2 flex-shrink-0" />
      <input
        type={type}
        className="w-full bg-transparent border-none focus:outline-none text-white placeholder-white/60"
        {...props}
      />
    </div>
  </div>
);

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success("Successfully logged in!", {
          duration: 1000,
          onAutoClose: () => navigate("/dashboard"),
        });
      } else {
        setError(result.message || "Login failed");
        toast.error(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login");
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-6 p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <InputField
          icon={FaEnvelope}
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="relative">
          <InputField
            icon={FaLock}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/20 rounded transition-colors duration-200 bg-white/5"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-white/90"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-white/90 hover:text-blue-200 transition-colors duration-200"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-300 text-sm text-center bg-red-500/20 backdrop-blur-sm p-2 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg backdrop-blur-sm"
        >
          {loading ? <FaSpinner className="animate-spin h-5 w-5" /> : "Sign in"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
