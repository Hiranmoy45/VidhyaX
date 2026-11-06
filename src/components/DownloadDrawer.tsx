'use client';
import React, { useState } from 'react';
import {
    Download,
    CheckCircle2,
    XCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    Folder,
    FileText,
    Video,
    Check,
    AlertCircle,
    X,
    StopCircle
} from 'lucide-react';

export interface DownloadQueueItem {
    id: string | number;
    title: string;
    type: 'video' | 'note';
    status: 'idle' | 'resolving' | 'downloading' | 'remuxing' | 'done' | 'skipped' | 'error' | 'cancelled';
    percent: number;
    message?: string;
    sizeMb?: string;
    finalPath?: string;
    error?: string;
}

interface DownloadDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    isDownloading: boolean;
    queue: DownloadQueueItem[];
    currentItemIndex: number;
    targetBaseDir: string;
    onCancelDownload?: () => void;
}

export const DownloadDrawer: React.FC<DownloadDrawerProps> = ({
    isOpen,
    onClose,
    isDownloading,
    queue,
    currentItemIndex,
    targetBaseDir,
    onCancelDownload
}) => {
    const [isMinimized, setIsMinimized] = useState<boolean>(false);

    if (!isOpen || queue.length === 0) return null;

    const totalCount = queue.length;
    const completedCount = queue.filter(q => q.status === 'done' || q.status === 'skipped').length;
    const errorCount = queue.filter(q => q.status === 'error').length;
    const cancelledCount = queue.filter(q => q.status === 'cancelled').length;
    const overallPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const currentItem = queue[currentItemIndex] || queue[0];

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-lg shadow-2xl transition-all duration-300">
            <div className="bg-slate-900/95 border border-indigo-500/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-indigo-950/50">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                            {isDownloading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                            ) : cancelledCount > 0 ? (
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-100">
                                    {isDownloading ? 'Downloading Content' : cancelledCount > 0 ? 'Download Cancelled' : 'Download Completed'}
                                </h4>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                                    {completedCount}/{totalCount} Files
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5 flex items-center gap-1 font-mono">
                                <Folder className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="truncate">{targetBaseDir}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {isDownloading && onCancelDownload && (
                            <button
                                onClick={onCancelDownload}
                                className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center space-x-1.5 transition active:scale-95 shadow-xs"
                                title="Cancel ongoing download queue"
                            >
                                <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                                <span>Cancel</span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                            title={isMinimized ? "Expand" : "Minimize"}
                        >
                            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {!isDownloading && (
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="px-4 pt-3 pb-1">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-300 mb-1.5">
                        <span>Overall Queue Progress</span>
                        <span className="font-mono text-indigo-400 font-bold">{overallPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300 rounded-full"
                            style={{ width: `${overallPercent}%` }}
                        />
                    </div>
                </div>

                {/* Body (Collapsible) */}
                {!isMinimized && (
                    <div className="p-4 space-y-3">
                        {/* Active Item Card */}
                        {isDownloading && currentItem && (
                            <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-2 overflow-hidden pr-2">
                                        {currentItem.type === 'video' ? (
                                            <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                        ) : (
                                            <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                        )}
                                        <span className="font-semibold text-slate-200 truncate">
                                            {currentItem.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0">
                                        <span className="text-[11px] font-mono text-indigo-300 font-bold">
                                            {currentItem.percent}%
                                        </span>
                                        {onCancelDownload && (
                                            <button
                                                onClick={onCancelDownload}
                                                className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 transition"
                                                title="Cancel this download"
                                            >
                                                <StopCircle className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Active Item Bar */}
                                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-200"
                                        style={{ width: `${currentItem.percent}%` }}
                                    />
                                </div>

                                <p className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                                    <span className="truncate">{currentItem.message || 'Processing...'}</span>
                                    <span className="capitalize text-indigo-400 text-[10px] uppercase font-bold shrink-0 ml-2">
                                        {currentItem.status}
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* Queue Items List */}
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                            {queue.map((item, idx) => (
                                <div
                                    key={item.id || idx}
                                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                                        idx === currentItemIndex && isDownloading
                                            ? 'bg-indigo-950/40 border-indigo-500/50'
                                            : item.status === 'done' || item.status === 'skipped'
                                            ? 'bg-slate-950/40 border-slate-800/60 text-slate-300'
                                            : item.status === 'cancelled'
                                            ? 'bg-amber-950/20 border-amber-900/50 text-amber-300'
                                            : item.status === 'error'
                                            ? 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                                            : 'bg-slate-950/20 border-slate-900 text-slate-500'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2.5 overflow-hidden">
                                        <div className="shrink-0">
                                            {item.status === 'done' ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : item.status === 'skipped' ? (
                                                <Check className="w-3.5 h-3.5 text-slate-400" />
                                            ) : item.status === 'cancelled' ? (
                                                <StopCircle className="w-3.5 h-3.5 text-amber-400" />
                                            ) : item.status === 'error' ? (
                                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                            ) : idx === currentItemIndex && isDownloading ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                                            ) : (
                                                <span className="w-3.5 h-3.5 rounded-full border border-slate-700 block" />
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="truncate font-medium text-slate-200 text-[11px]">
                                                {item.title}
                                            </p>
                                            <span className="text-[10px] text-slate-500 font-mono">
                                                {item.sizeMb ? `${item.sizeMb} MB` : item.type === 'video' ? '720p MP4' : 'PDF'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        {item.status === 'done' && (
                                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                                                Saved
                                            </span>
                                        )}
                                        {item.status === 'skipped' && (
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                                Exists
                                            </span>
                                        )}
                                        {item.status === 'cancelled' && (
                                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                                                Cancelled
                                            </span>
                                        )}
                                        {item.status === 'error' && (
                                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                                                Failed
                                            </span>
                                        )}
                                        {idx === currentItemIndex && isDownloading && (
                                            <span className="text-[10px] font-bold text-indigo-400 font-mono">
                                                {item.percent}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer message */}
                        {!isDownloading && (
                            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                                <span className="text-slate-400 text-[11px]">
                                    Downloaded to: <span className="text-indigo-400 font-mono">{targetBaseDir}</span>
                                </span>
                                <button
                                    onClick={onClose}
                                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold transition"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

