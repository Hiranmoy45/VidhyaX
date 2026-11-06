import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TESTS, OFFICIAL_COURSE_TESTS, generateTestSession } from '@/lib/tests';
import { fetchBatchTests } from '@/lib/engine';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const testCatId = searchParams.get('testCatId') || '69c2639ebcad7cea7fdd0c08';
        const testId = searchParams.get('id');

        // Fetch official tests from the course batch category
        let realCourseTests: any[] = [];
        try {
            realCourseTests = await fetchBatchTests(testCatId);
        } catch (e: any) {
            console.error('Failed to fetch batch tests:', e.message);
        }

        // If specific test requested
        if (testId) {
            const foundInMock = MOCK_TESTS.find(t => t.id === testId);
            if (foundInMock) return NextResponse.json({ success: true, test: foundInMock });

            const foundInOfficial = OFFICIAL_COURSE_TESTS.find(t => t.id === testId);
            if (foundInOfficial) {
                const session = generateTestSession(foundInOfficial);
                return NextResponse.json({ success: true, test: session });
            }

            const foundInReal = realCourseTests.find((t: any) => t._id === testId || t.name === testId);
            if (foundInReal) {
                const session = generateTestSession(foundInReal);
                return NextResponse.json({ success: true, test: session });
            }

            return NextResponse.json({ success: false, error: 'Test not found' }, { status: 404 });
        }

        // If real tests fetched from PW, merge them; otherwise provide the full official test suite
        let mergedTests: any[] = [];
        if (realCourseTests && realCourseTests.length > 0) {
            mergedTests = realCourseTests.map((t: any, idx: number) => {
                const nameLower = (t.name || '').toLowerCase();
                let category = 'practice';
                if (nameLower.includes('full length') || t.maxDuration >= 120) category = 'full';
                else if (nameLower.includes('monthly')) category = 'monthly';
                else if (nameLower.includes('chapter')) category = 'chapter';

                return {
                    id: t._id || `test-${idx + 1}`,
                    name: t.name,
                    category,
                    maxDuration: t.maxDuration,
                    examPattern: t.examPattern || 'CSIR_MATHEMATICAL',
                    startTime: t.startTime,
                    endTime: t.endTime,
                    syllabus: t.syllabus?.en || '',
                    instructions: t.generalInstructions || '',
                    totalMarks: t.maxDuration >= 120 ? 200 : 90,
                    totalQuestions: t.maxDuration >= 120 ? 85 : 30
                };
            });
        } else {
            mergedTests = OFFICIAL_COURSE_TESTS;
        }

        return NextResponse.json({
            success: true,
            totalRealTests: mergedTests.length,
            realCourseTests: mergedTests,
            mockTests: MOCK_TESTS
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
