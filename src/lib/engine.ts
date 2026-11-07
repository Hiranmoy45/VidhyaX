import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import type { Browser } from 'puppeteer-core';
import curriculumFallback from './curriculumFallback.json';

export const CONFIG = {
    chromePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ffmpegPath: "E:\\Client Project\\ai agent create\\venv\\Scripts\\ffmpeg.exe",
    defaultWorkspace: "F:\\PW\\Shodh Foundation Dec 2026 Mathematical Sciences",
    defaultBatchId: "69c13cdeb958f08c1d1dad1e",
    defaultSubjectSlug: "mathematical-sciences-779105",
    scratchDir: "C:\\Users\\Hiranmoy\\.gemini\\antigravity\\brain\\6729028e-ea72-4bf8-9b0c-f3964f5e2aa6\\scratch"
};

// Resolve Chrome path lazily
export function getChromePath(): string {
    if (fs.existsSync(/*turbopackIgnore: true*/ CONFIG.chromePath)) return CONFIG.chromePath;
    const alt1 = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    const alt2 = path.join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe");
    if (fs.existsSync(/*turbopackIgnore: true*/ alt1)) return alt1;
    if (fs.existsSync(/*turbopackIgnore: true*/ alt2)) return alt2;
    return CONFIG.chromePath;
}

export function sanitizeFilename(name: string): string {
    if (!name) return "Untitled";
    return name
        .replace(/[:*?"<>|\\\/]/g, " ")
        .replace(/\s*\|\|\s*/g, " - ")
        .replace(/\s+/g, " ")
        .trim();
}

export function extractBatchId(input: string): string {
    if (!input) return CONFIG.defaultBatchId;
    const trimmed = input.trim();
    if (/^[0-9a-fA-F]{24}$/.test(trimmed)) return trimmed;
    const m = trimmed.match(/batch[_-]?id=([0-9a-fA-F]{24})/i) ||
              trimmed.match(/\/batches\/([0-9a-fA-F]{24})/i) ||
              trimmed.match(/([0-9a-fA-F]{24})/);
    return m ? m[1] : CONFIG.defaultBatchId;
}

export function parsePlayUrl(rawUrl: string) {
    try {
        const u = new URL(rawUrl);
        const p = u.searchParams;
        return {
            title: p.get('title') || 'Untitled Lecture',
            videoId: p.get('video_id') || '',
            videoKey: p.get('video_key') || '',
            batchId: p.get('batch_id') || CONFIG.defaultBatchId,
            subjectSlug: p.get('subject_slug') || CONFIG.defaultSubjectSlug,
            subjectId: p.get('subject_id') || '',
            topicSlug: p.get('topic_slug') || '',
            topicId: p.get('topic_id') || '',
            poster: p.get('poster') || '',
            type: 'video' as const,
            rawUrl
        };
    } catch {
        throw new Error('Invalid URL format');
    }
}

export async function fetchBatchDetails(batchId: string) {
    // 1. Direct fetch from official Penpencil API (CloudFront - fast, public, never blocked)
    try {
        const directUrl = `https://api.penpencil.co/v3/batches/${batchId}/details`;
        const directRes = await fetch(directUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        });
        if (directRes.ok) {
            const data = await directRes.json();
            const b = data.data || {};
            if (b.name && Array.isArray(b.subjects) && b.subjects.length > 0) {
                return {
                    batchId: b._id || batchId,
                    name: b.name,
                    previewImage: b.previewImage?.baseUrl && b.previewImage?.key ? `${b.previewImage.baseUrl}${b.previewImage.key}` : '',
                    testCats: b.testCats || [],
                    subjects: b.subjects.map((s: any) => ({
                        _id: s._id,
                        slug: s.slug,
                        subject: s.subject
                    }))
                };
            }
        }
    } catch (err) {
        console.warn('Direct penpencil batch fetch failed, trying proxy:', err);
    }

    // 2. Fallback to StreamVideo proxy with 15s timeout
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v3/batches/${batchId}/details`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'VidhyaX/1.0 (Educational Platform; Node.js)',
                'Referer': 'https://pwthor.live/',
                'Origin': 'https://pwthor.live',
                'Accept': 'application/json, text/plain, */*'
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            const b = data.data || {};
            return {
                batchId: b._id || batchId,
                name: b.name || `PW Batch ${batchId}`,
                previewImage: b.previewImage?.baseUrl && b.previewImage?.key ? `${b.previewImage.baseUrl}${b.previewImage.key}` : '',
                testCats: b.testCats || [],
                subjects: (b.subjects || []).map((s: { _id: string; slug: string; subject: string }) => ({
                    _id: s._id,
                    slug: s.slug,
                    subject: s.subject
                }))
            };
        }
    } catch (err) {
        console.warn('Upstream batch fetch failed:', err);
    }

    // Only fallback to Shodh Foundation if the requested batch is Shodh Foundation
    if (batchId === '69c13cdeb958f08c1d1dad1e') {
        return {
            batchId: '69c13cdeb958f08c1d1dad1e',
            name: "Shodh Foundation Dec 2026 Mathematical Sciences",
            previewImage: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/bafda9b4-e53a-4801-a27b-c0c03484b0ee.png",
            testCats: ['69c2639ebcad7cea7fdd0c08'],
            subjects: [{ _id: "69c26584eb74f4d5c88757aa", slug: "mathematical-sciences-779105", subject: "Mathematical Sciences" }]
        };
    }

    return {
        batchId,
        name: `PW Batch ${batchId}`,
        previewImage: '',
        testCats: [],
        subjects: []
    };
}

export async function fetchTopics(batchId = CONFIG.defaultBatchId, subjectSlug = CONFIG.defaultSubjectSlug) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v2/batches/${batchId}/subject/${subjectSlug}/topics`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'VidhyaX/1.0 (Educational Platform; Node.js)',
                'Referer': 'https://pwthor.live/',
                'Origin': 'https://pwthor.live',
                'Accept': 'application/json, text/plain, */*'
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            const list = data.data || [];
            const topics = list.filter((t: any) => (t.videos > 0 || t.notes > 0));
            return topics.length > 0 ? topics : list;
        } else {
            const text = await res.text();
            throw new Error(`Upstream topics HTTP ${res.status}: ${text.slice(0, 80)}`);
        }
    } catch (err: any) {
        console.warn('Upstream topics fetch failed:', err?.message || err);
        throw err;
    }

    // Only fallback if the requested batch is Shodh Foundation
    if (batchId === '69c13cdeb958f08c1d1dad1e') {
        return (curriculumFallback.topics || []).filter((t: any) => (t.videos > 0 || t.notes > 0));
    }

    return [];
}

