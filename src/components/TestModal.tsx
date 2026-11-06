'use client';
import React, { useState, useEffect } from 'react';
import {
    X,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Award,
    RefreshCw,
    BookmarkCheck,
    Maximize,
    Minimize
} from 'lucide-react';
import { MockTest, Question } from '@/lib/tests';

interface TestModalProps {
    test: MockTest | null;
    onClose: () => void;
}

export const TestModal: React.FC<TestModalProps> = ({ test, onClose }) => {
    const [currentQIndex, setCurrentQIndex] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [reviewedQuestions, setReviewedQuestions] = useState<Set<number>>(new Set());
    const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
    const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    useEffect(() => {
        if (!test) return;
        setTimeLeftSeconds(test.durationMinutes * 60);
        setCurrentQIndex(0);
        setSelectedAnswers({});
        setReviewedQuestions(new Set());
        setVisitedQuestions(new Set([0]));
        setIsSubmitted(false);
    }, [test]);

    // Timer
    useEffect(() => {
        if (!test || isSubmitted || timeLeftSeconds <= 0) return;
        const timer = setInterval(() => {
            setTimeLeftSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsSubmitted(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [test, isSubmitted, timeLeftSeconds]);

    if (!test) return null;

    const questions = test.questions || [];
    const currentQ = questions[currentQIndex];

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (optIndex: number) => {
        setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: optIndex }));
    };

    const handleClearOption = () => {
        const next = { ...selectedAnswers };
        delete next[currentQIndex];
        setSelectedAnswers(next);
    };

    const handleToggleReview = () => {
        const next = new Set(reviewedQuestions);
        if (next.has(currentQIndex)) next.delete(currentQIndex);
        else next.add(currentQIndex);
        setReviewedQuestions(next);
    };

    const goToQuestion = (idx: number) => {
        setCurrentQIndex(idx);
        setVisitedQuestions(prev => new Set(prev).add(idx));
    };

    const calculateScore = () => {
        let correct = 0;
        let incorrect = 0;
        let unattempted = 0;
        const marksPerQ = questions.length ? (test.totalMarks / questions.length) : 0;

        questions.forEach((q, idx) => {
            const userAns = selectedAnswers[idx];
            if (userAns === undefined) {
                unattempted++;
            } else if (userAns === q.correctIndex) {
                correct++;
            } else {
                incorrect++;
            }
        });

        const totalScore = (correct * marksPerQ) - (incorrect * test.negativeMark);
        const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

        return { correct, incorrect, unattempted, totalScore: Math.max(0, totalScore).toFixed(2), accuracy };
    };

    return (
        <div className={`fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center overflow-y-auto transition-all duration-300 ${
            isFullscreen ? 'p-0 w-screen h-screen' : 'p-2 sm:p-5'
        }`}>
            <div className={`bg-slate-900 border border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ${
                isFullscreen ? 'w-full h-full rounded-none border-0' : 'rounded-3xl w-full max-w-6xl h-[92vh] overflow-hidden'
            }`}>
                
                {/* Test Top Bar */}
                <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800">
                                CBT Exam Simulation
                            </span>
                            <span className="text-xs text-slate-400">Total Marks: {test.totalMarks} • -{test.negativeMark} Neg</span>
                        </div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate mt-0.5">{test.title}</h2>
                    </div>

                    <div className="flex items-center space-x-3">
                        {!isSubmitted && (
                            <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2 text-indigo-400 font-mono text-xs sm:text-sm font-bold shadow-inner">
                                <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
                                <span>{formatTimer(timeLeftSeconds)}</span>
                            </div>
                        )}
                        {!isSubmitted ? (
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to submit the exam?')) setIsSubmitted(true);
                                }}
                                className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition"
                            >
                                Submit Exam
                            </button>
                        ) : null}

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Examination"}
                        >
                            {isFullscreen ? <Minimize className="w-4 h-4 text-purple-400" /> : <Maximize className="w-4 h-4" />}
                        </button>

                        <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Test Body */}
                {!isSubmitted ? (
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        
                        {/* Left: Active Question Area */}
                        <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                        Question {currentQIndex + 1} of {questions.length} ({currentQ.section})
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-mono">Single Choice (+{test.totalMarks / questions.length} / -{test.negativeMark})</span>
                                </div>

                                {/* Question Statement */}
                                <div className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                                    {currentQ.text}
                                </div>

                                {/* Options */}
                                <div className="space-y-2.5 pt-2">
                                    {currentQ.options.map((opt, oIdx) => {
                                        const isSelected = selectedAnswers[currentQIndex] === oIdx;
                                        return (
                                            <div
                                                key={oIdx}
                                                onClick={() => handleSelectOption(oIdx)}
                                                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 text-xs sm:text-sm ${
                                                    isSelected
                                                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                                                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                                                }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                                                    isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 text-slate-400'
                                                }`}>
                                                    {String.fromCharCode(65 + oIdx)}
                                                </div>
                                                <span className="leading-snug">{opt}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bottom Navigation Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800 mt-6">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleClearOption}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                                    >
                                        Clear Response
                                    </button>
                                    <button
                                        onClick={handleToggleReview}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                                            reviewedQuestions.has(currentQIndex)
                                                ? 'bg-purple-900/80 text-purple-200 border border-purple-700'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                        }`}
                                    >
                                        <BookmarkCheck className="w-3.5 h-3.5" />
                                        <span>{reviewedQuestions.has(currentQIndex) ? 'Marked for Review' : 'Mark for Review'}</span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentQIndex === 0}
                                        onClick={() => goToQuestion(currentQIndex - 1)}
                                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span>Previous</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (currentQIndex < questions.length - 1) {
                                                goToQuestion(currentQIndex + 1);
                                            } else {
                                                if (confirm('Reached last question. Submit exam?')) setIsSubmitted(true);
                                            }
                                        }}
                                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/20 transition"
                                    >
                                        <span>{currentQIndex === questions.length - 1 ? 'Save & Finish' : 'Save & Next'}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Question Palette */}
                        <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Palette</h4>

                                {/* Status Badges Legend */}
                                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pb-3 border-b border-slate-800">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded bg-emerald-600 shrink-0"></span>
                                        <span>Answered</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded bg-rose-600 shrink-0"></span>
                                        <span>Not Answered</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded bg-purple-600 shrink-0"></span>
                                        <span>Marked Review</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded bg-slate-800 shrink-0"></span>
                                        <span>Not Visited</span>
                                    </div>
                                </div>

                                {/* Palette Buttons Grid */}
                                <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
                                    {questions.map((_, idx) => {
                                        const isAnswered = selectedAnswers[idx] !== undefined;
                                        const isReviewed = reviewedQuestions.has(idx);
                                        const isVisited = visitedQuestions.has(idx);
                                        const isCurrent = currentQIndex === idx;

                                        let btnClass = 'bg-slate-800 text-slate-400';
                                        if (isReviewed) btnClass = 'bg-purple-600 text-white font-bold';
                                        else if (isAnswered) btnClass = 'bg-emerald-600 text-white font-bold';
                                        else if (isVisited) btnClass = 'bg-rose-600 text-white font-bold';

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => goToQuestion(idx)}
                                                className={`w-10 h-10 rounded-xl text-xs font-mono font-bold flex items-center justify-center transition ${btnClass} ${
                                                    isCurrent ? 'ring-2 ring-indigo-400 scale-105' : 'hover:opacity-90'
                                                }`}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                        {(() => {
                            const score = calculateScore();
                            return (
                                <>
                                    <div className="bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-600/30">
                                                <Award className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Exam Report</span>
                                                <h3 className="text-2xl font-black text-slate-100">{score.totalScore} / {test.totalMarks} Marks</h3>
                                                <p className="text-xs text-slate-400 mt-1">Accuracy: {score.accuracy}% • Correct: {score.correct} • Incorrect: {score.incorrect} • Unattempted: {score.unattempted}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setTimeLeftSeconds(test.durationMinutes * 60);
                                                setSelectedAnswers({});
                                                setReviewedQuestions(new Set());
                                                setVisitedQuestions(new Set([0]));
                                                setCurrentQIndex(0);
                                                setIsSubmitted(false);
                                            }}
                                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            <span>Retake Exam</span>
                                        </button>
                                    </div>

                                    {/* Solutions & Explanations */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Detailed Solutions & Explanations</h4>
                                        {questions.map((q, idx) => {
                                            const userAns = selectedAnswers[idx];
                                            const isCorrect = userAns === q.correctIndex;
                                            return (
                                                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-indigo-400">Question {idx + 1}</span>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                            userAns === undefined ? 'bg-slate-800 text-slate-400' : isCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                                                        }`}>
                                                            {userAns === undefined ? 'Unattempted' : isCorrect ? 'Correct (+)' : 'Incorrect (-)'}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-slate-200 font-medium">{q.text}</p>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                                                        {q.options.map((opt, oIdx) => {
                                                            const isRight = oIdx === q.correctIndex;
                                                            const isUser = userAns === oIdx;
                                                            return (
                                                                <div
                                                                    key={oIdx}
                                                                    className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                                                        isRight
                                                                            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 font-semibold'
                                                                            : isUser
                                                                            ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                                                                            : 'bg-slate-900 border-slate-800 text-slate-400'
                                                                    }`}
                                                                >
                                                                    <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                                                                    <span>{opt}</span>
                                                                    {isRight && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Solution Explanation Box */}
                                                    <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                                                        <div className="font-bold text-amber-400 flex items-center gap-1.5">
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                            <span>Step-by-Step Explanation:</span>
                                                        </div>
                                                        <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}

            </div>
        </div>
    );
};
