'use client';
import React from 'react';
import {
    GraduationCap,
    BookOpen,
    Video,
    FileText,
    CheckSquare,
    Layers,
    Compass,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

export type NavTab = 'my-batches' | 'batches' | 'curriculum' | 'tests' | 'books' | 'downloader';

interface NavbarProps {
    activeTab: NavTab;
    setActiveTab: (tab: NavTab) => void;
    enrolledCount?: number;
    activeBatchName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
    activeTab,
    setActiveTab,
    enrolledCount = 1,
    activeBatchName
}) => {
    return (
        <header className="border-b border-slate-800/90 bg-[#020617]/85 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                {/* Brand / Logo */}
                <div
                    className="flex items-center space-x-3.5 cursor-pointer group"
                    onClick={() => setActiveTab('my-batches')}
                >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                PW Learning Hub
                            </h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800">
                                PRO MAX
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[220px] sm:max-w-xs">
                            {activeBatchName ? activeBatchName : 'Next-Gen Educational Platform'}
                        </p>
                    </div>
                </div>

                {/* Main Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
                    <button
                        onClick={() => setActiveTab('my-batches')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                            activeTab === 'my-batches'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                    >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>My Batches</span>
                        <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/20 text-white">
                            {enrolledCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('batches')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                            activeTab === 'batches'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                    >
                        <Compass className="w-3.5 h-3.5" />
                        <span>All Batches</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('curriculum')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                            activeTab === 'curriculum'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Curriculum</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('tests')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                            activeTab === 'tests'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                    >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Mock Tests (CBT)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('books')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                            activeTab === 'books'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Study Material</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('downloader')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                            activeTab === 'downloader'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                    >
                        <Video className="w-3.5 h-3.5" />
                        <span>Downloader</span>
                    </button>
                </nav>

                {/* Right Status Pill */}
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                        <span className="w-2 h-2 mr-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Platform Online
                    </span>
                </div>
            </div>

            {/* Mobile Scrollable Nav */}
            <div className="lg:hidden flex items-center space-x-2 overflow-x-auto px-4 py-2 border-t border-slate-800/60 text-xs bg-slate-950/90">
                <button
                    onClick={() => setActiveTab('my-batches')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                        activeTab === 'my-batches' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                >
                    My Batches ({enrolledCount})
                </button>
                <button
                    onClick={() => setActiveTab('batches')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                        activeTab === 'batches' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                >
                    Explore Batches
                </button>
                <button
                    onClick={() => setActiveTab('curriculum')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                        activeTab === 'curriculum' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                >
                    Curriculum
                </button>
                <button
                    onClick={() => setActiveTab('tests')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                        activeTab === 'tests' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                >
                    Mock Tests
                </button>
                <button
                    onClick={() => setActiveTab('books')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                        activeTab === 'books' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                >
                    Study Material
                </button>
                <button
                    onClick={() => setActiveTab('downloader')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                        activeTab === 'downloader' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                >
                    Downloader
                </button>
            </div>
        </header>
    );
};