export async function fetchChapterContents(batchId = CONFIG.defaultBatchId, subjectSlug = CONFIG.defaultSubjectSlug, topicSlug: string) {
    if (!topicSlug) throw new Error('topicSlug is required');

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const commonHeaders = {
            'User-Agent': 'VidhyaX/1.0 (Educational Platform; Node.js)',
            'Referer': 'https://pwthor.live/',
            'Origin': 'https://pwthor.live',
            'Accept': 'application/json, text/plain, */*'
        };

        // 1. Fetch Videos
        let vPage = 1;
        const rawVideos: any[] = [];
        while (vPage <= 6) {
            const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v2/batches/${batchId}/subject/${subjectSlug}/contents?tag=${topicSlug}&contentType=videos&page=${vPage}`;
            const res = await fetch(url, {
                headers: commonHeaders,
                signal: controller.signal
            });
            if (!res.ok) break;
            const j = await res.json();
            const items = j.data || [];
            if (!items.length) break;
            rawVideos.push(...items);
            vPage++;
        }
        rawVideos.reverse();

        // 2. Fetch Notes
        let nPage = 1;
        const rawNotes: any[] = [];
        while (nPage <= 6) {
            const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v2/batches/${batchId}/subject/${subjectSlug}/contents?tag=${topicSlug}&contentType=notes&page=${nPage}`;
            const res = await fetch(url, {
                headers: commonHeaders,
                signal: controller.signal
            });
            if (!res.ok) break;
            const j = await res.json();
            const items = j.data || [];
            if (!items.length) break;
            rawNotes.push(...items);
            nPage++;
        }
        rawNotes.reverse();

        // 3. Fetch Chapter Exercises / DPP Quizzes
        let ePage = 1;
        const rawExercises: any[] = [];
        while (ePage <= 3) {
            const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v2/batches/${batchId}/subject/${subjectSlug}/contents?tag=${topicSlug}&contentType=exercises&page=${ePage}`;
            const res = await fetch(url, {
                headers: commonHeaders,
                signal: controller.signal
            });
            if (!res.ok) break;
            const j = await res.json();
            const items = j.data || [];
            if (!items.length) break;
            rawExercises.push(...items);
            ePage++;
        }
        rawExercises.reverse();
        clearTimeout(timeoutId);

        if (rawVideos.length > 0 || rawNotes.length > 0) {
            const videos = rawVideos.map((item, idx) => {
                const title = item.topic || item.videoDetails?.name || `Lecture ${idx + 1}`;
                return {
                    id: item._id,
                    index: idx + 1,
                    type: 'video' as const,
                    title,
                    cleanTitle: sanitizeFilename(title),
                    videoId: item._id,
                    videoKey: item.videoDetails?._id || item.videoDetails?.id || item.url || '',
                    duration: item.videoDetails?.duration || '',
                    poster: item.videoDetails?.image || '',
                    batchId,
                    subjectSlug,
                    topicSlug
                };
            });

            const notes: any[] = [];
            for (let idx = 0; idx < rawNotes.length; idx++) {
                const item = rawNotes[idx];
                const hwList = item.homeworkIds || [];
                for (const hw of hwList) {
                    const att = hw.attachmentIds?.[0];
                    const title = hw.topic || hw.note || `Notes ${idx + 1}`;
                    notes.push({
                        id: hw._id || item._id,
                        scheduleId: item._id,
                        index: notes.length + 1,
                        type: 'note' as const,
                        title,
                        cleanTitle: sanitizeFilename(title),
                        pdfUrl: att?.baseUrl && att?.key ? `${att.baseUrl}${att.key}` : null,
                        batchId,
                        subjectSlug,
                        topicSlug
                    });
                }
            }

            const exercises: any[] = [];
            for (let idx = 0; idx < rawExercises.length; idx++) {
                const item = rawExercises[idx];
                const exList = item.exerciseIds || [];
                for (const ex of exList) {
                    const details = ex.content?.[0]?.exerciseDetails || {};
                    const title = ex.title || `DPP Quiz ${exercises.length + 1}`;
                    exercises.push({
                        id: ex.content?.[0]?.exerciseId || ex._id || item._id,
                        index: exercises.length + 1,
                        type: 'exercise' as const,
                        title,
                        cleanTitle: sanitizeFilename(title),
                        totalQuestions: details.totalQuestions || 15,
                        maxDuration: details.maxDuration || 30,
                        totalMarks: details.totalMarks || 45,
                        date: item.date || item.startTime || '',
                        batchId,
                        subjectSlug,
                        topicSlug
                    });
                }
            }

            return { videos, notes, exercises };
        }
    } catch (err) {
        console.warn(`Upstream contents fetch failed for ${topicSlug}, checking fallback:`, err);
    }

    // High-fidelity fallback for chapter contents (Only for Shodh Foundation)
    if (batchId === '69c13cdeb958f08c1d1dad1e') {
        const fb = (curriculumFallback.contentsMap as any)?.[topicSlug];
        if (fb) {
            return {
                videos: fb.videos || [],
                notes: fb.notes || [],
                exercises: fb.exercises || []
            };
        }
    }

    return { videos: [], notes: [], exercises: [] };
}

export async function fetchBatchTests(testCatId = '69c2639ebcad7cea7fdd0c08') {
    const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v1/test-category/${testCatId}/tests`;
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'VidhyaX/1.0 (Educational Platform; Node.js)',
            'Referer': 'https://pwthor.live/',
            'Origin': 'https://pwthor.live'
        }
    });
    if (!res.ok) return [];
    const j = await res.json();
    return j.data || j || [];
}

