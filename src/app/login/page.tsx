"use client";

import { Button } from '@/components/ui/button';
import { ButtonLoader } from '@/components/ui/loader';
import { DEFAULT_REDIRECTS } from '@/types/auth';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        return;
      }

      // Get the session to determine redirect based on role
      const session = await getSession();
      if (session?.user?.role) {
        const redirectPath = DEFAULT_REDIRECTS[session.user.role as keyof typeof DEFAULT_REDIRECTS];
        router.push(redirectPath);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="max-w-md w-full space-y-8 bg-card rounded-xl shadow-xl p-8 relative z-10 border border-muted/30"
      style={{
        transform: "perspective(1000px) rotateY(2deg)",
        backgroundImage: "linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--card)))",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px, rgba(255, 255, 255, 0.1) 0px 1px 0px inset",
      }}>
      <div className="absolute top-0 left-0 right-0 h-2 bg-coaching-gradient rounded-t-xl"></div>
      <div className="absolute -left-2 top-8 bottom-8 w-[8px] bg-coaching-gradient/20 rounded-l-md" style={{ transform: "translateX(-2px)" }}></div>
        {/* Header */}
        <div className="text-center">
          <div className=" text-3xl bg-coaching-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">Coaching-Kart</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome Back! 👋
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-coaching-primary focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-coaching-primary focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-lg font-semibold cursor-pointer hover:bg-gray-500"
            variant="gradient"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <ButtonLoader size="sm" />
                Signing In...
              </div>
            ) : (
              "🚀 Sign In"
            )}
          </Button>

          <div className="text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-coaching-primary hover:text-coaching-primary/80 font-semibold transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
