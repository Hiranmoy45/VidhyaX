import { NextRequest, NextResponse } from 'next/server';
import { extractBatchId, fetchBatchDetails } from '@/lib/engine';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const input = searchParams.get('input') || '69c13cdeb958f08c1d1dad1e';
        const batchId = extractBatchId(input);
        const batchInfo = await fetchBatchDetails(batchId);
        return NextResponse.json({ success: true, batchInfo });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

