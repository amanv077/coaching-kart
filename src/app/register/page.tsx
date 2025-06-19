"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/ui/loader";
import { UserRole } from "@/types/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT" as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?message=Registration successful! Please sign in.");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coaching-primary/5 via-background to-coaching-accent/5 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-coaching-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-coaching-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-coaching-gradient rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse shadow-lg">
            <span className="text-white font-bold text-3xl">✓</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Registration Successful! 🎉
          </h2>
          <p className="text-muted-foreground text-lg">
            Redirecting you to the login page...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-4">
        <div className="max-w-md w-full">
          {/* Modern Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
            {/* Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-2xl opacity-75">
              <div className="absolute inset-[1px] bg-white rounded-2xl"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-xl">CK</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Join Coaching Kart! 🚀
                </h2>
                <p className="mt-2 text-gray-600 text-sm">
                  Create your account and start your learning journey
                </p>
              </div>              {/* Register Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Compact Role Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      I want to join as a:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: 'STUDENT' }))}
                        className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                          formData.role === 'STUDENT'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">🎓</div>
                        <div className="font-semibold text-sm">Student</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: 'COACH' }))}
                        className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                          formData.role === 'COACH'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">👨‍🏫</div>
                        <div className="font-semibold text-sm">Coach</div>
                      </button>
                    </div>
                  </div>

                  {/* Password Inputs in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Confirm
                      </label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                        placeholder="Confirm"
                      />
                    </div>
                  </div>
                </div>                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover-scale transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <ButtonLoader />
                      Creating Account...
                    </div>
                  ) : (
                    "🎯 Create Account"
                  )}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-emerald-600 hover:text-blue-600 font-semibold transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