export async function resolveNotePdfUrl(batchId: string, subjectSlug: string, scheduleId: string) {
    const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v1/batches/${batchId}/subject/${subjectSlug}/schedule/${scheduleId}/schedule-details`;
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'VidhyaX/1.0 (Educational Platform; Node.js)',
            'Referer': 'https://pwthor.live/',
            'Origin': 'https://pwthor.live'
        }
    });
    if (!res.ok) return null;
    const j = await res.json();
    const hwList = j.data?.homeworkIds || [];
    for (const hw of hwList) {
        const att = hw.attachmentIds?.[0];
        if (att?.baseUrl && att?.key) {
            return `${att.baseUrl}${att.key}`;
        }
    }
    return null;
}

export function buildPlayerUrl(lecture: { title: string; videoId: string; batchId?: string; subjectSlug?: string; topicId?: string; topicSlug?: string; videoKey: string }) {
    const encodedTitle = encodeURIComponent(lecture.title);
    return `https://stream.aryavidya.cc/play.php?video_url=&title=${encodedTitle}&video_id=${lecture.videoId}&batch_id=${lecture.batchId || CONFIG.defaultBatchId}&subject_id=69c26584eb74f4d5c88757aa&video_type=pw&subject_id_original=69c26584eb74f4d5c88757aa&topic_id=${lecture.topicId || ''}&subject_slug=${lecture.subjectSlug || CONFIG.defaultSubjectSlug}&topic_slug=${lecture.topicSlug || ''}&video_key=${lecture.videoKey}&urlType=penpencilvdo`;
}

