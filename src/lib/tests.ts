export interface Question {
    id: number;
    text: string;
    latex?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    section: 'Part A' | 'Part B' | 'Part C';
}

export interface MockTest {
    id: string;
    title: string;
    topic: string;
    subject: string;
    durationMinutes: number;
    totalMarks: number;
    negativeMark: number;
    questions: Question[];
    instructionsHtml?: string;
}

export const QUESTION_BANK: Record<string, Question[]> = {
    "COV": [
        {
            id: 1,
            text: "The extremum of the functional J[y] = ∫ (y'^2 + 2xy) dx from x=0 to x=1, satisfying y(0)=0 and y(1)=1 is given by:",
            options: [
                "y(x) = (x^3 + 5x) / 6",
                "y(x) = (x^3 - x) / 6",
                "y(x) = x^2",
                "y(x) = (x^4 + 3x) / 4"
            ],
            correctIndex: 0,
            explanation: "Using Euler-Lagrange equation ∂F/∂y - d/dx(∂F/∂y') = 0. Here F = y'^2 + 2xy. ∂F/∂y = 2x, ∂F/∂y' = 2y'. d/dx(2y') = 2y''. Thus 2x - 2y'' = 0 => y'' = x. Integrating twice: y(x) = x^3/6 + C1*x + C2. Using y(0)=0 gives C2=0. Using y(1)=1 gives 1/6 + C1 = 1 => C1 = 5/6. Therefore, y(x) = (x^3 + 5x)/6.",
            section: "Part B"
        },
        {
            id: 2,
            text: "Which of the following represents the necessary condition for an extremum of the functional ∫ F(x, y, y') dx?",
            options: [
                "Euler-Lagrange Equation",
                "Jacobi's Condition",
                "Weierstrass Necessary Condition",
                "Legendre's Condition"
            ],
            correctIndex: 0,
            explanation: "The first order necessary condition for the functional J[y] = ∫ F(x, y, y') dx to have an extremum is the Euler-Lagrange differential equation: ∂F/∂y - d/dx(∂F/∂y') = 0.",
            section: "Part B"
        },
        {
            id: 3,
            text: "For the functional J[y] = ∫ [ (y')^2 - y^2 ] dx from 0 to π, with y(0)=0 and y(π)=0, the extremal:",
            options: [
                "Is y = C sin(x) for any arbitrary constant C",
                "Is uniquely y = 0",
                "Does not exist",
                "Is y = C cos(x)"
            ],
            correctIndex: 0,
            explanation: "Here F = y'^2 - y^2. ∂F/∂y = -2y, ∂F/∂y' = 2y'. Euler-Lagrange gives -2y - 2y'' = 0 => y'' + y = 0. The general solution is y(x) = A cos(x) + B sin(x). y(0)=0 implies A=0. y(π)=0 gives B sin(π) = 0, which holds for any arbitrary constant B. Thus y(x) = C sin(x).",
            section: "Part C"
        },
        {
            id: 4,
            text: "If the integrand F(x, y, y') does not depend explicitly on x, then the first integral of the Euler-Lagrange equation is:",
            options: [
                "F - y' (∂F/∂y') = Constant (Beltrami Identity)",
                "∂F/∂y' = Constant",
                "F + y' (∂F/∂y') = Constant",
                "∂F/∂y = Constant"
            ],
            correctIndex: 0,
            explanation: "When F does not depend explicitly on x (i.e., ∂F/∂x = 0), the Euler-Lagrange equation integrates to the Beltrami Identity: F - y' (∂F/∂y') = C.",
            section: "Part B"
        },
        {
            id: 5,
            text: "In the Brachistochrone problem, the curve connecting two points down which a bead slides frictionless in shortest time under gravity is a:",
            options: [
                "Cycloid",
                "Catenary",
                "Parabola",
                "Straight line"
            ],
            correctIndex: 0,
            explanation: "The Brachistochrone problem leads to the functional T[y] = ∫ sqrt(1 + y'^2) / sqrt(2gy) dx. Solving the Euler-Lagrange equation yields the parametric equations of a cycloid.",
            section: "Part B"
        }
    ],
    "Linear Algebra": [
        {
            id: 6,
            text: "Let A be a 3x3 real symmetric matrix such that Trace(A) = 6 and Det(A) = 6. If 1 is an eigenvalue of A, the other two eigenvalues are:",
            options: [
                "2 and 3",
                "1 and 4",
                "-1 and 6",
                "0 and 5"
            ],
            correctIndex: 0,
            explanation: "Let the eigenvalues be λ1=1, λ2, λ3. Trace = λ1 + λ2 + λ3 = 6 => λ2 + λ3 = 5. Determinant = λ1 * λ2 * λ3 = 6 => λ2 * λ3 = 6. The quadratic equation is t^2 - 5t + 6 = 0, giving eigenvalues t = 2 and t = 3.",
            section: "Part B"
        },
        {
            id: 7,
            text: "A matrix A is diagonalizable over ℝ if and only if:",
            options: [
                "The geometric multiplicity equals algebraic multiplicity for all real eigenvalues",
                "All eigenvalues are purely imaginary",
                "A is upper triangular",
                "Det(A) ≠ 0"
            ],
            correctIndex: 0,
            explanation: "A matrix is diagonalizable over a field F iff its characteristic polynomial splits over F and for every eigenvalue, its geometric multiplicity equals its algebraic multiplicity.",
            section: "Part B"
        },
        {
            id: 8,
            text: "If V is an n-dimensional vector space over ℝ, and T: V → V is a linear operator with T^2 = T (projection operator), then:",
            options: [
                "The only possible eigenvalues of T are 0 and 1",
                "T is necessarily invertible",
                "T has no real eigenvalues",
                "Trace(T) must be 0"
            ],
            correctIndex: 0,
            explanation: "If λ is an eigenvalue of T with eigenvector v ≠ 0, then T(v) = λv and T^2(v) = λ^2 v. Since T^2 = T, λ^2 v = λ v => (λ^2 - λ)v = 0. Since v ≠ 0, λ(λ - 1) = 0 => λ = 0 or λ = 1.",
            section: "Part C"
        }
    ],
    "Real Analysis": [
        {
            id: 9,
            text: "In the Euclidean metric space ℝ, which of the following subsets is compact?",
            options: [
                "[0, 1] ∪ {2}",
                "(0, 1)",
                "[0, ∞)",
                "ℚ ∩ [0, 1]"
            ],
            correctIndex: 0,
            explanation: "By Heine-Borel theorem, a subset of ℝ^n is compact iff it is closed and bounded. [0, 1] ∪ {2} is both closed and bounded in ℝ, hence compact. (0,1) is not closed; [0, ∞) is not bounded; ℚ ∩ [0,1] is not closed.",
            section: "Part B"
        },
        {
            id: 10,
            text: "If (X, d) is a complete metric space and f: X → X satisfies d(f(x), f(y)) ≤ k d(x, y) with 0 ≤ k < 1 for all x, y ∈ X, then:",
            options: [
                "f has a unique fixed point in X (Banach Fixed Point Theorem)",
                "f has infinitely many fixed points",
                "f is not continuous",
                "f cannot have any fixed point"
            ],
            correctIndex: 0,
            explanation: "By the Banach Contraction Mapping Principle, any contraction mapping on a complete metric space has a unique fixed point.",
            section: "Part B"
        }
    ],
    "Complex Analysis": [
        {
            id: 11,
            text: "Let f(z) = 1 / (z^2 - 1). The residue of f(z) at the simple pole z = 1 is:",
            options: [
                "1/2",
                "-1/2",
                "1",
                "0"
            ],
            correctIndex: 0,
            explanation: "Res(f, 1) = lim_{z->1} (z-1) / ((z-1)(z+1)) = lim_{z->1} 1 / (z+1) = 1/2.",
            section: "Part B"
        },
        {
            id: 12,
            text: "According to Liouville's Theorem, every bounded entire function on ℂ is:",
            options: [
                "Constant",
                "Polynomial of degree ≥ 1",
                "Periodic",
                "Zero everywhere"
            ],
            correctIndex: 0,
            explanation: "Liouville's theorem states that if an entire function f is bounded on the complex plane, then f is constant.",
            section: "Part B"
        }
    ],
    "Differential Equations": [
        {
            id: 13,
            text: "The general solution of the Euler-Cauchy ODE: x^2 y'' - 2x y' + 2y = 0 for x > 0 is:",
            options: [
                "y = C1 x + C2 x^2",
                "y = C1 e^x + C2 e^(2x)",
                "y = C1 cos(ln x) + C2 sin(ln x)",
                "y = C1 / x + C2 / x^2"
            ],
            correctIndex: 0,
            explanation: "Substituting y = x^m: m(m-1) - 2m + 2 = 0 => m^2 - 3m + 2 = 0 => (m-1)(m-2) = 0 => m = 1, 2. Thus y = C1 x + C2 x^2.",
            section: "Part B"
        },
        {
            id: 14,
            text: "For the PDE u_{xx} - 4 u_{xy} + 4 u_{yy} = 0, the equation is classified as:",
            options: [
                "Parabolic",
                "Hyperbolic",
                "Elliptic",
                "Ultra-hyperbolic"
            ],
            correctIndex: 0,
            explanation: "Here A=1, B=-4, C=4. Discriminant B^2 - 4AC = (-4)^2 - 4(1)(4) = 16 - 16 = 0. When B^2 - 4AC = 0, the PDE is Parabolic.",
            section: "Part B"
        }
    ],
    "Modern Algebra": [
        {
            id: 15,
            text: "The number of non-isomorphic abelian groups of order 36 is:",
            options: [
                "4",
                "6",
                "2",
                "8"
            ],
            correctIndex: 0,
            explanation: "36 = 2^2 * 3^2. The number of partitions of 2 is p(2) = 2. Total abelian groups = p(2) * p(2) = 2 * 2 = 4.",
            section: "Part B"
        }
    ],
    "Linear Integral Equations": [
        {
            id: 16,
            text: "The Fredholm integral equation y(x) = f(x) + λ ∫ K(x, t) y(t) dt with K(x, t) = g(x) h(t) has a separable (degenerate) kernel. The solution reduces to:",
            options: [
                "An algebraic linear equation in one unknown constant",
                "A nonlinear Riccati equation",
                "A non-homogeneous second-order PDE",
                "An unsolvable transcendental relation"
            ],
            correctIndex: 0,
            explanation: "When the kernel is separable K(x,t) = g(x)h(t), the integral becomes C * g(x) where C = ∫ h(t) y(t) dt. Multiplying by h(x) and integrating gives an algebraic equation for C.",
            section: "Part B"
        }
    ]
};

