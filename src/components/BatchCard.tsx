'use client';
import React, { useState } from 'react';
import { Heart, Play, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export interface BatchData {
    batch_id: string;
    name: string;
    language?: string;
    exam?: string;
    byName?: string;
    photo?: string;
    class?: string;
    amount?: number | string;
    featured?: boolean;
}

interface BatchCardProps {
    batch: BatchData;
    isFavorite: boolean;
    isEnrolled: boolean;
    onToggleFavorite: (b: BatchData, e: React.MouseEvent) => void;
    onSelectBatch: (b: BatchData) => void;
    onEnrollBatch?: (b: BatchData, e: React.MouseEvent) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({
    batch,
    isFavorite,
    isEnrolled,
    onToggleFavorite,
    onSelectBatch,
    onEnrollBatch
}) => {
    const [imgError, setImgError] = useState(false);

    // Format amount
    const formatAmount = (amt: any) => {
        if (amt === 0 || amt === '0' || amt === 'Free' || amt === 'free') {
            return <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free</span>;
        }
        if (!amt) return <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free</span>;
        const num = typeof amt === 'number' ? amt : parseInt(amt, 10);
        if (isNaN(num)) return <span className="text-stone-800 dark:text-slate-200 font-bold">{amt}</span>;
        return <span className="text-stone-900 dark:text-slate-100 font-bold font-mono">₹{num.toLocaleString('en-IN')}</span>;
    };

    // Color logic for exam pill
    const getExamBadgeStyle = (examStr = '') => {
        const up = examStr.toUpperCase();
        if (up.includes('JEE')) return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800';
        if (up.includes('NEET')) return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800';
        if (up.includes('CSIR')) return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800';
        if (up.includes('GATE')) return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800';
        if (up.includes('OLYMPIAD')) return 'bg-yellow-50 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-200/80 dark:border-yellow-800';
        if (up.includes('UPSC')) return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800';
        return 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700';
    };

    const photoUrl = batch.photo || 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/bafda9b4-e53a-4801-a27b-c0c03484b0ee.png';

    return (
        <div
            onClick={() => onSelectBatch(batch)}
            className="bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
        >
            {/* Top Image Container */}
            <div className="relative aspect-[16/9] w-full bg-stone-100 dark:bg-slate-950 overflow-hidden">
                {!imgError ? (
                    <img
                        src={photoUrl}
                        alt={batch.name}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-600 via-orange-600 to-indigo-900 flex flex-col items-center justify-center p-4 text-center text-white">
                        <BookOpen className="w-10 h-10 mb-2 opacity-80" />
                        <p className="text-xs font-bold line-clamp-2">{batch.name}</p>
                    </div>
                )}

                {/* Floating Heart Button */}
                <button
                    onClick={(e) => onToggleFavorite(batch, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-stone-200/90 dark:border-slate-700/80 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition z-10"
                    title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${
                            isFavorite
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-stone-400 dark:text-slate-400 group-hover:text-stone-600 dark:group-hover:text-slate-200'
                        }`}
                    />
                </button>

                {/* Featured / Flagship Badge */}
                {batch.featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-600/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Flagship</span>
                    </div>
                )}
            </div>

            {/* Subtle Dashed Divider (Matching AryaVidya screenshot) */}
            <div className="border-t border-dashed border-stone-200/90 dark:border-slate-800" />

            {/* Card Content Body */}
            <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                    {/* Tags row: Language & Exam pills */}
                    <div className="flex items-center space-x-2">
                        {batch.language && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800">
                                {batch.language}
                            </span>
                        )}
                        {batch.exam && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getExamBadgeStyle(batch.exam)}`}>
                                {batch.exam}
                            </span>
                        )}
                    </div>

                    {/* Batch Title */}
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
                        {batch.name}
                    </h3>

                    {/* Subtitle / Description */}
                    <p className="text-xs text-stone-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                        {batch.byName || 'Complete course batch with lectures, notes, DPPs and tests.'}
                    </p>
                </div>

                {/* Bottom Row: Amount & Action */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-slate-800/80">
                    <div className="text-sm">
                        {formatAmount(batch.amount)}
                    </div>

                    <div className="flex items-center space-x-1.5">
                        {isEnrolled ? (
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span>Enrolled</span>
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-stone-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/40 transition">
                                Open Batch →
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

