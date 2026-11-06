import { NextRequest } from 'next/server';
import { CONFIG, downloadPdfFile, downloadVideo, launchBrowser } from '@/lib/engine';
import path from 'path';



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, targetBaseDir } = body;

        if (!items || !items.length) {
            return new Response(JSON.stringify({ success: false, error: 'No items selected for download' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const baseDir = targetBaseDir || CONFIG.defaultWorkspace;
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                function send(data: any) {
                    try {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                    } catch (e) {
                        // Controller might be closed
                    }
                }

                let browser: any = null;
                const hasVideos = items.some((it: any) => it.type === 'video');

                try {
                    send({
                        type: 'start',
                        totalItems: items.length,
                        targetBaseDir: baseDir,
                        message: `Starting download queue of ${items.length} item(s)...`
                    });

                    if (hasVideos) {
                        send({
                            type: 'log',
                            message: 'Launching browser engine for stream decryption...'
                        });
                        browser = await launchBrowser();
                    }

                    for (let i = 0; i < items.length; i++) {
                        if (req.signal.aborted) {
                            send({
                                type: 'cancelled',
                                itemIndex: i,
                                message: 'Download queue cancelled by user'
                            });
                            break;
                        }

                        const item = items[i];
                        const chapterDir = item.chapterName || (item.topicSlug ? item.topicSlug.split('-')[0].toUpperCase() : 'General');
                        const subDir = item.type === 'video' ? 'Videos' : 'Notes';
                        const targetFolder = path.join(baseDir, chapterDir, subDir);

                        send({
                            type: 'item_start',
                            itemIndex: i,
                            totalItems: items.length,
                            id: item.id,
                            title: item.title,
                            itemType: item.type,
                            targetFolder,
                            message: `[${i + 1}/${items.length}] Processing ${item.type === 'video' ? 'Video' : 'PDF'}: ${item.title}`
                        });

                        try {
                            if (item.type === 'video') {
                                const res = await downloadVideo(browser, item, targetFolder, (p: any) => {
                                    if (req.signal.aborted) {
                                        throw new Error('Download aborted by user');
                                    }
                                    send({
                                        type: 'item_progress',
                                        itemIndex: i,
                                        totalItems: items.length,
                                        id: item.id,
                                        title: item.title,
                                        ...p
                                    });
                                });

                                send({
                                    type: 'item_done',
                                    itemIndex: i,
                                    totalItems: items.length,
                                    id: item.id,
                                    title: item.title,
                                    success: true,
                                    sizeMb: res.sizeMb,
                                    finalPath: res.finalPath,
                                    skipped: res.skipped,
                                    message: res.skipped
                                        ? `Already downloaded: ${item.title} (${res.sizeMb} MB)`
                                        : `Completed: ${item.title} (${res.sizeMb} MB)`
                                });
                            } else {
                                // PDF Note
                                const res = await downloadPdfFile(item, targetFolder, (p: any) => {
                                    if (req.signal.aborted) {
                                        throw new Error('Download aborted by user');
                                    }
                                    send({
                                        type: 'item_progress',
                                        itemIndex: i,
                                        totalItems: items.length,
                                        id: item.id,
                                        title: item.title,
                                        ...p
                                    });
                                });

                                send({
                                    type: 'item_done',
                                    itemIndex: i,
                                    totalItems: items.length,
                                    id: item.id,
                                    title: item.title,
                                    success: true,
                                    sizeMb: res.sizeMb,
                                    finalPath: res.finalPath,
                                    skipped: res.skipped,
                                    message: res.skipped
                                        ? `Already downloaded: ${item.title} (${res.sizeMb} MB)`
                                        : `Completed: ${item.title} (${res.sizeMb} MB)`
                                });
                            }
                        } catch (err: any) {
                            send({
                                type: 'item_error',
                                itemIndex: i,
                                totalItems: items.length,
                                id: item.id,
                                title: item.title,
                                error: err.message,
                                message: `Failed to download "${item.title}": ${err.message}`
                            });
                        }
                    }

                    send({
                        type: 'complete',
                        message: `All ${items.length} item(s) processed successfully!`
                    });
                } catch (err: any) {
                    send({
                        type: 'error',
                        error: err.message
                    });
                } finally {
                    if (browser) {
                        try { await browser.close(); } catch (e) {}
                    }
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive'
            }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