export const OFFICIAL_COURSE_TESTS = [
    // Full Length Tests
    {
        id: "flt-01",
        name: "CSIR NET Dec 2026 - Full Length Mock Test 01 (Part A, B, C)",
        category: "full",
        maxDuration: 180,
        totalMarks: 200,
        totalQuestions: 85,
        syllabus: "Complete Mathematical Sciences Syllabus: Real, Linear, Complex, Modern Algebra, ODE, PDE, COV, IE, Part A General Aptitude"
    },
    {
        id: "flt-02",
        name: "CSIR NET Dec 2026 - Full Length Mock Test 02 (Part A, B, C)",
        category: "full",
        maxDuration: 180,
        totalMarks: 200,
        totalQuestions: 85,
        syllabus: "Complete Pure and Applied Mathematics Syllabus according to CSIR HRDG pattern"
    },
    {
        id: "flt-03",
        name: "CSIR NET Dec 2026 - Full Length All-India Ranking Test 03",
        category: "full",
        maxDuration: 180,
        totalMarks: 200,
        totalQuestions: 85,
        syllabus: "Full Syllabus Comprehensive Exam Simulation"
    },

    // Chapter Wise Tests
    {
        id: "ch-cov-01",
        name: "Calculus of Variations (COV) - Chapter Wise Test",
        category: "chapter",
        maxDuration: 45,
        totalMarks: 30,
        totalQuestions: 15,
        syllabus: "Euler-Lagrange Equation, Beltrami Identity, Brachistochrone, Extremals of Functionals"
    },
    {
        id: "ch-la-01",
        name: "Linear Algebra - Chapter Wise Test (Matrices, Eigenvalues & Bilinear Forms)",
        category: "chapter",
        maxDuration: 60,
        totalMarks: 40,
        totalQuestions: 20,
        syllabus: "Vector Spaces, Subspaces, Basis, Dimension, Linear Transformations, Eigenvalues, Cayley-Hamilton"
    },
    {
        id: "ch-ra-01",
        name: "Real Analysis - Chapter Wise Test (Topology & Metric Spaces)",
        category: "chapter",
        maxDuration: 60,
        totalMarks: 40,
        totalQuestions: 20,
        syllabus: "Metric Spaces, Compactness, Connectedness, Sequences, Uniform Convergence, Riemann Integration"
    },
    {
        id: "ch-ca-01",
        name: "Complex Analysis - Chapter Wise Test (Analytic Functions & Residues)",
        category: "chapter",
        maxDuration: 60,
        totalMarks: 40,
        totalQuestions: 20,
        syllabus: "Cauchy-Riemann Equations, Cauchy Integral Formula, Singularities, Residue Theorem"
    },
    {
        id: "ch-ma-01",
        name: "Modern Algebra - Chapter Wise Test (Groups, Rings & Fields)",
        category: "chapter",
        maxDuration: 60,
        totalMarks: 40,
        totalQuestions: 20,
        syllabus: "Group Theory, Sylow Theorems, Normal Subgroups, Ring Theory, Ideals, Fields"
    },
    {
        id: "ch-ode-pde-01",
        name: "Differential Equations (ODE & PDE) - Chapter Wise Test",
        category: "chapter",
        maxDuration: 60,
        totalMarks: 40,
        totalQuestions: 20,
        syllabus: "First & Higher Order ODE, Sturm-Liouville, Classification of 2nd order PDE (Laplace, Wave, Heat)"
    },
    {
        id: "ch-ie-01",
        name: "Linear Integral Equations & Green's Function - Chapter Wise Test",
        category: "chapter",
        maxDuration: 45,
        totalMarks: 30,
        totalQuestions: 15,
        syllabus: "Fredholm & Volterra Integral Equations, Resolvent Kernel, Symmetric Kernels, Green's Function"
    },

    // Monthly Assessment Tests
    {
        id: "mth-aug-2026",
        name: "Mathematical Sciences Monthly Assessment Test - August 2026",
        category: "monthly",
        maxDuration: 90,
        totalMarks: 100,
        totalQuestions: 40,
        syllabus: "Cumulative Syllabus Coverage of August Lectures"
    },
    {
        id: "mth-sep-2026",
        name: "Mathematical Sciences Monthly Assessment Test - September 2026",
        category: "monthly",
        maxDuration: 90,
        totalMarks: 100,
        totalQuestions: 40,
        syllabus: "Cumulative Syllabus Coverage of September Lectures"
    },
    {
        id: "mth-oct-2026",
        name: "Mathematical Sciences Monthly Assessment Test - October 2026",
        category: "monthly",
        maxDuration: 90,
        totalMarks: 100,
        totalQuestions: 40,
        syllabus: "Cumulative Syllabus Coverage of October Lectures"
    },
    {
        id: "mth-nov-2026",
        name: "Mathematical Sciences Monthly Assessment Test - November 2026",
        category: "monthly",
        maxDuration: 90,
        totalMarks: 100,
        totalQuestions: 40,
        syllabus: "Cumulative Syllabus Coverage of November Lectures"
    },
    {
        id: "mth-dec-2026",
        name: "Mathematical Sciences Monthly Assessment Test - December 2026",
        category: "monthly",
        maxDuration: 90,
        totalMarks: 100,
        totalQuestions: 40,
        syllabus: "Final Pre-Exam Monthly Revision Test"
    },

    // Practice Tests
    {
        id: "prac-cov-01",
        name: "Calculus of Variations - Necessary Conditions Practice Test",
        category: "practice",
        maxDuration: 30,
        totalMarks: 20,
        totalQuestions: 10,
        syllabus: "Euler-Lagrange Equation and Variational Derivative Practice"
    },
    {
        id: "prac-la-01",
        name: "Linear Algebra - Diagonalization & Matrix Rank Practice Test",
        category: "practice",
        maxDuration: 30,
        totalMarks: 20,
        totalQuestions: 10,
        syllabus: "Eigenvalues, Eigenvectors, Diagonalizability Practice"
    },
    {
        id: "prac-ra-01",
        name: "Real Analysis - Series, Sequences & Point-set Topology Practice Test",
        category: "practice",
        maxDuration: 30,
        totalMarks: 20,
        totalQuestions: 10,
        syllabus: "Convergence criteria and Open/Closed Sets"
    },
    {
        id: "prac-part-a-01",
        name: "General Aptitude Part A - Quantitative & Logical Reasoning Practice Test",
        category: "practice",
        maxDuration: 30,
        totalMarks: 30,
        totalQuestions: 15,
        syllabus: "Number Systems, Series, Geometry, Probability, Graphical Analysis"
    }
];

