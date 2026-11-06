'use client';
import React from 'react';
import {
    Search,
    Bell,
    Sun,
    Moon,
    Menu,
    ChevronRight,
    ArrowLeft,
    Sparkles
} from 'lucide-react';

interface TopHeaderProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    activeTab: string;
    courseName?: string;
    onBackToBatches?: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onOpenMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
    searchQuery,
    onSearchChange,
    activeTab,
    courseName,
    onBackToBatches,
    theme,
    toggleTheme,
    onOpenMobileMenu
}) => {
    // Determine breadcrumb label
    const getBreadcrumb = () => {
        if (activeTab === 'curriculum') {
            return (
                <div className="flex items-center space-x-1.5 overflow-hidden">
                    <span className="text-stone-400 dark:text-slate-500">Home</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-slate-600 shrink-0" />
                    <button
                        onClick={onBackToBatches}
                        className="text-stone-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
                    >
                        Batches
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-slate-600 shrink-0" />
                    <span className="font-bold text-stone-900 dark:text-white truncate max-w-xs sm:max-w-md">
                        {courseName || 'Curriculum'}
                    </span>
                </div>
            );
        }

        const label =
            activeTab === 'batches' ? 'Batches' :
            activeTab === 'dashboard' ? 'Dashboard' :
            activeTab === 'favorites' ? 'Favorites' :
            activeTab === 'history' ? 'History' :
            activeTab === 'tests' ? 'Tests' :
            activeTab === 'books' ? 'Study Materials' :
            activeTab === 'settings' ? 'Settings' : 'Batches';

        return (
            <div className="flex items-center space-x-1.5">
                <span className="text-stone-400 dark:text-slate-500">Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-slate-600" />
                <span className="font-bold text-stone-900 dark:text-white">{label}</span>
            </div>
        );
    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-stone-200/90 dark:border-slate-800/90 px-4 sm:px-8 py-3.5 transition-colors">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Left: Mobile Menu & Search Input */}
                <div className="flex items-center space-x-3 flex-1 max-w-xl">
                    <button
                        onClick={onOpenMobileMenu}
                        className="p-2 md:hidden rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Wide Search Bar (Exact Style from AryaVidya screenshot) */}
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search batches..."
                            className="w-full bg-[#f6f5f1] dark:bg-slate-900/90 border border-stone-200 dark:border-slate-800 rounded-full pl-5 pr-10 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors shadow-inner"
                        />
                        <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500 pointer-events-none" />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-9 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-slate-200"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Notification Bell & Profile Avatar */}
                <div className="flex items-center space-x-3 shrink-0">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-300 transition"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? (
                            <Moon className="w-4 h-4 text-slate-700" />
                        ) : (
                            <Sun className="w-4 h-4 text-amber-400" />
                        )}
                    </button>

                    {/* Notification Bell with Badge */}
                    <div className="relative">
                        <button className="p-2.5 rounded-full bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-300 transition">
                            <Bell className="w-4 h-4" />
                        </button>
                        <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                            2
                        </span>
                    </div>

                    {/* User Avatar (Exact golden circle 'A' from screenshot) */}
                    <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-amber-500/30 cursor-pointer select-none">
                        A
                    </div>
                </div>

            </div>

            {/* Breadcrumb Card Bar (Matching the exact card container in screenshot) */}
            <div className="max-w-7xl mx-auto mt-3">
                <div className="bg-white dark:bg-slate-900/90 border border-stone-200/90 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs shadow-xs flex items-center justify-between">
                    {getBreadcrumb()}

                    {activeTab === 'curriculum' && onBackToBatches && (
                        <button
                            onClick={onBackToBatches}
                            className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 hover:underline font-bold text-xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>All Batches</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

