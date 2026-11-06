'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
    X,
    Play,
    Pause,
    RotateCcw,
    RotateCw,
    Download,
    ExternalLink,
    Volume2,
    Maximize,
    Minimize,
    FastForward,
    CheckCircle2,
    HardDrive,
    Sparkles,
    Loader2
} from 'lucide-react';

interface VideoModalProps {
    lecture: {
        id: string | number;
        title: string;
        cleanTitle?: string;
        videoId: string;
        videoKey: string;
        duration?: string;
        batchId?: string;
        subjectSlug?: string;
        topicSlug?: string;
        chapterName?: string;
    } | null;
    playlist?: any[];
    targetBaseDir?: string;
    isCompleted?: boolean;
    onToggleComplete?: (lecture: any) => void;
    onClose: () => void;
    onSelectLecture?: (lec: any) => void;
    onDownload?: (lec: any) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
    lecture,
    playlist = [],
    targetBaseDir = "F:\\PW\\Shodh Foundation Dec 2026 Mathematical Sciences",
    isCompleted = false,
    onToggleComplete,
    onClose,
    onSelectLecture,
    onDownload
}) => {
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [localVideoInfo, setLocalVideoInfo] = useState<{ exists: boolean; streamUrl?: string; sizeMb?: string; filename?: string } | null>(null);
    const [isCheckingLocal, setIsCheckingLocal] = useState<boolean>(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Check if local file exists for instant playback
    useEffect(() => {
        if (!lecture) return;
        let isMounted = true;
        setIsCheckingLocal(true);

        const chapter = lecture.chapterName || (lecture.topicSlug ? lecture.topicSlug.split('-')[0] : '');
        const checkUrl = `/api/video/check?title=${encodeURIComponent(lecture.title)}&chapter=${encodeURIComponent(chapter)}&baseDir=${encodeURIComponent(targetBaseDir)}`;

        fetch(checkUrl)
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    setLocalVideoInfo(data);
                    setIsCheckingLocal(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setLocalVideoInfo({ exists: false });
                    setIsCheckingLocal(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [lecture, targetBaseDir]);

    if (!lecture) return null;

    const playerUrl = `https://stream.aryavidya.cc/play.php?video_url=&title=${encodeURIComponent(lecture.title)}&video_id=${lecture.videoId}&batch_id=${lecture.batchId || '69c13cdeb958f08c1d1dad1e'}&subject_id=69c26584eb74f4d5c88757aa&video_type=pw&subject_id_original=69c26584eb74f4d5c88757aa&topic_id=&subject_slug=${lecture.subjectSlug || 'mathematical-sciences-779105'}&topic_slug=${lecture.topicSlug || ''}&video_key=${lecture.videoKey}&urlType=penpencilvdo`;

    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
    };

    const skipTime = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            setIsFullscreen(true);
            if (containerRef.current?.requestFullscreen) {
                containerRef.current.requestFullscreen().catch(() => {});
            }
        } else {
            setIsFullscreen(false);
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    };

    const openInNativeWindow = () => {
        window.open(playerUrl, '_blank', 'width=1280,height=750,toolbar=no,menubar=no,scrollbars=no');
    };

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
                isFullscreen ? 'p-0 w-screen h-screen' : 'p-3 sm:p-6'
            }`}
        >
            <div
                className={`bg-slate-900 border border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ${
                    isFullscreen
                        ? 'w-full h-full rounded-none border-0'
                        : 'rounded-3xl max-w-6xl w-full h-[88vh] overflow-hidden'
                }`}
            >
                {/* Modal Header */}
                <div className="px-5 py-3.5 border-b border-slate-800/90 flex items-center justify-between bg-slate-950/80">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        {localVideoInfo?.exists ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 shrink-0">
                                <HardDrive className="w-3 h-3 text-emerald-400" />
                                <span>Local HD Video</span>
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
                                HD Video Studio
                            </span>
                        )}
                        <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate" title={lecture.title}>
                            {lecture.title}
                        </h3>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                        {onToggleComplete && (
                            <button
                                onClick={() => onToggleComplete(lecture)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                                    isCompleted
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                                title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                            >
                                <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-400'}`} />
                                <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                            </button>
                        )}

                        {onDownload && (
                            <button
                                onClick={() => onDownload(lecture)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Download MP4</span>
                            </button>
                        )}

                        <button
                            onClick={openInNativeWindow}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                            title="Open in dedicated player window (100% cookie challenge bypass)"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Popout Window</span>
                        </button>

                        {/* Full Screen Toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Window"}
                        >
                            {isFullscreen ? <Minimize className="w-4 h-4 text-indigo-400" /> : <Maximize className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 rounded-xl transition"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Player Body & Sidebar */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left: Video Player */}
                    <div className="flex-1 bg-black flex flex-col justify-between relative group overflow-hidden">
                        {isCheckingLocal ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                                <p className="text-xs">Initializing HD Video Player...</p>
                            </div>
                        ) : localVideoInfo?.exists && localVideoInfo.streamUrl ? (
                            /* INSTANT LOCAL HTML5 VIDEO PLAYER */
                            <div className="flex-1 relative flex items-center justify-center bg-black">
                                <video
                                    ref={videoRef}
                                    src={localVideoInfo.streamUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-contain max-h-[75vh]"
                                />
                            </div>
                        ) : (
                            /* ONLINE STREAM / FALLBACK CONTAINER */
                            <div className="flex-1 relative flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 space-y-5">
                                <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-600/20">
                                    <Play className="w-8 h-8 ml-1" />
                                </div>

                                <div className="max-w-md space-y-1.5">
                                    <h4 className="text-base font-bold text-slate-100">{lecture.title}</h4>
                                    <p className="text-xs text-slate-400">
                                        Watch this lecture in HD quality. Choose your preferred playback method below:
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <button
                                        onClick={openInNativeWindow}
                                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Stream Online (Popout HD Player)</span>
                                    </button>

                                    {onDownload && (
                                        <button
                                            onClick={() => onDownload(lecture)}
                                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
                                        >
                                            <Download className="w-4 h-4 text-emerald-400" />
                                            <span>Download 720p for In-App Playback</span>
                                        </button>
                                    )}
                                </div>

                                <p className="text-[11px] text-slate-500 max-w-sm">
                                    💡 Tip: Downloaded videos automatically stream directly inside this platform with instant seeking and zero buffering.
                                </p>
                            </div>
                        )}

                        {/* Bottom Custom Playback Bar (When playing local video) */}
                        {localVideoInfo?.exists && (
                            <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => skipTime(-10)}
                                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                                        title="Rewind 10s"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => skipTime(10)}
                                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                                        title="Forward 10s"
                                    >
                                        <RotateCw className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[11px] text-emerald-400 font-mono ml-2">
                                        Offline Ready ({localVideoInfo.sizeMb} MB)
                                    </span>
                                </div>

                                <div className="flex items-center space-x-1.5 text-slate-400">
                                    <span className="text-[11px] mr-1">Speed:</span>
                                    {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleSpeedChange(s)}
                                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition ${
                                                playbackSpeed === s
                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            {s}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Chapter Playlist Drawer */}
                    {playlist.length > 0 && !isFullscreen && (
                        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950/70 flex flex-col">
                            <div className="p-4 border-b border-slate-800/90 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-200">Chapter Lectures</span>
                                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                                    {playlist.length} Videos
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[300px] md:max-h-none">
                                {playlist.map((lec, idx) => {
                                    const isCurrent = lec.id === lecture.id;
                                    return (
                                        <div
                                            key={lec.id || idx}
                                            onClick={() => onSelectLecture && onSelectLecture(lec)}
                                            className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                                                isCurrent
                                                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                                                    : 'hover:bg-slate-800/80 text-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2.5 overflow-hidden">
                                                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                                    isCurrent ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                                                }`}>
                                                    {idx + 1}
                                                </span>
                                                <p className="truncate text-[11px]">{lec.title}</p>
                                            </div>
                                            {isCurrent && <Play className="w-3 h-3 text-white fill-white shrink-0" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