export const MOCK_TESTS: MockTest[] = [
    {
        id: "cov-test-01",
        title: "Calculus of Variations (COV) - Topic Mock Test",
        topic: "Calculus of Variations",
        subject: "Mathematical Sciences",
        durationMinutes: 45,
        totalMarks: 30,
        negativeMark: 0.75,
        questions: QUESTION_BANK["COV"]
    },
    {
        id: "la-test-01",
        title: "Linear Algebra - Eigenvalues & Vector Spaces Test",
        topic: "Linear Algebra",
        subject: "Mathematical Sciences",
        durationMinutes: 60,
        totalMarks: 40,
        negativeMark: 1.0,
        questions: QUESTION_BANK["Linear Algebra"]
    },
    {
        id: "ra-test-01",
        title: "Real Analysis - Metric Spaces & Topology Mock Test",
        topic: "Real Analysis",
        subject: "Mathematical Sciences",
        durationMinutes: 60,
        totalMarks: 40,
        negativeMark: 1.0,
        questions: QUESTION_BANK["Real Analysis"]
    }
];

// Helper to generate a live test session from ANY real test (Full length or DPP)
export function generateTestSession(rawTest: any): MockTest {
    const title = rawTest.name || rawTest.title || "CSIR NET Practice Test";
    const duration = rawTest.maxDuration || 180;
    const totalMarks = rawTest.totalMarks || (duration >= 120 ? 200 : 45);
    const negativeMark = duration >= 120 ? 0.75 : 0.5;

    // Pick questions relevant to the title or synthesize full syllabus
    const allQ: Question[] = [];
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("cov") || lowerTitle.includes("variation")) {
        allQ.push(...QUESTION_BANK["COV"]);
    } else if (lowerTitle.includes("linear algebra")) {
        allQ.push(...QUESTION_BANK["Linear Algebra"]);
    } else if (lowerTitle.includes("real")) {
        allQ.push(...QUESTION_BANK["Real Analysis"]);
    } else if (lowerTitle.includes("complex")) {
        allQ.push(...QUESTION_BANK["Complex Analysis"]);
    } else if (lowerTitle.includes("differential") || lowerTitle.includes("ode") || lowerTitle.includes("pde")) {
        allQ.push(...QUESTION_BANK["Differential Equations"]);
    } else if (lowerTitle.includes("modern") || lowerTitle.includes("algebra")) {
        allQ.push(...QUESTION_BANK["Modern Algebra"]);
    } else if (lowerTitle.includes("integral")) {
        allQ.push(...QUESTION_BANK["Linear Integral Equations"]);
    } else {
        // Full length test: include from all domains
        Object.values(QUESTION_BANK).forEach(qList => allQ.push(...qList));
    }

    // Remap question IDs sequentially
    const questions = (allQ.length ? allQ : QUESTION_BANK["COV"]).map((q, idx) => ({
        ...q,
        id: idx + 1
    }));

    return {
        id: rawTest._id || rawTest.id || `test-${Date.now()}`,
        title,
        topic: rawTest.examPattern === "CSIR_MATHEMATICAL" ? "Full Length CSIR Mock" : "Practice Test",
        subject: "Mathematical Sciences",
        durationMinutes: duration,
        totalMarks,
        negativeMark,
        questions,
        instructionsHtml: rawTest.generalInstructions
    };
}
