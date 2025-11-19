"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiCheck,
} from "react-icons/fi";
import gsap from "gsap";
import { useAuth } from "./AuthContext";

interface AuthFormProps {
  mode: "login" | "signup";
  onModeChange: (mode: "login" | "signup") => void;
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const { login, signup, isLoading } = useAuth();

  const formRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [mode]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (mode === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      setErrors({ general: "Authentication failed. Please try again." });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    if (switchRef.current) {
      gsap.to(switchRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
    onModeChange(newMode);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20">
      <div ref={switchRef} className="mb-8">
        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
          <div
            className="absolute top-2 bottom-2 bg-[#fe9a00] rounded-xl transition-all duration-300 ease-out"
            style={{
              left: mode === "login" ? "8px" : "50%",
              right: mode === "login" ? "50%" : "8px",
            }}
          />
          <div className="relative flex">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 py-3 px-6 text-center font-semibold rounded-xl transition-colors duration-300 ${
                mode === "login"
                  ? "text-white"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`flex-1 py-3 px-6 text-center font-semibold rounded-xl transition-colors duration-300 ${
                mode === "signup"
                  ? "text-white"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <div
        ref={formRef}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-white/60">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Join us and start your journey today"}
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {errors.general}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center">
            <FiCheck className="mr-2" />
            {mode === "login"
              ? "Login successful! Redirecting..."
              : "Account created successfully! Redirecting..."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                  errors.name
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/20 focus:border-[#fe9a00]"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
              )}
            </div>
          )}

          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
              className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                errors.email
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/20 focus:border-[#fe9a00]"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                errors.password
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/20 focus:border-[#fe9a00]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <p className="mt-1 text-red-400 text-sm">{errors.password}</p>
            )}
          </div>

          {mode === "signup" && (
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                required
                className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                  errors.confirmPassword
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/20 focus:border-[#fe9a00]"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-red-400 text-sm">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-white/60">
                <input type="checkbox" className="mr-2 rounded" />
                Remember me
              </label>
              <button
                type="button"
                className="text-[#fe9a00] hover:text-orange-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#fe9a00] text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                {mode === "login" ? "Signing In..." : "Creating Account..."}
              </div>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