// Download PDF directly from static.pw.live
export async function downloadPdfFile(item: any, outputDir: string, onProgress?: (p: any) => void) {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    let pdfUrl = item.pdfUrl;
    if (!pdfUrl && item.scheduleId) {
        if (onProgress) onProgress({ status: 'resolving', message: 'Resolving PDF URL...', percent: 15 });
        pdfUrl = await resolveNotePdfUrl(item.batchId, item.subjectSlug, item.scheduleId);
    }
    if (!pdfUrl) throw new Error('PDF URL could not be resolved');

    const cleanName = sanitizeFilename(item.title);
    const finalPdf = path.join(outputDir, `${cleanName}.pdf`);

    if (fs.existsSync(finalPdf) && fs.statSync(finalPdf).size > 10 * 1024) {
        const mb = (fs.statSync(finalPdf).size / (1024 * 1024)).toFixed(2);
        if (onProgress) onProgress({ status: 'skipped', message: `File already exists (${mb} MB)`, percent: 100 });
        return { finalPath: finalPdf, sizeMb: mb, skipped: true };
    }

    if (onProgress) onProgress({ status: 'downloading', message: 'Downloading PDF document...', percent: 40 });
    const res = await fetch(pdfUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buf = await res.arrayBuffer();
    fs.writeFileSync(finalPdf, Buffer.from(buf));
    const sizeMb = (fs.statSync(finalPdf).size / (1024 * 1024)).toFixed(2);
    if (onProgress) onProgress({ status: 'done', message: `Saved PDF (${sizeMb} MB)`, percent: 100, finalPath: finalPdf, sizeMb });

    return { finalPath: finalPdf, sizeMb, skipped: false };
}

export async function launchBrowser(): Promise<Browser> {
    const puppeteer = (await import('puppeteer-core')).default;
    const chrome = getChromePath();
    return await puppeteer.launch({
        executablePath: chrome,
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-web-security"
        ]
    });
}

export async function getPlaylist(browser: Browser, lecture: any, maxRetries = 2) {
    const url = lecture.rawUrl || buildPlayerUrl(lecture);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36");

        let playlistText: string | null = null;
        let playlistUrl: string | null = null;

        page.on('response', async res => {
            const u = res.url();
            if (u.includes('.docx')) {
                try {
                    playlistUrl = u;
                    playlistText = await res.text();
                } catch (e) {}
            }
        });

        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
            for (let i = 0; i < 25; i++) {
                if (playlistText) break;
                await new Promise(r => setTimeout(r, 1000));
            }
        } catch (e) {
        } finally {
            try { await page.close(); } catch (e) {}
        }

        if (playlistText && playlistUrl) {
            const pUrl = playlistUrl as string;
            const baseCdn = pUrl.substring(0, pUrl.lastIndexOf('/') + 1);
            const segments: string[] = [];
            for (const line of (playlistText as string).split('\n')) {
                const trimmed = line.trim();
                if (trimmed.includes('.pdf?') || trimmed.endsWith('=APKA123456789')) {
                    segments.push(trimmed);
                }
            }
            return { baseCdn, segments };
        }
        await new Promise(r => setTimeout(r, 1500));
    }

    throw new Error(`Failed to capture playlist for "${lecture.title}"`);
}

export async function downloadSegmentWithRetry(url: string, retries = 5): Promise<Buffer> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                    "Referer": "https://stream.aryavidya.cc/"
                }
            });
            if (res.status === 200) {
                const buf = await res.arrayBuffer();
                return Buffer.from(buf);
            }
            if (attempt === retries) throw new Error(`HTTP ${res.status}`);
        } catch (err) {
            if (attempt === retries) throw err;
            await new Promise(r => setTimeout(r, 1000 * attempt));
        }
    }
    throw new Error('Failed to download segment after retries');
}

