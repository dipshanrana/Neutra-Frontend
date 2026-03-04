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

const SvgUserPlus = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8.5" cy="7" r="4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="8" x2="20" y2="14" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="23" y1="11" x2="17" y2="11" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function CustomerRegister() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passkey mismatch detected.");
            return;
        }

        setLoading(true);

        try {
            const data = await api.auth.signup({ username, password });
            const token = extractToken(data);

            if (token) localStorage.setItem("jwtToken", token);
            localStorage.setItem("user", JSON.stringify({
                id: data.userId,
                username: data.username,
                role: "CUSTOMER"
            }));

            router.push("/");
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Protocol initialization failed. User identity may already exist.");
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
            <header className="absolute top-0 w-full p-8 z-50 flex justify-between items-center">
                <Link href="/" className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-all duration-500 group">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:bg-white/20 group-hover:shadow-xl group-hover:-translate-x-1 transition-all duration-500">
                        <SvgArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] font-heading">Return Home</span>
                </Link>
                <div className="text-2xl font-black tracking-tighter text-white font-heading drop-shadow-md">
                    Nutri<span className="text-[#A3E0B5]">Core</span>
                </div>
            </header>

            {/* Registration Architecture */}
            <div className="flex-1 flex items-center justify-center p-6 z-10 relative py-32">
                <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 lg:p-14 shadow-[0_40px_100px_rgba(23,63,40,0.3)] border border-white/60">

                    <div className="mb-12 text-center">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#E8F5EE] to-[#C9E4D5] rounded-[2rem] flex items-center justify-center text-[#2B5441] mb-8 shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/40 group-hover:scale-150 transition-transform duration-700"></div>
                            <SvgUserPlus className="w-10 h-10 relative z-10 drop-shadow-sm" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-[#1F422E] font-heading mb-4">Create <span className="italic font-normal text-[#4E7760]">Account.</span></h1>
                        <p className="text-[#557763] text-base font-medium">Join us to access advanced natural formulations.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-[#FF4C4C]/10 border border-[#FF4C4C]/20 rounded-2xl text-center">
                            <p className="text-[#D93030] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7760] mb-3 font-heading ml-2 transition-colors group-focus-within:text-[#2B5441]">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-8 py-4 bg-[#F5FAF7] border border-[#DEEDE3] rounded-[1.5rem] text-[#1F422E] placeholder-[#88A693] focus:outline-none focus:bg-white focus:border-[#4E7760] focus:ring-4 focus:ring-[#4E7760]/10 transition-all duration-500 shadow-inner"
                                placeholder="Choose username"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7760] mb-3 font-heading ml-2 transition-colors group-focus-within:text-[#2B5441]">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-[#F5FAF7] border border-[#DEEDE3] rounded-[1.5rem] text-[#1F422E] placeholder-[#88A693] focus:outline-none focus:bg-white focus:border-[#4E7760] focus:ring-4 focus:ring-[#4E7760]/10 transition-all duration-500 shadow-inner"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7760] mb-3 font-heading ml-2 transition-colors group-focus-within:text-[#2B5441]">Confirm</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-[#F5FAF7] border border-[#DEEDE3] rounded-[1.5rem] text-[#1F422E] placeholder-[#88A693] focus:outline-none focus:bg-white focus:border-[#4E7760] focus:ring-4 focus:ring-[#4E7760]/10 transition-all duration-500 shadow-inner"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-[#2B5441] to-[#36684E] text-white rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-[12px] hover:shadow-[0_15px_30px_rgba(43,84,65,0.4)] hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed border border-[#4F8B6D]/30 relative overflow-hidden group/btn mt-4"
                        >
                            <span className="relative z-10">
                                {loading ? "Creating Account..." : "Create Account"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </form>

                    <div className="mt-12 text-center border-t border-[#DEEDE3] pt-8">
                        <p className="text-sm text-[#557763] font-medium">
                            Already have an account? <Link href="/auth/login" className="text-[#2B5441] font-black hover:opacity-80 uppercase tracking-widest ml-2 transition-all border-b border-[#2B5441]/30 pb-0.5 hover:border-[#2B5441]">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
