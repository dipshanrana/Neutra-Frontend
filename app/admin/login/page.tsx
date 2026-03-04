"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError, extractToken } from "@/lib/api";

const SvgArrowLeft = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M20 12H4M4 12L11 5M4 12L11 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgCommand = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M12 4V20M4 12H20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        <rect x="8" y="8" width="8" height="8" rx="1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 8L6 6M16 16L18 18M16 8L18 6M8 16L6 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await api.auth.adminLogin({ username, password });
            const token = extractToken(data);

            if (!data || !token) {
                setError("Authentication failed. Invalid response.");
                return;
            }

            // Store admin token and info
            localStorage.setItem("adminToken", token);
            localStorage.setItem("admin", JSON.stringify({
                id: data.userId,
                username: data.username,
                role: "ADMIN"
            }));

            // Redirect to admin dashboard
            router.push("/admin/dashboard");
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Invalid credentials. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0A190E] font-sans flex flex-col relative overflow-hidden text-white">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none"></div>

            {/* Header */}
            <header className="absolute top-0 w-full p-8 z-10 flex justify-between items-center">
                <Link href="/" className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-colors group">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/30 transition-all">
                        <SvgArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest font-heading">Exit</span>
                </Link>
                <div className="text-xs font-black uppercase tracking-[0.4em] text-white/50 font-heading">
                    Sys<span className="text-[#38A36D]">Admin</span>
                </div>
            </header>

            {/* Auth Container */}
            <div className="flex-1 flex items-center justify-center p-4 z-10 w-full">
                <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-10 lg:p-14 shadow-2xl border border-white/10 relative">

                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#38A36D]/50 to-transparent"></div>

                    <div className="mb-12 text-center">
                        <div className="w-16 h-16 mx-auto bg-black/40 rounded-2xl flex items-center justify-center text-[#38A36D] mb-6 shadow-inner border border-white/5">
                            <SvgCommand className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-medium tracking-tighter text-white font-heading mb-2">Command Center</h1>
                        <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] font-black font-heading">Authorized Personnel Only</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                            <p className="text-[#38A36D] text-[10px] font-black uppercase tracking-[0.2em]">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-2 font-heading">Admin Identity</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#38A36D] focus:border-[#38A36D] transition-all"
                                placeholder="sysadmin"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-2 font-heading">Passkey</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#38A36D] focus:border-[#38A36D] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-emerald-600 text-[#0A190E] rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:shadow-[0_0_30px_rgba(56,163,109,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? "Authenticating..." : "Establish Connection"}
                        </button>
                    </form>

                </div>
            </div>
        </main>
    );
}
