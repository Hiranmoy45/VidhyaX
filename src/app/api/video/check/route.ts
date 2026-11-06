import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeFilename, CONFIG } from '@/lib/engine';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const title = searchParams.get('title') || '';
        const chapter = searchParams.get('chapter') || '';
        const baseDir = searchParams.get('baseDir') || CONFIG.defaultWorkspace;

        if (!title) {
            return NextResponse.json({ exists: false });
        }

        const candidateDirs = [
            path.join(baseDir, chapter, 'Videos'),
            path.join(baseDir, chapter),
            path.join(baseDir, 'Calculus of Variations (COV)', 'Videos'),
            path.join(baseDir, 'Videos')
        ];

        const cleanTitle = sanitizeFilename(title).toLowerCase();
        // Extract prefix like "COV 01", "Lecture 01", etc.
        const prefixMatch = cleanTitle.match(/^([a-z0-9\s]+?)(:|-|$)/i);
        const prefix = prefixMatch ? prefixMatch[1].trim() : '';

        for (const dir of candidateDirs) {
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                for (const f of files) {
                    if (!f.endsWith('.mp4')) continue;
                    const fLower = f.toLowerCase();
                    // Match clean title or prefix
                    if (fLower.includes(cleanTitle) || (prefix && fLower.includes(prefix))) {
                        const fullPath = path.join(dir, f);
                        const stat = fs.statSync(fullPath);
                        if (stat.size > 5 * 1024 * 1024) {
                            return NextResponse.json({
                                exists: true,
                                localPath: fullPath,
                                filename: f,
                                sizeMb: (stat.size / (1024 * 1024)).toFixed(1),
                                streamUrl: `/api/video/stream?path=${encodeURIComponent(fullPath)}`
                            });
                        }
                    }
                }
            }
        }

        return NextResponse.json({ exists: false });
    } catch (err: any) {
        return NextResponse.json({ exists: false, error: err.message }, { status: 500 });
    }
}

