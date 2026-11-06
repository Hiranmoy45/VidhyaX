'use client';
import React from 'react';
import { AlertTriangle, StopCircle, X, Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { DownloadQueueItem } from './DownloadDrawer';

interface CancelDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmCancel: () => void;
    currentItem?: DownloadQueueItem;
    completedCount: number;
    totalCount: number;
}

export const CancelDownloadModal: React.FC<CancelDownloadModalProps> = ({
    isOpen,
    onClose,
    onConfirmCancel,
    currentItem,
    completedCount,
    totalCount
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-stone-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200 animate-in fade-in">
            <div
                className="bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button top-right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition"
                    title="Close modal"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header Icon & Title */}
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-md shadow-rose-500/10">
                        <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-slate-100">
                            Cancel Download?
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
                            Are you sure you want to cancel the active download queue?
                        </p>
                    </div>
                </div>

                {/* Current Item Progress Card */}
                {currentItem && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-950/80 border border-stone-200/80 dark:border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-slate-500 tracking-wider">
                                Currently Downloading
                            </span>
                            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                                {currentItem.percent}%
                            </span>
                        </div>
                        <p className="text-xs font-bold text-stone-800 dark:text-slate-200 truncate">
                            {currentItem.title}
                        </p>
                        <div className="w-full bg-stone-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-full bg-amber-500 rounded-full transition-all"
                                style={{ width: `${currentItem.percent}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Info Note */}
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-[11px]">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>What happens next:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-600 dark:text-slate-300 pl-1">
                        <li>The current file in progress will be aborted immediately.</li>
                        <li>
                            <strong className="text-emerald-600 dark:text-emerald-400">{completedCount} of {totalCount}</strong> files already completed will remain safely saved in your drive.
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-slate-200 transition"
                    >
                        Keep Downloading
                    </button>

                    <button
                        onClick={onConfirmCancel}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 flex items-center justify-center space-x-1.5 transition active:scale-95"
                    >
                        <StopCircle className="w-4 h-4" />
                        <span>Yes, Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