export async function downloadVideo(
    browser: Browser,
    lecture: any,
    outputDir: string,
    onProgress?: (p: any) => void
) {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const cleanName = sanitizeFilename(lecture.title);
    const finalMp4 = path.join(outputDir, `${cleanName}.mp4`);

    if (fs.existsSync(finalMp4) && fs.statSync(finalMp4).size > 15 * 1024 * 1024) {
        const mb = (fs.statSync(finalMp4).size / (1024 * 1024)).toFixed(1);
        if (onProgress) onProgress({ status: 'skipped', message: `File already exists (${mb} MB)`, percent: 100, sizeMb: mb, finalPath: finalMp4 });
        return { finalPath: finalMp4, skipped: true, sizeMb: mb };
    }

    if (onProgress) onProgress({ status: 'resolving', message: 'Resolving stream playlist from player...', percent: 5 });

    const { baseCdn, segments } = await getPlaylist(browser, lecture);
    if (!segments.length) throw new Error('No video segments found in playlist');

    if (!fs.existsSync(/*turbopackIgnore: true*/ CONFIG.scratchDir)) fs.mkdirSync(/*turbopackIgnore: true*/ CONFIG.scratchDir, { recursive: true });
    const tempTs = path.join(CONFIG.scratchDir, `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.ts`);
    const writeStream = fs.createWriteStream(tempTs);

    const CONCURRENCY = 8;
    let completed = 0;
    const downloadedBuffers: (Buffer | null)[] = new Array(segments.length);
    let nextIndexToWrite = 0;

    async function worker(segIndices: number[]) {
        for (const idx of segIndices) {
            const segUrl = baseCdn + segments[idx];
            const buf = await downloadSegmentWithRetry(segUrl);
            downloadedBuffers[idx] = buf;
            completed++;

            const pct = Math.round((completed * 100) / segments.length);
            if (onProgress) {
                onProgress({
                    status: 'downloading',
                    completed,
                    total: segments.length,
                    percent: Math.min(95, Math.max(5, pct)),
                    message: `Downloaded ${completed}/${segments.length} segments (${pct}%)`
                });
            }

            while (downloadedBuffers[nextIndexToWrite]) {
                writeStream.write(downloadedBuffers[nextIndexToWrite] as Buffer);
                downloadedBuffers[nextIndexToWrite] = null;
                nextIndexToWrite++;
            }
        }
    }

    const workerPromises = [];
    for (let i = 0; i < CONCURRENCY; i++) {
        const segIndices: number[] = [];
        for (let j = i; j < segments.length; j += CONCURRENCY) {
            segIndices.push(j);
        }
        workerPromises.push(worker(segIndices));
    }

    await Promise.all(workerPromises);

    while (nextIndexToWrite < segments.length) {
        if (downloadedBuffers[nextIndexToWrite]) {
            writeStream.write(downloadedBuffers[nextIndexToWrite] as Buffer);
            downloadedBuffers[nextIndexToWrite] = null;
        }
        nextIndexToWrite++;
    }

    await new Promise(r => writeStream.end(r));

    if (onProgress) onProgress({ status: 'remuxing', message: 'Losslessly remuxing to MP4 with FFmpeg...', percent: 98 });

    const result = spawnSync(/*turbopackIgnore: true*/ CONFIG.ffmpegPath, ['-i', tempTs, '-c', 'copy', finalMp4, '-y'], { stdio: 'pipe' });
    if (result.status !== 0) {
        throw new Error(`FFmpeg error: ${result.stderr?.toString().slice(-400) || 'Unknown error'}`);
    }

    if (fs.existsSync(/*turbopackIgnore: true*/ tempTs)) {
        try { fs.unlinkSync(/*turbopackIgnore: true*/ tempTs); } catch (e) {}
    }

    const finalSizeMb = (fs.statSync(/*turbopackIgnore: true*/ finalMp4).size / (1024 * 1024)).toFixed(1);
    if (onProgress) onProgress({ status: 'done', message: `Saved successfully (${finalSizeMb} MB)`, percent: 100, finalPath: finalMp4, sizeMb: finalSizeMb });

    return { finalPath: finalMp4, sizeMb: finalSizeMb, skipped: false };
}
