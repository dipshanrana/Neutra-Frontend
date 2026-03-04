"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, User } from "@/lib/api";

const SvgArrowLeft = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M20 12H4M4 12L11 5M4 12L11 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgUserPlus = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8.5" cy="7" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="8" x2="20" y2="14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="23" y1="11" x2="17" y2="11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function AdminUsers() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
    const [newAdminUsername, setNewAdminUsername] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");

    useEffect(() => {
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) {
            router.push('/admin/login');
            return;
        }

        const adminData = JSON.parse(adminStr);
        if (adminData.role !== 'ADMIN') {
            router.push('/admin/login');
            return;
        }

        loadUsers();
    }, [router]);

    const loadUsers = async () => {
        try {
            const data = await api.admin.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newAdmin = await api.admin.createAdmin({
                username: newAdminUsername,
                password: newAdminPassword
            });
            setUsers([...users, newAdmin]);
            setIsCreatingAdmin(false);
            setNewAdminUsername("");
            setNewAdminPassword("");
        } catch (err) {
            alert("Failed to create admin");
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0A190E] text-white flex items-center justify-center">Loading Data...</div>;
    }

    return (
        <main className="min-h-screen bg-[#0A190E] text-white font-sans">
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/dashboard" className="text-white/40 hover:text-white transition-colors flex items-center gap-2">
                            <SvgArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-black tracking-tighter text-white font-heading">
                            System <span className="text-[#38A36D]">Users</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsCreatingAdmin(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-[#0A190E] rounded-lg hover:bg-white font-bold text-xs uppercase transition-all"
                    >
                        <SvgUserPlus className="w-4 h-4" /> Delegate Admin
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">

                {isCreatingAdmin && (
                    <div className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#38A36D]/80 to-transparent"></div>
                        <h2 className="text-xl font-medium mb-6 text-white font-heading tracking-tight">Authorize New SysAdmin</h2>
                        <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-2 font-heading">Admin Username</label>
                                <input required value={newAdminUsername} onChange={e => setNewAdminUsername(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#38A36D]" placeholder="admin_name" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-2 font-heading">Provision Passkey</label>
                                <input required type="password" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#38A36D]" placeholder="••••••••" />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                                <button type="button" onClick={() => setIsCreatingAdmin(false)} className="px-6 py-3 border border-white/10 text-white rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 bg-emerald-600 text-[#0A190E] rounded-xl text-[10px] uppercase font-black tracking-[0.2em] hover:bg-white hover:shadow-[0_0_20px_rgba(56,163,109,0.4)] transition-all">Execute Registration</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-[#38A36D] font-black border-b border-white/10 font-heading">
                            <tr>
                                <th className="p-6">Registry ID</th>
                                <th className="p-6">Identity</th>
                                <th className="p-6">Access Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 font-mono text-white/40 text-sm">#{user.id}</td>
                                    <td className="p-6 font-medium text-lg tracking-tight">{user.username}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${user.role === 'ADMIN' ? 'bg-emerald-600/20 text-[#38A36D] border border-[#38A36D]/30' : 'bg-white/5 text-white/60 border border-white/10'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-12 text-center text-white/30 text-sm uppercase tracking-widest font-medium">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </main>
    )
}
