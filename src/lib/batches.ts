export interface BatchItem {
    id: string;
    name: string;
    category: 'CSIR NET' | 'IIT JAM' | 'GATE' | 'NEET' | 'IIT JEE' | 'UPSC' | 'FOUNDATION' | string;
    subject: string;
    faculty: string;
    description: string;
    totalLectures: string;
    totalChapters: string;
    testCatId?: string;
    previewImage?: string;
    badge?: string;
    popular?: boolean;
}

export const ALL_BATCHES_CATALOG: BatchItem[] = [
    // CSIR NET
    {
        id: "69c13cdeb958f08c1d1dad1e",
        name: "Shodh Foundation Dec 2026 Mathematical Sciences",
        category: "CSIR NET",
        subject: "Mathematical Sciences",
        faculty: "PW Top Faculty & Rishabh Sir",
        description: "Comprehensive foundation batch covering Pure & Applied Mathematics, COV, Linear Algebra, Real Analysis, Complex & ODE/PDE.",
        totalLectures: "200+ Lectures",
        totalChapters: "20 Chapters",
        testCatId: "69c2639ebcad7cea7fdd0c08",
        badge: "Flagship 2026",
        popular: true
    },
    {
        id: "66487e87ab09c40018f673fa",
        name: "CSIR NET Dec 2025 Mathematical Sciences",
        category: "CSIR NET",
        subject: "Mathematical Sciences",
        faculty: "Senior CSIR Faculty Team",
        description: "Intensive target batch with chapter-wise problem sets, PYQs discussion, and CSIR NTA pattern test series.",
        totalLectures: "180+ Lectures",
        totalChapters: "18 Chapters",
        badge: "Target 2025",
        popular: true
    },
    {
        id: "66f83ec55e64ded335ed0111",
        name: "CSIR NET Dec 2026 Physical Sciences",
        category: "CSIR NET",
        subject: "Physical Sciences (Physics)",
        faculty: "Physics Wallah PhD Faculty",
        description: "Quantum Mechanics, Classical Mechanics, Electrodynamics, Statistical Mechanics, and Mathematical Physics.",
        totalLectures: "220+ Lectures",
        totalChapters: "22 Chapters",
        badge: "Physics 2026",
        popular: true
    },
    {
        id: "66f83ed6db2a27b949ca8f11",
        name: "CSIR NET Dec 2026 Chemical Sciences",
        category: "CSIR NET",
        subject: "Chemical Sciences (Chemistry)",
        faculty: "Inorganic, Organic & Physical Chem Experts",
        description: "Complete CSIR NET Chemistry syllabus with reaction mechanisms, spectroscopy, and molecular symmetry.",
        totalLectures: "210+ Lectures",
        totalChapters: "21 Chapters",
        badge: "Chemistry 2026",
        popular: true
    },
    {
        id: "66f83f015e64ded335ed0222",
        name: "CSIR NET Dec 2026 Life Sciences",
        category: "CSIR NET",
        subject: "Life Sciences (Biology)",
        faculty: "Life Science Council Faculty",
        description: "Cell Biology, Molecular Biology, Biochemistry, Genetics, Ecology, and Evolution for JRF aspirants.",
        totalLectures: "240+ Lectures",
        totalChapters: "24 Chapters",
        badge: "Life Sciences",
        popular: true
    },

    // IIT JAM
    {
        id: "65c3639ebcad7cea7fdd0c01",
        name: "IIT JAM Mathematical Sciences 2026",
        category: "IIT JAM",
        subject: "Mathematics & Statistics",
        faculty: "IITian Expert Panel",
        description: "Complete preparation for IIT JAM, TIFR, and NBHM with rigorous theory and thousands of practice problems.",
        totalLectures: "160+ Lectures",
        totalChapters: "15 Chapters",
        badge: "IIT JAM Target",
        popular: true
    },
    {
        id: "65c3639ebcad7cea7fdd0c02",
        name: "IIT JAM Physics 2026 Target Batch",
        category: "IIT JAM",
        subject: "Physics",
        faculty: "Top IIT JAM Mentors",
        description: "Mechanics, Optics, Electricity & Magnetism, Modern Physics, and Mathematical Methods for MSc entrance.",
        totalLectures: "170+ Lectures",
        totalChapters: "16 Chapters",
        badge: "JAM Physics",
        popular: false
    },
    {
        id: "65c3639ebcad7cea7fdd0c03",
        name: "IIT JAM Chemistry 2026 Target Batch",
        category: "IIT JAM",
        subject: "Chemistry",
        faculty: "Chemistry Specialists",
        description: "Physical, Organic, and Inorganic Chemistry tailored for IIT JAM with mock test portal.",
        totalLectures: "175+ Lectures",
        totalChapters: "17 Chapters",
        badge: "JAM Chemistry",
        popular: false
    },

    // GATE
    {
        id: "66a13cdeb958f08c1d1dad99",
        name: "GATE Mathematics (MA) 2026 Target Batch",
        category: "GATE",
        subject: "Mathematics",
        faculty: "GATE Top Rankers & Mentors",
        description: "High-yield engineering mathematics, numerical analysis, linear algebra, and topology with GATE CBT mock series.",
        totalLectures: "150+ Lectures",
        totalChapters: "14 Chapters",
        badge: "GATE 2026",
        popular: false
    },

    // NEET
    {
        id: "698ae510bee370c5244f109d",
        name: "Arjuna NEET 2027 + Lakshya NEET 2028",
        category: "NEET",
        subject: "Physics, Chemistry & Biology",
        faculty: "PW Star Medical Faculty",
        description: "Two-year integrated flagship course for Class 11 & 12 NEET aspirants with NCERT line-by-line discussions.",
        totalLectures: "350+ Lectures",
        totalChapters: "32 Chapters",
        badge: "NEET Flagship",
        popular: true
    },
    {
        id: "645903b1ab938f0018b10111",
        name: "Yakeen NEET 2.0 Dropper Batch",
        category: "NEET",
        subject: "Physics, Chemistry & Biology",
        faculty: "Yakeen Legend Faculty",
        description: "Specialized dropper batch focused on rapid high-yield problem solving, mock tests, and revision.",
        totalLectures: "280+ Lectures",
        totalChapters: "28 Chapters",
        badge: "Dropper Special",
        popular: true
    },

    // IIT JEE
    {
        id: "698ae9f7b43441d2d15bef2f",
        name: "Arjuna JEE 2027 + Lakshya JEE 2028",
        category: "IIT JEE",
        subject: "Physics, Chemistry & Mathematics",
        faculty: "PW Star Engineering Faculty",
        description: "Complete 2-year preparation for JEE Main & JEE Advanced with rigorous DPPs and video solutions.",
        totalLectures: "360+ Lectures",
        totalChapters: "30 Chapters",
        badge: "JEE Flagship",
        popular: true
    },
    {
        id: "60ad14e75456a90011fdc4ca",
        name: "JEE Manzil Complete Revision Batch",
        category: "IIT JEE",
        subject: "PCM Complete Revision",
        faculty: "Senior JEE Mentors",
        description: "One-shot comprehensive marathon lectures with previous years question breakdowns.",
        totalLectures: "120+ Lectures",
        totalChapters: "25 Chapters",
        badge: "Manzil One-Shot",
        popular: false
    },

    // UPSC
    {
        id: "6a644e718ad29b417157fca1",
        name: "UPSC Prarambh 2029 (English Batch)",
        category: "UPSC",
        subject: "General Studies & CSAT",
        faculty: "UPSC Civil Services Mentors",
        description: "Foundational civil services coaching for Prelims and Mains with answer writing practice.",
        totalLectures: "400+ Lectures",
        totalChapters: "35 Chapters",
        badge: "UPSC IAS",
        popular: true
    }
];
