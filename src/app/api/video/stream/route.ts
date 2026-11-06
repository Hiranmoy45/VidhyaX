import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filePath = searchParams.get('path');

        if (!filePath || !fs.existsSync(filePath)) {
            return new NextResponse('File not found', { status: 404 });
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.get('range');

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const fileStream = fs.createReadStream(filePath, { start, end });

            const stream = new ReadableStream({
                start(controller) {
                    fileStream.on('data', chunk => controller.enqueue(chunk));
                    fileStream.on('end', () => controller.close());
                    fileStream.on('error', err => controller.error(err));
                }
            });

            return new Response(stream, {
                status: 206,
                headers: {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': `${chunkSize}`,
                    'Content-Type': 'video/mp4'
                }
            });
        } else {
            const fileStream = fs.createReadStream(filePath);
            const stream = new ReadableStream({
                start(controller) {
                    fileStream.on('data', chunk => controller.enqueue(chunk));
                    fileStream.on('end', () => controller.close());
                    fileStream.on('error', err => controller.error(err));
                }
            });

            return new Response(stream, {
                status: 200,
                headers: {
                    'Content-Length': `${fileSize}`,
                    'Content-Type': 'video/mp4'
                }
            });
        }
    } catch (err: any) {
        return new NextResponse(`Streaming error: ${err.message}`, { status: 500 });
    }
}

