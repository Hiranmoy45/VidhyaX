'use client';
import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Heart,
    History,
    Send,
    Download,
    Settings,
    Sun,
    Moon,
    ShieldCheck,
    FolderCheck,
    Layers
} from 'lucide-react';

export type SidebarTab = 'dashboard' | 'batches' | 'curriculum' | 'favorites' | 'history' | 'tests' | 'books' | 'settings';

interface SidebarProps {
    activeTab: SidebarTab;
    setActiveTab: (tab: SidebarTab) => void;
    favoritesCount: number;
    enrolledCount: number;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onOpenDownloads: () => void;
    activeDownloadCount?: number;
    isOpenMobile?: boolean;
    onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    favoritesCount,
    enrolledCount,
    theme,
    toggleTheme,
    onOpenDownloads,
    activeDownloadCount = 0,
    isOpenMobile = false,
    onCloseMobile
}) => {
    const navItems = [
        {
            id: 'batches' as SidebarTab,
            label: 'Batches',
            icon: BookOpen,
            badge: '18k+'
        },
        {
            id: 'dashboard' as SidebarTab,
            label: 'Dashboard',
            icon: LayoutDashboard,
            badge: enrolledCount > 0 ? enrolledCount : undefined
        },
        {
            id: 'favorites' as SidebarTab,
            label: 'Favorites',
            icon: Heart,
            badge: favoritesCount > 0 ? favoritesCount : undefined
        },
        {
            id: 'history' as SidebarTab,
            label: 'History',
            icon: History
        },
        {
            id: 'curriculum' as SidebarTab,
            label: 'Curriculum',
            icon: Layers
        },
        {
            id: 'telegram' as any,
            label: 'Telegram',
            icon: Send,
            isAction: true,
            action: () => window.open('https://t.me/VidhyaX', '_blank')
        },
        {
            id: 'downloads' as any,
            label: 'Downloads',
            icon: Download,
            isAction: true,
            action: onOpenDownloads,
            badge: activeDownloadCount > 0 ? activeDownloadCount : undefined
        },
        {
            id: 'settings' as SidebarTab,
            label: 'Settings',
            icon: Settings
        }
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0f172a] border-r border-stone-200/90 dark:border-slate-800/90 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
        >
            <div className="p-5 flex flex-col space-y-6">
                {/* Brand Logo & Name (Matching VidhyaX / PW Style) */}
                <div
                    onClick={() => {
                        setActiveTab('batches');
                        if (onCloseMobile) onCloseMobile();
                    }}
                    className="flex items-center space-x-3 cursor-pointer group select-none"
                >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-1.5">
                            <span className="text-lg font-black tracking-tight text-stone-900 dark:text-white font-sans">
                                VidhyaX
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                PW
                            </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-slate-400 font-medium">
                            Professional LMS Hub
                        </p>
                    </div>
                </div>

                {/* Nav Links List */}
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.label}
                                onClick={() => {
                                    if (item.isAction && item.action) {
                                        item.action();
                                    } else {
                                        setActiveTab(item.id as SidebarTab);
                                    }
                                    if (onCloseMobile) onCloseMobile();
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${isActive
                                        ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 font-bold shadow-sm border border-amber-200/80 dark:border-amber-800/60'
                                        : 'text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800/80 hover:text-stone-900 dark:hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon
                                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive
                                                ? 'text-amber-600 dark:text-amber-400 stroke-[2.4]'
                                                : 'text-stone-400 dark:text-slate-400'
                                            }`}
                                    />
                                    <span>{item.label}</span>
                                </div>

                                {item.badge !== undefined && (
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive
                                                ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-stone-950'
                                                : 'bg-stone-200/70 text-stone-700 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section: Theme Switcher & Storage Info */}
            <div className="p-5 border-t border-stone-200/80 dark:border-slate-800/80 space-y-3">
                {/* Theme Toggle Button */}
                <div className="bg-stone-100 dark:bg-slate-800/90 p-1 rounded-2xl flex items-center border border-stone-200/60 dark:border-slate-700/60">
                    <button
                        onClick={() => {
                            if (theme !== 'light') toggleTheme();
                        }}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${theme === 'light'
                                ? 'bg-white text-stone-900 shadow-sm'
                                : 'text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                    >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Light</span>
                    </button>

                    <button
                        onClick={() => {
                            if (theme !== 'dark') toggleTheme();
                        }}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${theme === 'dark'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                    >
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dark</span>
                    </button>
                </div>

                {/* Storage path badge */}
                <div className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-200/60 dark:border-slate-800 flex items-center space-x-2 text-[11px] text-stone-500 dark:text-slate-400">
                    <FolderCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate font-mono">F:\PW\Shodh...</span>
                </div>
            </div>
        </aside>
    );
};

