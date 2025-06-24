import LoginForm from "./LoginForm";
import slaLogo from "../assets/sla-logo.png";
import { motion } from "framer-motion";
import { FaShieldAlt, FaChartLine, FaUsers, FaClock } from "react-icons/fa";

const LoginPage = () => {
  const features = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Secure Access",
      description: "Enterprise-grade security for your data",
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Monitor your services in real-time",
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden flex bg-gradient-to-br from-[#387DB2] to-[#3D356E]">
      {/* Left Section - Image/Logo */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center relative z-10"
        >
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src={slaLogo}
            alt="SLA Logo"
            className="mx-auto w-50 mb-8 brightness-0 invert"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-blue-100 mb-8"
          >
            Sign in to access your account and manage your services.
          </motion.p>

          <div className="space-y-6 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
              >
                <div className="text-white/90 p-2 bg-white/20 rounded-lg">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 flex items-center justify-center space-x-2 text-blue-100"
          >
            <FaClock className="w-4 h-4" />
            <span className="text-sm">24/7 Support Available</span>
          </motion.div>
        </motion.div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center  px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:hidden">
            <img
              src={slaLogo}
              alt="SLA Logo"
              className="mx-auto w-32 mb-4 brightness-0 invert"
            />
          </div>
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-blue-100">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-white hover:text-blue-200 transition-colors duration-200"
              >
                Contact your administrator
              </a>
            </p>
          </div>
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
