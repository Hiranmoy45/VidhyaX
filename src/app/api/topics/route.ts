import { NextRequest, NextResponse } from 'next/server';
import { extractBatchId, fetchTopics, CONFIG } from '@/lib/engine';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const rawBatch = searchParams.get('batchId') || CONFIG.defaultBatchId;
        const batchId = extractBatchId(rawBatch);
        const subjectSlug = searchParams.get('subjectSlug') || CONFIG.defaultSubjectSlug;
        const topics = await fetchTopics(batchId, subjectSlug);
        return NextResponse.json({ success: true, topics });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

