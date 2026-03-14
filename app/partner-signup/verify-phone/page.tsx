"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/spalsh_oyaeat (3).png";
import phoneVerificationImage from "@/public/verify.png";

const VerifyPhone = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    // Get phone and userId from sessionStorage
    const data = sessionStorage.getItem('partnerSignupData');
    if (data) {
      const parsedData = JSON.parse(data);
      setPhone(parsedData.phone || "");
      setUserId(parsedData.userId || "");
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    setIsResending(true);
    setError("");
    
    try {
      // In a real implementation, you would call an API to send OTP
      // For now, we'll just simulate it and set isCodeSent to true
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsCodeSent(true);
      setCountdown(60);
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          otp: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid or expired OTP");
      }

      // Success! Navigate to welcome or dashboard page
      router.push('/partner-signup/welcome');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
      // Clear the code inputs on error
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== "");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header */}
      <header className="py-6 px-8">
        <Link href="/" className="flex items-center gap-2">
          
          
          <span className="text-xl font-bold">
            <span className="text-[#2d5f4f]">Oya</span>
            <span className="text-gray-900">Eat</span>
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-20">
            {/* Left Side - Form */}
            <div className="flex-1 w-full max-w-md">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Verify your phone number
              </h1>
              <p className="text-gray-600 text-base mb-10 leading-relaxed">
                Verifying your phone number helps simplify the registration process and facilitates easier communication.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
              )}

              {!isCodeSent ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-transparent outline-none text-gray-900 mb-6 text-base"
                    placeholder="+234 9068603516"
                    disabled={isResending}
                  />

                  <button
                    onClick={handleSendCode}
                    disabled={isResending || !phone}
                    className="w-full bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-semibold py-3.5 rounded-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Receive Verification Code"
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Enter verification code sent to {phone}
                  </label>
                  
                  {/* 6-Digit Code Input */}
                  <div className="flex gap-3 mb-6">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (el) inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={isVerifying}
                        className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5f4f] focus:border-[#2d5f4f] outline-none disabled:bg-gray-100"
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={!isCodeComplete || isVerifying}
                    className="w-full bg-[#2d5f4f] hover:bg-[#234a3d] text-white font-semibold py-3.5 rounded-lg transition-all duration-300 mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      "Verify Code"
                    )}
                  </button>

                  <button
                    onClick={handleSendCode}
                    disabled={countdown > 0 || isResending}
                    className="w-full text-[#2d5f4f] font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
                  >
                    {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Code"}
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Illustration */}
            <div className="flex-1 w-full flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <Image
                  src={phoneVerificationImage}
                  alt="Phone verification"
                  width={450}
                  height={450}
                  className="object-contain w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;