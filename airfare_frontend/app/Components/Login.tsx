"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader2, ShieldCheck, User, KeyRound } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   const token = Cookies.get("access_token");
  //   if (token) {
  //     router.push("/admin/dashboard/cities");
  //   }
  // }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`,
        { username, password }
      );

      const { access_token } = response.data;
      Cookies.set("access_token", access_token, { expires: 1 }); // Expires in 1 day
      toast.success("Login successful! Redirecting...");
      router.push("/admin/dashboard/cities");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || "Invalid username or password.");
      } else if (err.request) {
        setError("Server not responding. Please try again later.");
      } else {
        setError("An unexpected error occurred during login.");
      }
      toast.error(error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with the same gradient background as the dashboard
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4 animate-fade-in-up">
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#334155", color: "#fff" } }}
      />
      {/* Floating glassmorphism card for the login form */}
      <div className="w-full max-w-sm bg-slate-800/60 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 border-2 border-blue-500/50 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-400 mt-2">
            Sign in to manage your dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input with Icon */}
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={20}
            />
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Password Input with Icon */}
          <div className="relative">
            <KeyRound
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={20}
            />
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
