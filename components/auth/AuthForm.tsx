"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiUser, FiPhone, FiMapPin, FiHome } from "react-icons/fi";
import gsap from "gsap";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code" | "register">("phone");
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    code: "",
    address: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [step]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phoneNumber.trim()) {
      setErrors({ phoneNumber: "Phone number is required" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send-code",
          phoneNumber: `+44${formData.phoneNumber}`,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to send code");
      showToast.success("Code sent to your phone!");
      setStep("code");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setErrors({ code: "Code is required" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          phoneNumber: `+44${formData.phoneNumber}`,
          code: formData.code,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Verification failed");

      if (data.data.userExists) {
        localStorage.setItem("token", data.data.token);
        setUser(data.data.user);
        showToast.success("Welcome back! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        showToast.success("Phone verified! Please complete registration.");
        setStep("register");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Email is invalid";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!agreedToTerms) {
      setErrors({
        ...newErrors,
        terms: "You must accept the terms and conditions",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          phoneNumber: `+44${formData.phoneNumber}`,
          name: formData.name,
          lastName: formData.lastName,
          emailAddress: formData.emailAddress,
          address: formData.address,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Registration failed");

      localStorage.setItem("token", data.data.token);
      setUser(data.data.user);
      showToast.success("Account created! Redirecting...");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showToast.error(message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const digits = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: digits,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-20">
        <div className="my-4 flex flex-row-reverse gap-1 justify-center items-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-[#fe9a00] hover:underline"
          >
            Home
          </button>
          <FiHome className="text-[#fe9a00]" />
        </div>
        <div
          ref={formRef}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === "register" ? "Complete Profile" : "Welcome"}
            </h1>
            <p className="text-white/60">
              {step === "register"
                ? "Just a few more details"
                : step === "code"
                ? "Enter the code sent to your phone"
                : "Enter your phone number to continue"}
            </p>
          </div>

          <form
            onSubmit={
              step === "phone"
                ? handleSendCode
                : step === "code"
                ? handleVerifyCode
                : handleCompleteRegistration
            }
            className="space-y-6"
          >
            {step === "phone" && (
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <div className="absolute left-12 top-1/2 -translate-y-1/2 text-white/60 font-medium">
                  +44
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="7400123456"
                  required
                  className={`w-full pl-20 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                    errors.phoneNumber
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/20 focus:border-[#fe9a00]"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            )}

            {step === "code" && (
              <>
                <div className="relative">
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white text-center text-2xl tracking-widest placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                      errors.code
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/20 focus:border-[#fe9a00]"
                    }`}
                  />
                  {errors.code && (
                    <p className="mt-1 text-red-400 text-sm text-center">
                      {errors.code}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-[#fe9a00] hover:text-orange-300 transition-colors text-sm"
                >
                  Change phone number
                </button>
              </>
            )}

            {step === "register" && (
              <>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="First Name"
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
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                      errors.lastName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/20 focus:border-[#fe9a00]"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-red-400 text-sm">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                      errors.emailAddress
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/20 focus:border-[#fe9a00]"
                    }`}
                  />
                  {errors.emailAddress && (
                    <p className="mt-1 text-red-400 text-sm">
                      {errors.emailAddress}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                      errors.address
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/20 focus:border-[#fe9a00]"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-red-400 text-sm">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (errors.terms)
                        setErrors((prev) => ({ ...prev, terms: "" }));
                    }}
                    className="mt-1 w-4 h-4 rounded-sm text-[#fe9a00] bg-white/5 border-white/20 focus:ring-0"
                  />
                  <label htmlFor="terms" className="text-white/80 text-sm">
                    I agree to the
                    <span className="ml-2 text-[#fe9a00] hover:underline">
                      <Link href="/terms-and-conditions/">
                        terms and conditions
                      </Link>
                    </span>
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-1 text-red-400 text-sm">{errors.terms}</p>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={isLoading || (step === "register" && !agreedToTerms)}
              className="w-full py-4 bg-[#fe9a00] text-white font-semibold rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {step === "phone"
                    ? "Sending Code..."
                    : step === "code"
                    ? "Verifying..."
                    : "Creating Account..."}
                </div>
              ) : step === "phone" ? (
                "Send Code"
              ) : step === "code" ? (
                "Verify Code"
              ) : (
                "Complete Registration"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
