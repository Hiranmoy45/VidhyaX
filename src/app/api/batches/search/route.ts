import { NextRequest, NextResponse } from 'next/server';
import { ALL_BATCHES_CATALOG } from '@/lib/batches';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || searchParams.get('name') || '';

        if (!query.trim()) {
            return NextResponse.json({
                success: true,
                source: 'catalog',
                batches: ALL_BATCHES_CATALOG
            });
        }

        // Search live PenPencil API
        const url = `https://proxy.streamvideo.co.in/fetch/api.penpencil.co/v3/batches/search?name=${encodeURIComponent(query.trim())}`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'Referer': 'https://pwthor.live/',
                'Origin': 'https://pwthor.live'
            }
        });

        if (!res.ok) {
            // Fallback to local catalog filter
            const filtered = ALL_BATCHES_CATALOG.filter(b =>
                b.name.toLowerCase().includes(query.toLowerCase()) ||
                b.subject.toLowerCase().includes(query.toLowerCase())
            );
            return NextResponse.json({ success: true, source: 'fallback', batches: filtered });
        }

        const data = await res.json();
        const rawBatches = data.data || [];

        // Map live batches into standard format
        const batches = rawBatches.map((b: any) => {
            const name = b.name || 'Untitled Course';
            const nameLower = name.toLowerCase();

            let category = 'EXAM PREP';
            if (nameLower.includes('csir')) category = 'CSIR NET';
            else if (nameLower.includes('jam')) category = 'IIT JAM';
            else if (nameLower.includes('gate')) category = 'GATE';
            else if (nameLower.includes('neet')) category = 'NEET';
            else if (nameLower.includes('jee')) category = 'IIT JEE';
            else if (nameLower.includes('upsc')) category = 'UPSC';
            else if (nameLower.includes('cuet')) category = 'CUET';
            else if (nameLower.includes('foundation') || nameLower.includes('shodh')) category = 'FOUNDATION';

            return {
                id: b._id,
                name: name,
                category,
                subject: inferSubject(name),
                faculty: 'PW Expert Faculty',
                description: `Official Physics Wallah ${category} Batch covering full syllabus, lecture videos, notes, and tests.`,
                totalLectures: 'Full Content',
                totalChapters: 'Complete Syllabus',
                badge: category
            };
        });

        return NextResponse.json({
            success: true,
            source: 'penpencil_live',
            total: batches.length,
            batches
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

function inferSubject(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('math')) return 'Mathematical Sciences';
    if (lower.includes('physic')) return 'Physical Sciences';
    if (lower.includes('chem')) return 'Chemical Sciences';
    if (lower.includes('life') || lower.includes('bio')) return 'Life Sciences';
    if (lower.includes('botany') || lower.includes('zoology')) return 'Biology';
    return 'Comprehensive Syllabus';
}

