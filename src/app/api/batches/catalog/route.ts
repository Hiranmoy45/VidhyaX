import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedBatches: any[] | null = null;

// Featured / Flagship CSIR NET & Top Batches to always pin at the top
const PINNED_BATCHES = [
    {
        batch_id: "69c13cdeb958f08c1d1dad1e",
        name: "Shodh Foundation Dec 2026 Mathematical Sciences",
        language: "Hinglish",
        exam: "CSIR-NET",
        byName: "Pure & Applied Mathematics, COV, Linear Algebra, Real Analysis",
        photo: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/bafda9b4-e53a-4801-a27b-c0c03484b0ee.png",
        class: "MSc / Post-Grad",
        amount: 4999,
        featured: true
    },
    {
        batch_id: "66487e87ab09c40018f673fa",
        name: "CSIR NET Dec 2025 Mathematical Sciences",
        language: "Hinglish",
        exam: "CSIR-NET",
        byName: "Target JRF 2025 with Chapter-wise DPPs and PYQs",
        photo: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/bafda9b4-e53a-4801-a27b-c0c03484b0ee.png",
        class: "MSc",
        amount: 3999,
        featured: true
    },
    {
        batch_id: "66f83ec55e64ded335ed0111",
        name: "CSIR NET Dec 2026 Physical Sciences",
        language: "Hinglish",
        exam: "CSIR-NET",
        byName: "Quantum, Electrodynamics & Classical Mechanics",
        photo: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/bafda9b4-e53a-4801-a27b-c0c03484b0ee.png",
        class: "MSc",
        amount: 4499,
        featured: true
    }
];

function loadAllBatches(): any[] {
    if (cachedBatches) return cachedBatches;

    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'batches.json');
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(raw);
            const list = Array.isArray(parsed.batches) ? parsed.batches : [];
            // Merge pinned batches first, avoiding duplicate batch_ids
            const pinnedIds = new Set(PINNED_BATCHES.map(p => p.batch_id));
            const filteredRest = list.filter((b: any) => !pinnedIds.has(b.batch_id));
            cachedBatches = [...PINNED_BATCHES, ...filteredRest];
            return cachedBatches;
        }
    } catch (e) {
        console.error('Error loading batches.json:', e);
    }

    return PINNED_BATCHES;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = (searchParams.get('q') || searchParams.get('search') || '').trim().toLowerCase();
        const exam = (searchParams.get('exam') || '').trim();
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.max(6, Math.min(60, parseInt(searchParams.get('limit') || '24', 10)));

        const all = loadAllBatches();

        let filtered = all;

        // Filter by Exam Category
        if (exam && exam !== 'ALL') {
            const examUpper = exam.toUpperCase();
            filtered = filtered.filter(b => {
                const bExam = (b.exam || '').toUpperCase();
                if (examUpper === 'IIT-JEE' || examUpper === 'JEE') return bExam.includes('JEE');
                if (examUpper === 'NEET') return bExam.includes('NEET');
                if (examUpper === 'CSIR-NET' || examUpper === 'CSIR') return bExam.includes('CSIR') || b.name.toLowerCase().includes('csir');
                if (examUpper === 'GATE') return bExam.includes('GATE') || b.name.toLowerCase().includes('gate');
                if (examUpper === 'UPSC') return bExam.includes('UPSC');
                if (examUpper === 'FOUNDATION') return bExam.includes('FOUNDATION') || bExam.includes('SCHOOL');
                if (examUpper === 'OLYMPIAD') return bExam.includes('OLYMPIAD');
                if (examUpper === 'NDA' || examUpper === 'DEFENCE') return bExam.includes('NDA') || bExam.includes('DEFENCE');
                return bExam.includes(examUpper);
            });
        }

        // Filter by Search Query
        if (query) {
            const tokens = query.split(/\s+/).filter(Boolean);
            filtered = filtered.filter(b => {
                const searchStr = `${b.name || ''} ${b.byName || ''} ${b.exam || ''} ${b.language || ''} ${b.batch_id || ''}`.toLowerCase();
                return tokens.every(token => searchStr.includes(token));
            });
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const batches = filtered.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            success: true,
            total,
            page,
            totalPages,
            limit,
            batches
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

