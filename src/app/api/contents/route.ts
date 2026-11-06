import { NextRequest, NextResponse } from 'next/server';
import { extractBatchId, fetchChapterContents, CONFIG } from '@/lib/engine';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const rawBatch = searchParams.get('batchId') || CONFIG.defaultBatchId;
        const batchId = extractBatchId(rawBatch);
        const subjectSlug = searchParams.get('subjectSlug') || CONFIG.defaultSubjectSlug;
        const topicSlug = searchParams.get('topicSlug');

        if (!topicSlug) {
            return NextResponse.json({ success: false, error: 'topicSlug is required' }, { status: 400 });
        }

        const contents = await fetchChapterContents(batchId, subjectSlug, topicSlug);
        return NextResponse.json({ success: true, ...contents });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

