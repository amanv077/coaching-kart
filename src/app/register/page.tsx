"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coaching-primary/5 via-background to-coaching-accent/5 px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-coaching-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-coaching-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-coaching-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full bg-card rounded-xl p-8 shadow-xl relative z-10 border border-muted/30 backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-2 bg-coaching-gradient rounded-t-xl" />
        <div className="absolute -right-2 top-8 bottom-8 w-2 bg-coaching-gradient/20 rounded-r-md" />

        <div className="text-center">
          <div className="w-16 h-16 bg-coaching-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">CK</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Join Coaching Kart! 🚀
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create your account and start your learning journey today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              id="name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
            <SelectField
              id="role"
              label="Account Type"
              value={formData.role}
              onChange={handleChange}
              options={[
                {
                  value: "STUDENT",
                  label: "🎓 Student - Learn from expert coaches",
                },
                { value: "COACH", label: "👨‍🏫 Coach - Share your expertise" },
                { value: "ADMIN", label: "⚙️ Admin - Manage the platform" },
              ]}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
            />
            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-lg font-semibold transition-colors cursor-pointer"
            variant="neon"
          >
            {isLoading ? "🔄 Creating Account..." : "🎯 Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-coaching-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </form>

        <div className="mt-8 p-6 bg-gradient-to-r from-coaching-primary/5 to-coaching-accent/5 border border-coaching-primary/20 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            🌟 Choose Your Journey
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 items-start">
              <span>🎓</span>
              <span>
                <b className="text-foreground">Student:</b>
                <span className="text-muted-foreground ml-1">
                  Access courses, book sessions, track progress
                </span>
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span>👨‍🏫</span>
              <span>
                <b className="text-foreground">Coach:</b>
                <span className="text-muted-foreground ml-1">
                  Create courses, manage students, earn income
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Extracted input field
function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-2 text-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-coaching-primary focus:border-transparent transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}

// Extracted select field
function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-2 text-foreground"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-coaching-primary focus:border-transparent transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
