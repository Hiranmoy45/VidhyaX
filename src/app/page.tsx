'use client';
import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarTab } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { BatchCard, BatchData } from '@/components/BatchCard';
import { VideoModal } from '@/components/VideoModal';
import { PdfModal } from '@/components/PdfModal';
import { TestModal } from '@/components/TestModal';
import { DownloadDrawer, DownloadQueueItem } from '@/components/DownloadDrawer';
import { CancelDownloadModal } from '@/components/CancelDownloadModal';
import { MOCK_TESTS, MockTest, generateTestSession } from '@/lib/tests';
import curriculumFallback from '@/lib/curriculumFallback.json';
import {
    Search,
    BookOpen,
    Video,
    FileText,
    Download,
    Eye,
    CheckSquare,
    Square,
    Play,
    Sparkles,
    Layers,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Clock,
    Flame,
    ArrowRight,
    Award,
    Calendar,
    Folder,
    CheckCheck,
    Check,
    AlertCircle,
    GraduationCap,
    Compass,
    Plus,
    Trash2,
    ExternalLink,
    Filter,
    UserCheck,
    Maximize,
    Minimize,
    Heart,
    History as HistoryIcon,
    FolderCheck,
    Sun,
    Moon
} from 'lucide-react';

export default function Home() {
    // Navigation tab
    const [activeTab, setActiveTab] = useState<SidebarTab>('batches');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    // Theme state (Light / Dark)
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Global Search & Exam Filter
    const [globalSearch, setGlobalSearch] = useState<string>('');
    const [selectedExamCategory, setSelectedExamCategory] = useState<string>('ALL');

    // 18,299 Batches Catalog State
    const [catalogBatches, setCatalogBatches] = useState<BatchData[]>([]);
    const [catalogTotal, setCatalogTotal] = useState<number>(0);
    const [catalogPage, setCatalogPage] = useState<number>(1);
    const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(false);

    // Favorites State (Persisted in localStorage)
    const [favoriteBatchIds, setFavoriteBatchIds] = useState<Set<string>>(new Set());
    const [favoriteBatches, setFavoriteBatches] = useState<BatchData[]>([]);

    // History State (Persisted in localStorage)
    const [historyBatches, setHistoryBatches] = useState<BatchData[]>([]);

    // Enrolled Batches State (Persisted in localStorage)
    const [enrolledBatches, setEnrolledBatches] = useState<any[]>([
        {
            batch_id: '69c13cdeb958f08c1d1dad1e',
            name: 'Shodh Foundation Dec 2026 Mathematical Sciences',
            exam: 'CSIR-NET',
            language: 'Hinglish',
            byName: 'Pure & Applied Mathematics, COV, Linear Algebra, Real Analysis',
            photo: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/bafda9b4-e53a-4801-a27b-c0c03484b0ee.png',
            amount: 4999
        }
    ]);

    // Active Course / LMS state
    const [batchInput, setBatchInput] = useState<string>('69c13cdeb958f08c1d1dad1e');
    const [currentBatch, setCurrentBatch] = useState<any>(null);
    const [activeSubjectSlug, setActiveSubjectSlug] = useState<string>('mathematical-sciences-779105');
    const [allTopics, setAllTopics] = useState<any[]>([]);
    const [topicSearch, setTopicSearch] = useState<string>('');
    const [activeTopic, setActiveTopic] = useState<any>(null);
    const [chapterContents, setChapterContents] = useState<{ videos: any[]; notes: any[]; exercises: any[] }>({
        videos: [],
        notes: [],
        exercises: []
    });
    const [contentSubTab, setContentSubTab] = useState<'videos' | 'notes' | 'exercises'>('videos');

    // Destination Folder State
    const [targetFolder, setTargetFolder] = useState<string>("F:\\PW\\Shodh Foundation Dec 2026 Mathematical Sciences");
    const [isEditingFolder, setIsEditingFolder] = useState<boolean>(false);

    // Tests state
    const [realCourseTests, setRealCourseTests] = useState<any[]>([]);
    const [isLoadingTests, setIsLoadingTests] = useState<boolean>(false);
    const [testFilter, setTestFilter] = useState<'all' | 'full' | 'chapter' | 'monthly' | 'practice'>('all');
    const [testSearch, setTestSearch] = useState<string>('');

    // Item Selection State (using IDs)
    const [selectedVideoIds, setSelectedVideoIds] = useState<Set<string | number>>(new Set());
    const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string | number>>(new Set());

    // Completed Video Lectures State (Persisted in localStorage)
    const [completedVideoIds, setCompletedVideoIds] = useState<Set<string | number>>(new Set());

    // Download Queue & Live Progress
    const [isDownloadDrawerOpen, setIsDownloadDrawerOpen] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [downloadQueue, setDownloadQueue] = useState<DownloadQueueItem[]>([]);
    const [currentDownloadIndex, setCurrentDownloadIndex] = useState<number>(0);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
    const downloadAbortControllerRef = React.useRef<AbortController | null>(null);

    // Modals
    const [activeVideoLecture, setActiveVideoLecture] = useState<any>(null);
    const [activePdfNote, setActivePdfNote] = useState<any>(null);
    const [activeTest, setActiveTest] = useState<MockTest | null>(null);

    // Single link downloader state
    const [singleLink, setSingleLink] = useState<string>('');
    const [singleAnalysis, setSingleAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

    // Loading states
    const [isLoadingCourse, setIsLoadingCourse] = useState<boolean>(false);
    const [isLoadingContents, setIsLoadingContents] = useState<boolean>(false);

    // 1. Initialize Theme from localStorage
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('pw_theme') as 'light' | 'dark' | null;
            if (savedTheme) {
                setTheme(savedTheme);
                if (savedTheme === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
            } else {
                setTheme('light');
                document.documentElement.classList.remove('dark');
            }
        } catch { }
    }, []);

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        try {
            localStorage.setItem('pw_theme', next);
        } catch { }
        if (next === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // 2. Initialize Enrolled, Favorites & History from localStorage
    useEffect(() => {
        try {
            const savedEnrolled = localStorage.getItem('pw_enrolled_batches');
            if (savedEnrolled) {
                const parsed = JSON.parse(savedEnrolled);
                if (Array.isArray(parsed) && parsed.length > 0) setEnrolledBatches(parsed);
            }
            const savedFavs = localStorage.getItem('pw_favorite_batches');
            if (savedFavs) {
                const parsed = JSON.parse(savedFavs);
                if (Array.isArray(parsed)) {
                    setFavoriteBatches(parsed);
                    setFavoriteBatchIds(new Set(parsed.map(b => b.batch_id)));
                }
            }
            const savedHist = localStorage.getItem('pw_history_batches');
            if (savedHist) {
                const parsed = JSON.parse(savedHist);
                if (Array.isArray(parsed)) setHistoryBatches(parsed);
            }
            const savedCompleted = localStorage.getItem('pw_completed_videos');
            if (savedCompleted) {
                const parsed = JSON.parse(savedCompleted);
                if (Array.isArray(parsed)) setCompletedVideoIds(new Set(parsed));
            }
        } catch (e) {
            console.error('Failed to parse saved state:', e);
        }

        // Preload default course
        loadCourse('69c13cdeb958f08c1d1dad1e');
        loadTests('69c2639ebcad7cea7fdd0c08');
    }, []);

    // 3. Fetch Catalog Batches with Debounce
    const fetchCatalog = async (page = 1, exam = 'ALL', query = '', append = false) => {
        setIsLoadingCatalog(true);
        try {
            const url = `/api/batches/catalog?page=${page}&limit=24&exam=${encodeURIComponent(exam)}&q=${encodeURIComponent(query)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.success && Array.isArray(data.batches)) {
                if (append) {
                    setCatalogBatches(prev => [...prev, ...data.batches]);
                } else {
                    setCatalogBatches(data.batches);
                }
                setCatalogTotal(data.total);
                setCatalogPage(page);
            }
        } catch (e) {
            console.error('Catalog fetch error:', e);
        } finally {
            setIsLoadingCatalog(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCatalog(1, selectedExamCategory, globalSearch, false);
        }, 250);
        return () => clearTimeout(timer);
    }, [selectedExamCategory, globalSearch]);

    // Handle Favorite Toggle
    const handleToggleFavorite = (batch: BatchData, e: React.MouseEvent) => {
        e.stopPropagation();
        const nextIds = new Set(favoriteBatchIds);
        let updatedList = [...favoriteBatches];

        if (nextIds.has(batch.batch_id)) {
            nextIds.delete(batch.batch_id);
            updatedList = updatedList.filter(b => b.batch_id !== batch.batch_id);
        } else {
            nextIds.add(batch.batch_id);
            updatedList.push(batch);
        }

        setFavoriteBatchIds(nextIds);
        setFavoriteBatches(updatedList);
        try {
            localStorage.setItem('pw_favorite_batches', JSON.stringify(updatedList));
        } catch { }
    };

    // Toggle Mark Video as Completed
    const toggleVideoCompleted = (id: string | number) => {
        const next = new Set(completedVideoIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setCompletedVideoIds(next);
        try {
            localStorage.setItem('pw_completed_videos', JSON.stringify([...next]));
        } catch { }
    };

    // Record History
    const recordHistory = (batch: BatchData) => {
        try {
            const filtered = historyBatches.filter(b => b.batch_id !== batch.batch_id);
            const updated = [batch, ...filtered].slice(0, 30);
            setHistoryBatches(updated);
            localStorage.setItem('pw_history_batches', JSON.stringify(updated));
        } catch { }
    };

    // Select Batch (Opens Curriculum View)
    const handleSelectBatch = (batch: BatchData) => {
        recordHistory(batch);
        setBatchInput(batch.batch_id);
        loadCourse(batch.batch_id);
        setActiveTab('curriculum');
    };

    // Enroll in Batch
    const handleEnroll = (batch: BatchData, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (enrolledBatches.some(b => b.batch_id === batch.batch_id)) {
            handleSelectBatch(batch);
            return;
        }
        const updated = [...enrolledBatches, batch];
        setEnrolledBatches(updated);
        try {
            localStorage.setItem('pw_enrolled_batches', JSON.stringify(updated));
        } catch { }
        alert(`🎉 Enrolled in "${batch.name}"!\nSaved to your Dashboard.`);
    };

    // Course loader
    const loadCourse = async (inputStr: string) => {
        setIsLoadingCourse(true);
        try {
            const res = await fetch(`/api/batch?input=${encodeURIComponent(inputStr)}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            setCurrentBatch(data.batchInfo);
            if (data.batchInfo.testCats?.[0]) {
                loadTests(data.batchInfo.testCats[0]);
            }
            if (data.batchInfo.subjects?.length) {
                const preferred = data.batchInfo.subjects.find((s: any) => s.slug.includes('math')) || data.batchInfo.subjects[0];
                setActiveSubjectSlug(preferred.slug);
                await loadTopics(data.batchInfo.batchId, preferred.slug);
            }
        } catch (e: any) {
            console.error('Course load failed:', e);
        } finally {
            setIsLoadingCourse(false);
        }
    };

    const loadTopics = async (batchId: string, subjectSlug: string) => {
        try {
            const res = await fetch(`/api/topics?batchId=${batchId}&subjectSlug=${subjectSlug}`);
            const data = await res.json();
            if (data.success && data.topics?.length) {
                setAllTopics(data.topics || []);
                selectChapter(data.topics[0], batchId, subjectSlug);
                return;
            }
        } catch (e) {
            console.error('API topics fetch error:', e);
        }

        // Direct resilient fallback (guarantees curriculum renders on Vercel)
        if (curriculumFallback.topics?.length) {
            setAllTopics(curriculumFallback.topics as any);
            selectChapter(curriculumFallback.topics[0], batchId, subjectSlug);
        }
    };

    const loadTests = async (testCatId = '69c2639ebcad7cea7fdd0c08') => {
        setIsLoadingTests(true);
        try {
            const res = await fetch(`/api/tests?testCatId=${testCatId}`);
            const data = await res.json();
            if (data.success && data.realCourseTests) {
                setRealCourseTests(data.realCourseTests);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingTests(false);
        }
    };

    const selectChapter = async (topic: any, bId?: string, sSlug?: string) => {
        setActiveTopic(topic);
        setIsLoadingContents(true);
        const batch = bId || currentBatch?.batchId || '69c13cdeb958f08c1d1dad1e';
        const sub = sSlug || activeSubjectSlug;

        try {
            const res = await fetch(`/api/contents?batchId=${batch}&subjectSlug=${sub}&topicSlug=${topic.slug}`);
            const data = await res.json();
            if (data.success && (data.videos?.length || data.notes?.length)) {
                const vids = data.videos || [];
                const nts = data.notes || [];
                const exs = data.exercises || [];
                setChapterContents({ videos: vids, notes: nts, exercises: exs });
                setSelectedVideoIds(new Set(vids.map((v: any) => v.id)));
                setSelectedNoteIds(new Set(nts.map((n: any) => n.id)));
                return;
            }
        } catch (e) {
            console.error('API contents fetch error:', e);
        }

        // Direct resilient fallback (guarantees chapter contents render on Vercel)
        const fb = (curriculumFallback.contentsMap as any)?.[topic.slug];
        if (fb) {
            const vids = fb.videos || [];
            const nts = fb.notes || [];
            const exs = fb.exercises || [];
            setChapterContents({ videos: vids, notes: nts, exercises: exs });
            setSelectedVideoIds(new Set(vids.map((v: any) => v.id)));
            setSelectedNoteIds(new Set(nts.map((n: any) => n.id)));
        }
    };

    // Selection Toggles
    const toggleSelectVideo = (id: string | number) => {
        const next = new Set(selectedVideoIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedVideoIds(next);
    };

    const toggleSelectAllVideos = () => {
        if (selectedVideoIds.size === chapterContents.videos.length) setSelectedVideoIds(new Set());
        else setSelectedVideoIds(new Set(chapterContents.videos.map(v => v.id)));
    };

    const toggleSelectNote = (id: string | number) => {
        const next = new Set(selectedNoteIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedNoteIds(next);
    };

    const toggleSelectAllNotes = () => {
        if (selectedNoteIds.size === chapterContents.notes.length) setSelectedNoteIds(new Set());
        else setSelectedNoteIds(new Set(chapterContents.notes.map(n => n.id)));
    };

    // Filter topics
    const filteredTopics = allTopics.filter(t =>
        t.name.toLowerCase().includes(topicSearch.toLowerCase()) ||
        t.slug.toLowerCase().includes(topicSearch.toLowerCase())
    );

    // Filter tests
    const filteredTests = realCourseTests.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(testSearch.toLowerCase());
        if (!matchesSearch) return false;
        const cat = (t.category || '').toLowerCase();
        const nameLower = t.name.toLowerCase();
        if (testFilter === 'full') return cat === 'full' || nameLower.includes('full length') || t.maxDuration >= 120;
        if (testFilter === 'chapter') return cat === 'chapter' || nameLower.includes('chapter');
        if (testFilter === 'monthly') return cat === 'monthly' || nameLower.includes('monthly');
        if (testFilter === 'practice') return cat === 'practice' || nameLower.includes('practice') || nameLower.includes('dpp');
        return true;
    });

    // Confirm Cancel Download
    const handleConfirmCancelDownload = () => {
        if (downloadAbortControllerRef.current) {
            downloadAbortControllerRef.current.abort();
            downloadAbortControllerRef.current = null;
        }
        setIsDownloading(false);
        setIsCancelModalOpen(false);
        setDownloadQueue(prev => prev.map((item) => {
            if (item.status === 'downloading' || item.status === 'idle' || item.status === 'resolving') {
                return { ...item, status: 'cancelled', message: 'Cancelled by user' };
            }
            return item;
        }));
    };

    // Real-time Streaming Download with SSE
    const startStreamingDownload = async (itemsToDownload: any[]) => {
        if (!itemsToDownload.length) {
            alert('Please select at least 1 item to download.');
            return;
        }

        const controller = new AbortController();
        downloadAbortControllerRef.current = controller;

        const queue: DownloadQueueItem[] = itemsToDownload.map((item, idx) => ({
            id: item.id || idx,
            title: item.title,
            type: item.type === 'note' ? 'note' : 'video',
            status: 'idle',
            percent: 0
        }));

        setDownloadQueue(queue);
        setIsDownloadDrawerOpen(true);
        setIsDownloading(true);
        setCurrentDownloadIndex(0);

        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    items: itemsToDownload.map(item => ({
                        ...item,
                        chapterName: item.chapterName || activeTopic?.name || 'General Chapter'
                    })),
                    targetBaseDir: targetFolder,
                    batchId: currentBatch?.batchId || '69c13cdeb958f08c1d1dad1e',
                    subjectSlug: activeSubjectSlug
                })
            });

            if (!response.body) throw new Error('No SSE stream available');

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || '';

                for (const block of lines) {
                    if (block.startsWith('data: ')) {
                        try {
                            const event = JSON.parse(block.replace('data: ', '').trim());
                            handleDownloadEvent(event);
                        } catch (err) {
                            console.error('Error parsing SSE event:', err);
                        }
                    }
                }
            }
        } catch (e: any) {
            if (e.name === 'AbortError') {
                console.log('Download aborted by user.');
            } else {
                alert('Download failed: ' + e.message);
            }
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadEvent = (event: any) => {
        if (event.type === 'cancelled') {
            setIsDownloading(false);
            setDownloadQueue(prev => prev.map((q) =>
                q.status === 'downloading' || q.status === 'idle' || q.status === 'resolving'
                    ? { ...q, status: 'cancelled', message: 'Cancelled by user' }
                    : q
            ));
        } else if (event.type === 'start') {
            if (typeof event.itemIndex === 'number') {
                setCurrentDownloadIndex(event.itemIndex);
                setDownloadQueue(prev => prev.map((q, idx) =>
                    idx === event.itemIndex ? { ...q, status: 'downloading', percent: 0, message: event.message || 'Starting...' } : q
                ));
            }
        } else if (event.type === 'item_start') {
            if (typeof event.itemIndex === 'number') {
                setCurrentDownloadIndex(event.itemIndex);
                setDownloadQueue(prev => prev.map((q, idx) =>
                    idx === event.itemIndex
                        ? { ...q, status: 'resolving', percent: 0, message: event.message || 'Resolving stream & assets...' }
                        : q
                ));
            }
        } else if (event.type === 'item_progress') {
            if (typeof event.itemIndex === 'number') {
                setCurrentDownloadIndex(event.itemIndex);
                setDownloadQueue(prev => prev.map((q, idx) =>
                    idx === event.itemIndex
                        ? {
                            ...q,
                            status: (event.status || 'downloading') as any,
                            percent: typeof event.percent === 'number' ? event.percent : q.percent,
                            sizeMb: event.sizeMb || q.sizeMb,
                            message: event.message || q.message
                        }
                        : q
                ));
            }
        } else if (event.type === 'item_done' || event.type === 'item_complete') {
            if (typeof event.itemIndex === 'number') {
                setDownloadQueue(prev => prev.map((q, idx) =>
                    idx === event.itemIndex
                        ? {
                            ...q,
                            status: event.skipped ? 'skipped' : 'done',
                            percent: 100,
                            sizeMb: event.sizeMb || q.sizeMb,
                            finalPath: event.finalPath,
                            message: event.message || (event.skipped ? 'Already exists' : 'Saved successfully')
                        }
                        : q
                ));
                // Automatically advance to the next item in queue
                setCurrentDownloadIndex(event.itemIndex + 1);
            }
        } else if (event.type === 'item_error') {
            if (typeof event.itemIndex === 'number') {
                setDownloadQueue(prev => prev.map((q, idx) =>
                    idx === event.itemIndex
                        ? { ...q, status: 'error', error: event.error, message: event.message || event.error }
                        : q
                ));
                setCurrentDownloadIndex(event.itemIndex + 1);
            }
        } else if (event.type === 'complete' || event.type === 'job_complete') {
            setIsDownloading(false);
        }
    };

    const totalLecturesCount = allTopics.reduce((acc, t) => acc + (t.videos || 0), 0);
    const totalNotesCount = allTopics.reduce((acc, t) => acc + (t.notes || 0), 0);

    const examCategories = [
        'ALL',
        'IIT-JEE',
        'NEET',
        'CSIR-NET',
        'GATE',
        'FOUNDATION',
        'OLYMPIAD',
        'UPSC',
        'DEFENCE'
    ];

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-[#f6f5f1] dark:bg-[#0b0f19] text-stone-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500 selection:text-white`}>

            {/* Left Sidebar (Desktop Fixed & Mobile Drawer) */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                favoritesCount={favoriteBatches.length}
                enrolledCount={enrolledBatches.length}
                theme={theme}
                toggleTheme={toggleTheme}
                onOpenDownloads={() => setIsDownloadDrawerOpen(true)}
                activeDownloadCount={downloadQueue.filter(q => q.status === 'downloading').length}
                isOpenMobile={isMobileMenuOpen}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content Area (Offset for Desktop Sidebar) */}
            <div className="md:ml-64 flex-1 flex flex-col min-h-screen">

                {/* Top Header Bar */}
                <TopHeader
                    searchQuery={globalSearch}
                    onSearchChange={setGlobalSearch}
                    activeTab={activeTab}
                    courseName={currentBatch?.name}
                    onBackToBatches={() => setActiveTab('batches')}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex-1 w-full space-y-6">

                    {/* SECTION: BATCHES CATALOG (Exact VidhyaX / PW style from user screenshot) */}
                    {activeTab === 'batches' && (
                        <div className="space-y-6">

                            {/* Exam Category Filter Chips & Custom Batch ID Loader */}
                            <div className="bg-white dark:bg-slate-900/90 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
                                    {examCategories.map((cat) => {
                                        const isSelected = selectedExamCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedExamCategory(cat)}
                                                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${isSelected
                                                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                                                        : 'bg-stone-100 hover:bg-stone-200/80 text-stone-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                                                    }`}
                                            >
                                                {cat === 'ALL' ? 'All Batches' : cat}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom ID / Link Loader */}
                                <div className="flex items-center space-x-2 shrink-0">
                                    <input
                                        type="text"
                                        value={batchInput}
                                        onChange={(e) => setBatchInput(e.target.value)}
                                        placeholder="Paste custom Batch ID / URL..."
                                        className="bg-[#f6f5f1] dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl px-3.5 py-1.5 text-xs text-stone-900 dark:text-slate-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 w-48 sm:w-56"
                                    />
                                    <button
                                        onClick={() => {
                                            loadCourse(batchInput);
                                            setActiveTab('curriculum');
                                        }}
                                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold shadow-sm transition"
                                    >
                                        Open ID
                                    </button>
                                </div>
                            </div>

                            {/* Catalog Header & Count */}
                            <div className="flex items-center justify-between px-1 text-xs text-stone-500 dark:text-slate-400">
                                <span>
                                    Showing <strong className="text-stone-900 dark:text-slate-200">{catalogBatches.length}</strong> of{' '}
                                    <strong className="text-stone-900 dark:text-slate-200">{catalogTotal.toLocaleString()}</strong> Courses
                                </span>
                                {isLoadingCatalog && (
                                    <span className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Searching PW courses...</span>
                                    </span>
                                )}
                            </div>

                            {/* 3-Column Batches Grid (Matching Screenshot) */}
                            {catalogBatches.length === 0 && !isLoadingCatalog ? (
                                <div className="text-center py-24 bg-white dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 rounded-3xl space-y-3">
                                    <BookOpen className="w-12 h-12 mx-auto text-stone-400 dark:text-slate-600" />
                                    <h3 className="text-base font-bold text-stone-800 dark:text-slate-200">
                                        No courses found for "{globalSearch}"
                                    </h3>
                                    <p className="text-xs text-stone-500 dark:text-slate-400 max-w-sm mx-auto">
                                        Try keywords like "Lakshya", "Yakeen", "CSIR", "Shodh", "Math", "Physics", or reset filter.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setGlobalSearch('');
                                            setSelectedExamCategory('ALL');
                                        }}
                                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-800 dark:text-slate-200 rounded-2xl text-xs font-bold transition"
                                    >
                                        Reset Search
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {catalogBatches.map((batch) => {
                                        const isFav = favoriteBatchIds.has(batch.batch_id);
                                        const isEnr = enrolledBatches.some(b => b.batch_id === batch.batch_id || b.id === batch.batch_id);

                                        return (
                                            <BatchCard
                                                key={batch.batch_id}
                                                batch={batch}
                                                isFavorite={isFav}
                                                isEnrolled={isEnr}
                                                onToggleFavorite={handleToggleFavorite}
                                                onSelectBatch={handleSelectBatch}
                                                onEnrollBatch={handleEnroll}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {/* Load More Button */}
                            {catalogBatches.length < catalogTotal && !isLoadingCatalog && (
                                <div className="text-center pt-4">
                                    <button
                                        onClick={() => fetchCatalog(catalogPage + 1, selectedExamCategory, globalSearch, true)}
                                        className="px-6 py-2.5 bg-white dark:bg-slate-900 hover:bg-stone-50 dark:hover:bg-slate-800 border border-stone-200 dark:border-slate-800 text-stone-800 dark:text-slate-200 rounded-2xl text-xs font-bold shadow-xs transition"
                                    >
                                        Load More Batches (+24)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION: FAVORITES */}
                    {activeTab === 'favorites' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900/90 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                                        Personal Collection
                                    </span>
                                    <h2 className="text-xl font-black text-stone-900 dark:text-white mt-1">
                                        Favorite Batches ({favoriteBatches.length})
                                    </h2>
                                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                                        Batches you have saved with the heart icon for quick daily access.
                                    </p>
                                </div>
                            </div>

                            {favoriteBatches.length === 0 ? (
                                <div className="text-center py-24 bg-white dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 rounded-3xl space-y-3">
                                    <Heart className="w-12 h-12 mx-auto text-rose-300 dark:text-rose-900/60" />
                                    <h3 className="text-base font-bold text-stone-800 dark:text-slate-200">No favorite batches yet</h3>
                                    <p className="text-xs text-stone-500 dark:text-slate-400 max-w-sm mx-auto">
                                        Click the heart icon on any batch in the Batches catalog to add it here.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('batches')}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-2xl text-xs font-bold"
                                    >
                                        Explore Batches
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favoriteBatches.map((batch) => (
                                        <BatchCard
                                            key={batch.batch_id}
                                            batch={batch}
                                            isFavorite={true}
                                            isEnrolled={enrolledBatches.some(b => b.batch_id === batch.batch_id)}
                                            onToggleFavorite={handleToggleFavorite}
                                            onSelectBatch={handleSelectBatch}
                                            onEnrollBatch={handleEnroll}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION: DASHBOARD (MY ENROLLED BATCHES) */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-amber-500/10 via-white to-orange-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/40 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
                                <div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        Learning Hub
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-2">
                                        My Enrolled Batches ({enrolledBatches.length})
                                    </h2>
                                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                                        Your registered courses. Click any course to resume learning where you left off.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setActiveTab('batches')}
                                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-amber-600/25 transition shrink-0"
                                >
                                    <Compass className="w-4 h-4" />
                                    <span>Browse All Batches</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrolledBatches.map((batch) => {
                                    const bData: BatchData = {
                                        batch_id: batch.batch_id || batch.id,
                                        name: batch.name,
                                        language: batch.language || 'Hinglish',
                                        exam: batch.exam || batch.category || 'CSIR-NET',
                                        byName: batch.byName || batch.description,
                                        photo: batch.photo || batch.previewImage,
                                        amount: batch.amount
                                    };

                                    return (
                                        <BatchCard
                                            key={bData.batch_id}
                                            batch={bData}
                                            isFavorite={favoriteBatchIds.has(bData.batch_id)}
                                            isEnrolled={true}
                                            onToggleFavorite={handleToggleFavorite}
                                            onSelectBatch={handleSelectBatch}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* SECTION: HISTORY */}
                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900/90 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Recent Activity</span>
                                <h2 className="text-xl font-black text-stone-900 dark:text-white mt-1">
                                    Recently Opened Courses ({historyBatches.length})
                                </h2>
                            </div>

                            {historyBatches.length === 0 ? (
                                <div className="text-center py-20 bg-white dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 rounded-3xl">
                                    <HistoryIcon className="w-10 h-10 mx-auto text-stone-400 mb-2" />
                                    <p className="text-xs text-stone-500">No recently opened courses recorded yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {historyBatches.map((batch) => (
                                        <BatchCard
                                            key={batch.batch_id}
                                            batch={batch}
                                            isFavorite={favoriteBatchIds.has(batch.batch_id)}
                                            isEnrolled={enrolledBatches.some(b => b.batch_id === batch.batch_id)}
                                            onToggleFavorite={handleToggleFavorite}
                                            onSelectBatch={handleSelectBatch}
                                            onEnrollBatch={handleEnroll}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION: ACTIVE CURRICULUM (LECTURES, NOTES & DPPS) */}
                    {activeTab === 'curriculum' && (
                        <div className="space-y-6">

                            {/* Course Header Banner */}
                            <div className="bg-white dark:bg-slate-900/90 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/25 shrink-0">
                                            <BookOpen className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                    Active Course
                                                </span>
                                                <span className="text-xs font-mono text-stone-400 dark:text-slate-500">
                                                    ID: {currentBatch?.batchId}
                                                </span>
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1">
                                                {currentBatch?.name || 'Loading Course...'}
                                            </h2>
                                            <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                                                {currentBatch?.subjects?.find((s: any) => s.slug === activeSubjectSlug)?.subject || 'Comprehensive Syllabus'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 shrink-0">
                                        <button
                                            onClick={() => setActiveTab('batches')}
                                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-slate-200 rounded-2xl text-xs font-bold transition"
                                        >
                                            Switch Course
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('tests')}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold shadow-sm transition"
                                        >
                                            Mock Tests ({realCourseTests.length || 20})
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                                    <div className="bg-[#f6f5f1] dark:bg-slate-950/60 border border-stone-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-stone-500 dark:text-slate-400">Chapters</p>
                                            <p className="text-sm font-bold text-stone-900 dark:text-slate-100">{allTopics.length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#f6f5f1] dark:bg-slate-950/60 border border-stone-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
                                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-stone-500 dark:text-slate-400">Lectures</p>
                                            <p className="text-sm font-bold text-stone-900 dark:text-slate-100">{totalLecturesCount || '200+'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#f6f5f1] dark:bg-slate-950/60 border border-stone-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
                                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-stone-500 dark:text-slate-400">Notes & PDFs</p>
                                            <p className="text-sm font-bold text-stone-900 dark:text-slate-100">{totalNotesCount || '150+'}</p>
                                        </div>
                                    </div>
                                    <div
                                        className="bg-[#f6f5f1] dark:bg-slate-950/60 border border-stone-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center space-x-3 cursor-pointer hover:border-amber-500 transition"
                                        onClick={() => setActiveTab('tests')}
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                                            <Award className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-stone-500 dark:text-slate-400">CBT Tests</p>
                                            <p className="text-sm font-bold text-stone-900 dark:text-slate-100">{realCourseTests.length || 20} Tests</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Overall Course Progress Bar (Puro Course Er Progress Bar) */}
                                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-50 to-emerald-500/10 dark:from-amber-950/40 dark:via-slate-950 dark:to-emerald-950/40 border border-stone-200/90 dark:border-slate-800 space-y-2.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                                                <Award className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-slate-200">
                                                Overall Course Completion Progress
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs">
                                            <span className="font-mono text-stone-600 dark:text-slate-300 font-bold">
                                                {completedVideoIds.size} of {totalLecturesCount || 200} Lectures Completed
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-white shadow-xs">
                                                {Math.min(100, Math.round((completedVideoIds.size / Math.max(1, totalLecturesCount || 200)) * 100))}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Track */}
                                    <div className="w-full bg-stone-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-stone-300/60 dark:border-slate-700/60 p-0.5">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                                            style={{
                                                width: `${Math.min(100, Math.round((completedVideoIds.size / Math.max(1, totalLecturesCount || 200)) * 100))}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Multi-Subject Selector Tabs */}
                            {currentBatch?.subjects && currentBatch.subjects.length > 1 && (
                                <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-3 flex items-center space-x-2 overflow-x-auto shadow-xs">
                                    <span className="text-xs font-bold text-stone-500 dark:text-slate-400 shrink-0 px-2">Subjects:</span>
                                    {currentBatch.subjects.map((sub: any) => {
                                        const isSubActive = activeSubjectSlug === sub.slug;
                                        return (
                                            <button
                                                key={sub.slug}
                                                onClick={() => {
                                                    setActiveSubjectSlug(sub.slug);
                                                    loadTopics(currentBatch.batchId, sub.slug);
                                                }}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${isSubActive
                                                        ? 'bg-amber-600 text-white shadow-sm'
                                                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-slate-800 dark:text-slate-300'
                                                    }`}
                                            >
                                                {sub.subject}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Destination Folder Bar */}
                            <div className="bg-white dark:bg-slate-900/90 border border-stone-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0">
                                        <FolderCheck className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
                                            Storage Path (F: Drive)
                                        </span>
                                        {isEditingFolder ? (
                                            <div className="flex items-center space-x-2 mt-1">
                                                <input
                                                    type="text"
                                                    value={targetFolder}
                                                    onChange={e => setTargetFolder(e.target.value)}
                                                    className="w-full bg-[#f6f5f1] dark:bg-slate-950 border border-stone-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-stone-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                                                />
                                                <button
                                                    onClick={() => setIsEditingFolder(false)}
                                                    className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-xs font-mono text-stone-700 dark:text-slate-300 truncate" title={targetFolder}>
                                                {targetFolder}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                    {!isEditingFolder && (
                                        <button
                                            onClick={() => setIsEditingFolder(true)}
                                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
                                        >
                                            Change Folder
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setTargetFolder("F:\\PW\\Shodh Foundation Dec 2026 Mathematical Sciences")}
                                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-950 text-stone-500 dark:text-slate-400 border border-stone-200 dark:border-slate-800 rounded-xl text-[11px] font-medium transition"
                                    >
                                        Default F: Drive
                                    </button>
                                </div>
                            </div>

                            {/* Curriculum Explorer: Left Syllabus (4 Cols) + Right Content (8 Cols) */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                                {/* Left: Chapter Tree (4 Cols - Reduced Width) */}
                                <div className="lg:col-span-4 space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 flex items-center space-x-1.5">
                                            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                            <span>Syllabus ({filteredTopics.length})</span>
                                        </h3>
                                    </div>

                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500" />
                                        <input
                                            type="text"
                                            value={topicSearch}
                                            onChange={e => setTopicSearch(e.target.value)}
                                            placeholder="Search chapters (COV, Linear Algebra...)"
                                            className="w-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-stone-900 dark:text-slate-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition"
                                        />
                                    </div>

                                    <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                                        {filteredTopics.map((topic) => {
                                            const isSelected = activeTopic?.slug === topic.slug;
                                            const completedInChapter = isSelected
                                                ? chapterContents.videos.filter(v => completedVideoIds.has(v.id)).length
                                                : 0;
                                            const chapterVideoCount = topic.videos || 1;
                                            const chapterPercent = Math.min(100, Math.round((completedInChapter / chapterVideoCount) * 100));

                                            return (
                                                <div
                                                    key={topic.slug}
                                                    onClick={() => selectChapter(topic)}
                                                    className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between group ${
                                                        isSelected
                                                            ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 dark:border-amber-600 shadow-sm'
                                                            : 'bg-white dark:bg-slate-900/80 border-stone-200/90 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-800/80'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-1 overflow-hidden pr-2">
                                                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                                                                {topic.name}
                                                            </h4>
                                                            <div className="flex items-center space-x-2 text-[10px] text-stone-500 dark:text-slate-400">
                                                                <span className="font-semibold flex items-center space-x-1 text-indigo-600 dark:text-indigo-400">
                                                                    <Video className="w-3 h-3" /> <span>{topic.videos} Videos</span>
                                                                </span>
                                                                <span>•</span>
                                                                <span className="font-semibold flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                                                                    <FileText className="w-3 h-3" /> <span>{topic.notes || 0} Notes</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'}`} />
                                                    </div>

                                                    {/* Mini Chapter Progress Bar */}
                                                    <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-slate-800/80 space-y-1">
                                                        <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-slate-400 font-mono">
                                                            <span>Chapter Progress</span>
                                                            <span className="font-bold text-amber-600 dark:text-amber-400">
                                                                {completedInChapter}/{topic.videos || 0} Watched
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-stone-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                                                                style={{ width: `${chapterPercent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right: Chapter Contents Explorer (8 Cols - Expanded) */}
                                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5 min-h-[580px]">
                                    {activeTopic ? (
                                        <>
                                            {/* Chapter Header */}
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-stone-100 dark:border-slate-800 gap-3">
                                                <div>
                                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Active Chapter</span>
                                                    <h3 className="text-lg font-bold text-stone-900 dark:text-slate-100">{activeTopic.name}</h3>
                                                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                                                        {chapterContents.videos.length} Lectures • {chapterContents.notes.length} Notes • {chapterContents.exercises.length} DPPs
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        const all = [
                                                            ...chapterContents.videos.map(v => ({ ...v, chapterName: activeTopic.name, type: 'video' })),
                                                            ...chapterContents.notes.map(n => ({ ...n, chapterName: activeTopic.name, type: 'note' }))
                                                        ];
                                                        startStreamingDownload(all);
                                                    }}
                                                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-amber-600/20 transition self-start sm:self-auto shrink-0"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Download Entire Chapter</span>
                                                </button>
                                            </div>

                                            {/* Sub Tabs */}
                                            <div className="flex border-b border-stone-100 dark:border-slate-800 space-x-6 overflow-x-auto">
                                                <button
                                                    onClick={() => setContentSubTab('videos')}
                                                    className={`pb - 3 text - xs font - bold flex items - center space - x - 2 border - b - 2 transition whitespace - nowrap ${
                                                    contentSubTab === 'videos'
                                                        ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                                                        : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-slate-200'
                                                } `}
                                                >
                                                    <Video className="w-4 h-4" />
                                                    <span>Video Lectures ({chapterContents.videos.length})</span>
                                                </button>
                                                <button
                                                    onClick={() => setContentSubTab('notes')}
                                                    className={`pb - 3 text - xs font - bold flex items - center space - x - 2 border - b - 2 transition whitespace - nowrap ${
                                                    contentSubTab === 'notes'
                                                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                                                        : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-slate-200'
                                                } `}
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    <span>Class Notes ({chapterContents.notes.length})</span>
                                                </button>
                                                <button
                                                    onClick={() => setContentSubTab('exercises')}
                                                    className={`pb - 3 text - xs font - bold flex items - center space - x - 2 border - b - 2 transition whitespace - nowrap ${
                                                    contentSubTab === 'exercises'
                                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                                        : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-slate-200'
                                                } `}
                                                >
                                                    <CheckSquare className="w-4 h-4" />
                                                    <span>DPP Quizzes ({chapterContents.exercises.length})</span>
                                                </button>
                                            </div>

                                            {/* Action Bar for Batch Selection */}
                                            {contentSubTab === 'videos' && chapterContents.videos.length > 0 && (
                                                <div className="bg-[#f6f5f1] dark:bg-slate-950/70 border border-stone-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={toggleSelectAllVideos}
                                                            className="flex items-center space-x-2 text-xs font-semibold text-stone-700 dark:text-slate-300 hover:text-amber-600 transition"
                                                        >
                                                            {selectedVideoIds.size === chapterContents.videos.length ? (
                                                                <CheckSquare className="w-4 h-4 text-amber-600" />
                                                            ) : (
                                                                <Square className="w-4 h-4 text-stone-400" />
                                                            )}
                                                            <span>
                                                                {selectedVideoIds.size === chapterContents.videos.length
                                                                    ? 'Deselect All'
                                                                    : 'Select All Videos'}
                                                            </span>
                                                        </button>
                                                        <span className="text-xs text-stone-400 dark:text-slate-500">
                                                            ({selectedVideoIds.size}/{chapterContents.videos.length} selected)
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            const selected = chapterContents.videos
                                                                .filter(v => selectedVideoIds.has(v.id))
                                                                .map(v => ({ ...v, chapterName: activeTopic.name, type: 'video' }));
                                                            startStreamingDownload(selected);
                                                        }}
                                                        disabled={selectedVideoIds.size === 0}
                                                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition self-start sm:self-auto"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span>Download Selected ({selectedVideoIds.size})</span>
                                                    </button>
                                                </div>
                                            )}

                                            {contentSubTab === 'notes' && chapterContents.notes.length > 0 && (
                                                <div className="bg-[#f6f5f1] dark:bg-slate-950/70 border border-stone-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={toggleSelectAllNotes}
                                                            className="flex items-center space-x-2 text-xs font-semibold text-stone-700 dark:text-slate-300 hover:text-purple-600 transition"
                                                        >
                                                            {selectedNoteIds.size === chapterContents.notes.length ? (
                                                                <CheckSquare className="w-4 h-4 text-purple-600" />
                                                            ) : (
                                                                <Square className="w-4 h-4 text-stone-400" />
                                                            )}
                                                            <span>
                                                                {selectedNoteIds.size === chapterContents.notes.length
                                                                    ? 'Deselect All'
                                                                    : 'Select All Notes'}
                                                            </span>
                                                        </button>
                                                        <span className="text-xs text-stone-400 dark:text-slate-500">
                                                            ({selectedNoteIds.size}/{chapterContents.notes.length} selected)
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            const selected = chapterContents.notes
                                                                .filter(n => selectedNoteIds.has(n.id))
                                                                .map(n => ({ ...n, chapterName: activeTopic.name, type: 'note' }));
                                                            startStreamingDownload(selected);
                                                        }}
                                                        disabled={selectedNoteIds.size === 0}
                                                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition self-start sm:self-auto"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span>Download Selected ({selectedNoteIds.size})</span>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Content Items List */}
                                            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                                                {isLoadingContents ? (
                                                    <div className="text-center py-20 text-stone-400 space-y-2">
                                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
                                                        <p className="text-xs">Loading chapter content...</p>
                                                    </div>
                                                ) : contentSubTab === 'videos' ? (
                                                    chapterContents.videos.length === 0 ? (
                                                        <p className="text-xs text-stone-400 text-center py-12">No video lectures available for this chapter.</p>
                                                    ) : (
                                                        chapterContents.videos.map((vid, vIdx) => {
                                                            const isChecked = selectedVideoIds.has(vid.id);
                                                            return (
                                                                <div
                                                                    key={vid.id || vIdx}
                                                                    className={`p - 3.5 rounded - 2xl border transition flex items - center justify - between gap - 3 ${
                                                    isChecked
                                                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                                                        : 'bg-[#f6f5f1]/60 dark:bg-slate-950/40 border-stone-200/80 dark:border-slate-800/80'
                                                } `}
                                                                >
                                                                    <div className="flex items-center space-x-3 overflow-hidden">
                                                                        <button onClick={() => toggleSelectVideo(vid.id)}>
                                                                            {isChecked ? (
                                                                                <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
                                                                            ) : (
                                                                                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                                                                            )}
                                                                        </button>
                                                                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center text-xs font-bold shrink-0">
                                                                            {vIdx + 1}
                                                                        </div>
                                                                        <div className="overflow-hidden">
                                                                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100 truncate">
                                                                                {vid.title}
                                                                            </h4>
                                                                            <div className="flex items-center space-x-1.5">
                                                                                <h4 className={`text - xs sm: text - sm font - bold truncate ${
                                                    completedVideoIds.has(vid.id)
                                                        ? 'text-emerald-700 dark:text-emerald-300'
                                                        : 'text-stone-900 dark:text-slate-100'
                                                } `}>
                                                                                    {vid.title}
                                                                                </h4>
                                                                                {completedVideoIds.has(vid.id) && (
                                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                                                )}
                                                                            </div>
                                                                            <p className="text-[11px] text-stone-500 dark:text-slate-400">
                                                                                {vid.duration || 'Full Lecture HD'}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center space-x-2 shrink-0">
                                                                        {/* Mark as Complete Button */}
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleVideoCompleted(vid.id);
                                                                            }}
                                                                            className={`px - 2.5 py - 1.5 rounded - xl text - xs font - bold flex items - center space - x - 1.5 transition ${
                                                    completedVideoIds.has(vid.id)
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs'
                                                        : 'bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-300'
                                                } `}
                                                                            title={completedVideoIds.has(vid.id) ? "Mark as Incomplete" : "Mark as Completed"}
                                                                        >
                                                                            <CheckCircle2 className={`w - 3.5 h - 3.5 ${ completedVideoIds.has(vid.id) ? 'text-emerald-600 fill-emerald-600/20' : 'text-stone-400' } `} />
                                                                            <span className="hidden sm:inline">{completedVideoIds.has(vid.id) ? 'Completed' : 'Mark Done'}</span>
                                                                        </button>

                                                                        <button
                                                                            onClick={() => setActiveVideoLecture({ ...vid, chapterName: activeTopic.name })}
                                                                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-xs"
                                                                        >
                                                                            <Play className="w-3.5 h-3.5 fill-white" />
                                                                            <span>Watch</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => startStreamingDownload([{ ...vid, chapterName: activeTopic.name, type: 'video' }])}
                                                                            className="p-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-300 rounded-xl transition"
                                                                            title="Download 720p MP4"
                                                                        >
                                                                            <Download className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    )
                                                ) : contentSubTab === 'notes' ? (
                                                    chapterContents.notes.length === 0 ? (
                                                        <p className="text-xs text-stone-400 text-center py-12">No notes available for this chapter.</p>
                                                    ) : (
                                                        chapterContents.notes.map((note, nIdx) => {
                                                            const isChecked = selectedNoteIds.has(note.id);
                                                            return (
                                                                <div
                                                                    key={note.id || nIdx}
                                                                    className={`p - 3.5 rounded - 2xl border transition flex items - center justify - between gap - 3 ${
                                                    isChecked
                                                        ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-900/60'
                                                        : 'bg-[#f6f5f1]/60 dark:bg-slate-950/40 border-stone-200/80 dark:border-slate-800/80'
                                                } `}
                                                                >
                                                                    <div className="flex items-center space-x-3 overflow-hidden">
                                                                        <button onClick={() => toggleSelectNote(note.id)}>
                                                                            {isChecked ? (
                                                                                <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                                                                            ) : (
                                                                                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                                                                            )}
                                                                        </button>
                                                                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
                                                                            {nIdx + 1}
                                                                        </div>
                                                                        <div className="overflow-hidden">
                                                                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100 truncate">
                                                                                {note.title}
                                                                            </h4>
                                                                            <p className="text-[11px] text-stone-500 dark:text-slate-400">Class Note / DPP PDF</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center space-x-2 shrink-0">
                                                                        <button
                                                                            onClick={() => setActivePdfNote(note)}
                                                                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-xs"
                                                                        >
                                                                            <Eye className="w-3.5 h-3.5" />
                                                                            <span>Read</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => startStreamingDownload([{ ...note, chapterName: activeTopic.name, type: 'note' }])}
                                                                            className="p-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-300 rounded-xl transition"
                                                                            title="Save PDF"
                                                                        >
                                                                            <Download className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    )
                                                ) : (
                                                    chapterContents.exercises.map((ex, eIdx) => (
                                                        <div key={eIdx} className="p-3.5 rounded-2xl bg-[#f6f5f1] dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800 flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <CheckSquare className="w-5 h-5 text-indigo-500 shrink-0" />
                                                                <div>
                                                                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100">{ex.title}</h4>
                                                                    <p className="text-[11px] text-stone-500 dark:text-slate-400">Interactive Quiz</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const mock = {
                                                                        id: ex.id || `dpp_${ eIdx } `,
                                                                        title: ex.title,
                                                                        subject: 'Mathematical Sciences',
                                                                        category: 'chapter' as const,
                                                                        durationMinutes: 30,
                                                                        totalMarks: 40,
                                                                        negativeMark: 0.5,
                                                                        totalQuestions: 10,
                                                                        questions: []
                                                                    };
                                                                    setActiveTest(generateTestSession(mock));
                                                                }}
                                                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                                                            >
                                                                Start Quiz
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-32 text-stone-400">
                                            <BookOpen className="w-10 h-10 mx-auto text-stone-300 dark:text-slate-700 mb-2" />
                                            <p className="text-xs">Select a chapter from the left syllabus tree to begin</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION: CBT TESTS */}
                    {activeTab === 'tests' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900/90 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
                                <div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                        CBT Examination Portal
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-2">
                                        {currentBatch?.name} — All Practice & Mock Tests
                                    </h2>
                                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                                        Timed test simulation with question palette, negative marking, and instant solutions.
                                    </p>
                                </div>

                                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-[#f6f5f1] dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-purple-600 dark:text-purple-400">
                                    {realCourseTests.length || 20} Tests Available
                                </span>
                            </div>

                            {/* Tests Filter & Search Bar */}
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                                <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
                                    {[
                                        { id: 'all', label: `All Tests (${realCourseTests.length})` },
                                        { id: 'full', label: 'Full Length (180m)' },
                                        { id: 'chapter', label: 'Chapter Wise' },
                                        { id: 'monthly', label: 'Monthly Tests' },
                                        { id: 'practice', label: 'Practice Tests' }
                                    ].map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setTestFilter(f.id as any)}
                                            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                                                testFilter === f.id
                                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                                                    : 'bg-white hover:bg-stone-100 text-stone-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700'
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500" />
                                    <input
                                        type="text"
                                        value={testSearch}
                                        onChange={e => setTestSearch(e.target.value)}
                                        placeholder="Filter tests..."
                                        className="w-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl pl-9 pr-3 py-1.5 text-xs text-stone-900 dark:text-slate-100 placeholder-stone-400 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {filteredTests.length === 0 ? (
                                <div className="text-center py-20 bg-white dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 rounded-3xl space-y-2">
                                    <CheckSquare className="w-10 h-10 mx-auto text-stone-300 dark:text-slate-700" />
                                    <p className="text-sm font-bold text-stone-700 dark:text-slate-300">No tests match your filter</p>
                                    <p className="text-xs text-stone-400">Try selecting "All Tests" or clearing the search query.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTests.map((test, tIdx) => {
                                        const cat = (test.category || '').toLowerCase();
                                        const badgeText = cat === 'full' ? 'Full Length (180m)' : cat === 'monthly' ? 'Monthly Assessment' : cat === 'practice' ? 'Practice Quiz' : 'Chapter Test';
                                        const badgeColor = cat === 'full'
                                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                            : cat === 'monthly'
                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                            : cat === 'practice'
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';

                                        return (
                                            <div
                                                key={test.id || tIdx}
                                                className="bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-500 transition group"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                                                            {badgeText}
                                                        </span>
                                                        <span className="text-xs text-stone-500 dark:text-slate-400 font-mono flex items-center space-x-1">
                                                            <Clock className="w-3.5 h-3.5 text-purple-500" />
                                                            <span>{test.maxDuration} Mins</span>
                                                        </span>
                                                    </div>

                                                    <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                        {test.name}
                                                    </h3>

                                                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-500 dark:text-slate-400 py-2 border-y border-stone-100 dark:border-slate-800 font-mono">
                                                        <div>Questions: <strong className="text-stone-800 dark:text-slate-200">{test.totalQuestions || 85}</strong></div>
                                                        <div>Marks: <strong className="text-stone-800 dark:text-slate-200">{test.totalMarks || 200}</strong></div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setActiveTest(generateTestSession(test))}
                                                    className="mt-4 w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-xs group-hover:shadow-md"
                                                >
                                                    <CheckSquare className="w-4 h-4" />
                                                    <span>Attempt Test (CBT Portal)</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION: SETTINGS */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 max-w-2xl">
                            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
                                <h2 className="text-lg font-bold text-stone-900 dark:text-white">Platform Settings</h2>

                                {/* Theme Mode */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-700 dark:text-slate-300">Color Theme</label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => {
                                                if (theme !== 'light') toggleTheme();
                                            }}
                                            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 border ${
                                                theme === 'light'
                                                    ? 'bg-amber-500 text-white border-amber-600'
                                                    : 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            <Sun className="w-4 h-4" />
                                            <span>Light Mode (VidhyaX Style)</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (theme !== 'dark') toggleTheme();
                                            }}
                                            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 border ${
                                                theme === 'dark'
                                                    ? 'bg-slate-900 text-white border-slate-700'
                                                    : 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            <Moon className="w-4 h-4 text-indigo-400" />
                                            <span>Dark Mode</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Download Destination Folder */}
                                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-slate-800">
                                    <label className="text-xs font-bold text-stone-700 dark:text-slate-300">Download Directory</label>
                                    <input
                                        type="text"
                                        value={targetFolder}
                                        onChange={e => setTargetFolder(e.target.value)}
                                        className="w-full bg-[#f6f5f1] dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 dark:text-slate-100"
                                    />
                                    <p className="text-[11px] text-stone-500 dark:text-slate-400">
                                        Downloaded videos and notes will be organized into chapter subfolders here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* Video Modal (Offline & Online HD Player with Fullscreen) */}
            <VideoModal
                lecture={activeVideoLecture}
                targetBaseDir={targetFolder}
                playlist={chapterContents.videos}
                isCompleted={completedVideoIds.has(activeVideoLecture?.id)}
                onToggleComplete={() => activeVideoLecture && toggleVideoCompleted(activeVideoLecture.id)}
                onClose={() => setActiveVideoLecture(null)}
                onSelectLecture={setActiveVideoLecture}
                onDownload={lec => startStreamingDownload([{ ...lec, chapterName: activeTopic?.name, type: 'video' }])}
            />

            {/* PDF Modal (with Fullscreen) */}
            <PdfModal
                note={activePdfNote}
                onClose={() => setActivePdfNote(null)}
                onDownload={n => startStreamingDownload([{ ...n, chapterName: activeTopic?.name, type: 'note' }])}
            />

            {/* CBT Test Modal (with Fullscreen Simulation) */}
            <TestModal
                test={activeTest}
                onClose={() => setActiveTest(null)}
            />

            {/* Download Drawer */}
            <DownloadDrawer
                isOpen={isDownloadDrawerOpen}
                isDownloading={isDownloading}
                queue={downloadQueue}
                currentItemIndex={currentDownloadIndex}
                targetBaseDir={targetFolder}
                onClose={() => setIsDownloadDrawerOpen(false)}
                onCancelDownload={() => setIsCancelModalOpen(true)}
            />

            {/* Cancel Download Confirmation Modal */}
            <CancelDownloadModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirmCancel={handleConfirmCancelDownload}
                currentItem={downloadQueue[currentDownloadIndex]}
                completedCount={downloadQueue.filter(q => q.status === 'done' || q.status === 'skipped').length}
                totalCount={downloadQueue.length}
            />

        </div>
    );
}
