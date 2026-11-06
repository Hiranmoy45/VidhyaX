'use client';
import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText, Loader2, Maximize, Minimize } from 'lucide-react';

interface PdfModalProps {
    note: {
        id: string | number;
        title: string;
        cleanTitle?: string;
        scheduleId?: string;
        pdfUrl?: string | null;
        batchId?: string;
        subjectSlug?: string;
        topicSlug?: string;
    } | null;
    onClose: () => void;
    onDownload?: (note: any) => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({ note, onClose, onDownload }) => {
    const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    useEffect(() => {
        if (!note) return;
        if (note.pdfUrl) {
            setResolvedUrl(note.pdfUrl);
            setIsLoading(false);
            return;
        }

        // Fetch schedule details if PDF url needs resolving
        if (note.scheduleId) {
            setIsLoading(true);
            const bId = note.batchId || '69c13cdeb958f08c1d1dad1e';
            const sSlug = note.subjectSlug || 'mathematical-sciences-779105';
            const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v1/batches/${bId}/subject/${sSlug}/schedule/${note.scheduleId}/schedule-details`;

            fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://pwthor.live/',
                    'Origin': 'https://pwthor.live'
                }
            })
                .then(r => r.json())
                .then(j => {
                    const hwList = j.data?.homeworkIds || [];
                    for (const hw of hwList) {
                        const att = hw.attachmentIds?.[0];
                        if (att?.baseUrl && att?.key) {
                            setResolvedUrl(`${att.baseUrl}${att.key}`);
                            break;
                        }
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [note]);

    if (!note) return null;

    return (
        <div className={`fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
            isFullscreen ? 'p-0 w-screen h-screen' : 'p-3 sm:p-6'
        }`}>
            <div className={`bg-slate-900 border border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ${
                isFullscreen ? 'w-full h-full rounded-none border-0' : 'rounded-3xl w-full max-w-5xl h-[88vh] overflow-hidden'
            }`}>
                
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800/80 flex items-center justify-center text-purple-400 shrink-0">
                            <FileText className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate" title={note.title}>
                            {note.title}
                        </h3>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                        {onDownload && (
                            <button
                                onClick={() => onDownload({ ...note, pdfUrl: resolvedUrl })}
                                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Save PDF</span>
                            </button>
                        )}
                        {resolvedUrl && (
                            <a
                                href={resolvedUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
                                title="Open PDF in Browser Tab"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                        >
                            {isFullscreen ? <Minimize className="w-4 h-4 text-purple-400" /> : <Maximize className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 rounded-xl transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer Body */}
                <div className="flex-1 bg-slate-950 relative flex items-center justify-center">
                    {isLoading ? (
                        <div className="text-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
                            <p className="text-xs text-slate-400">Loading High-Res PDF Document...</p>
                        </div>
                    ) : resolvedUrl ? (
                        <iframe
                            src={`${resolvedUrl}#toolbar=1&navpanes=1`}
                            className="w-full h-full border-0"
                            title={note.title}
                        />
                    ) : (
                        <div className="text-center p-6 space-y-2">
                            <p className="text-xs text-slate-400">PDF document not available for preview.</p>
                            {onDownload && (
                                <button
                                    onClick={() => onDownload(note)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold"
                                >
                                    Try Direct Download
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
