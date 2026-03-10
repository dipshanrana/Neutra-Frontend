"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api, ApiError, extractToken } from "@/lib/api";

const SvgArrowLeft = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M20 12H4M4 12L11 5M4 12L11 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgLock = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <rect x="7" y="11" width="10" height="10" rx="3" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 11V7C12 5.34315 10.6569 4 9 4C7.34315 4 6 5.34315 6 7V11" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" transform="translate(3,0)" />
        <circle cx="12" cy="16" r="1.5" strokeWidth="1" />
    </svg>
);

export default function CustomerLogin() {
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
            const data = await api.auth.userLogin({ username, password });
            const token = extractToken(data);

            if (token) {
                localStorage.setItem("jwtToken", token);
            }

            localStorage.setItem("user", JSON.stringify({
                id: data.userId,
                username: data.username,
                role: "CUSTOMER"
            }));

            router.push("/");
            // Force refresh to update Navbar state if needed
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } catch (err: any) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Authentication system error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen selection:bg-[#4E7760] selection:text-white flex flex-col font-sans relative">
            {/* Even Greener Immersive Nature Background */}
            <div className="fixed top-0 left-0 w-full h-full z-0 bg-[#E8F5EE] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 scale-110">
                    <Image src="/bg-nature-rich.png" fill className="object-cover object-center opacity-[0.85]" alt="Nature Background" unoptimized />
                </div>
                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(43,84,65,0.85)_100%)] backdrop-blur-[4px]"></div>
            </div>

            {/* Premium Header */}
            <header className="absolute top-0 w-full p-6 z-50 flex justify-between items-center">
                <Link href="/" className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-all duration-500 group">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:bg-white/20 group-hover:shadow-xl group-hover:-translate-x-1 transition-all duration-500">
                        <SvgArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] font-heading">Home</span>
                </Link>
                <div className="text-xl font-black tracking-tighter text-white font-heading drop-shadow-md">
                    Nutri<span className="text-[#A3E0B5]">Core</span>
                </div>
            </header>

            {/* Login Architecture */}
            <div className="flex-1 flex items-center justify-center p-6 z-10 relative">
                <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_40px_100px_rgba(23,63,40,0.3)] border border-white/60">

                    <div className="mb-8 text-center">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#E8F5EE] to-[#C9E4D5] rounded-2xl flex items-center justify-center text-[#2B5441] mb-5 shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/40 group-hover:scale-150 transition-transform duration-700"></div>
                            <SvgLock className="w-7 h-7 relative z-10 drop-shadow-sm" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1F422E] font-heading mb-2">Welcome <span className="italic font-normal text-[#4E7760]">Back.</span></h1>
                        <p className="text-[#557763] text-sm font-medium">Log in to your premium account.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-[#FF4C4C]/10 border border-[#FF4C4C]/20 rounded-2xl text-center">
                            <p className="text-[#D93030] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7760] mb-3 font-heading ml-2 transition-colors group-focus-within:text-[#2B5441]">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-8 py-4 bg-[#F5FAF7] border border-[#DEEDE3] rounded-[1.5rem] text-[#1F422E] placeholder-[#88A693] focus:outline-none focus:bg-white focus:border-[#4E7760] focus:ring-4 focus:ring-[#4E7760]/10 transition-all duration-500 shadow-inner"
                                placeholder="Your username"
                            />
                        </div>

                        <div className="relative group">
                            <div className="flex justify-between items-center mb-3 ml-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7760] font-heading transition-colors group-focus-within:text-[#2B5441]">Password</label>
                                <a href="#" className="text-[10px] font-black text-[#557763] hover:text-[#2B5441] transition-colors uppercase tracking-[0.1em] decoration-[#4E7760]/30 decoration-2">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-8 py-4 bg-[#F5FAF7] border border-[#DEEDE3] rounded-[1.5rem] text-[#1F422E] placeholder-[#88A693] focus:outline-none focus:bg-white focus:border-[#4E7760] focus:ring-4 focus:ring-[#4E7760]/10 transition-all duration-500 shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            id="login-submit-button"
                            className="w-full py-4 bg-gradient-to-r from-[#2B5441] to-[#36684E] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:shadow-[0_15px_30px_rgba(43,84,65,0.4)] hover:-translate-y-0.5 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed border border-[#4F8B6D]/30 relative overflow-hidden group/btn"
                        >
                            <span className="relative z-10">
                                {loading ? "Authenticating..." : "Sign In"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-[#DEEDE3] pt-6">
                        <p className="text-xs text-[#557763] font-medium">
                            New to NutriCore? <Link href="/auth/register" className="text-[#2B5441] font-black hover:opacity-80 uppercase tracking-widest ml-2 transition-all border-b border-[#2B5441]/30 pb-0.5 hover:border-[#2B5441]">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
