export const expandedCourseData = {
  course: {
    id: "kellogg-acf-prep",
    title: "Kellogg ACF Placement Exam Preparation",
    subtitle: "Master all 5 competency areas in 7 days",
    description: "Intensive interactive course covering Present Value, Portfolio Theory, Bond Valuation, and Financial Statements for the Kellogg ACF placement exam",
    overview: {
      duration: "7 days intensive",
      level: "Intermediate",
      language: "English",
      rating: 4.8,
      totalReviews: 1247,
      studentsEnrolled: 8934,
      skills: ["Time Value of Money", "Portfolio Theory", "Bond Valuation", "Financial Statements", "Risk Analysis", "Calculator Proficiency"]
    },
    learningOutcomes: [
      "Calculate present value and future value for any cash flow scenario",
      "Determine loan payments and amortization schedules",
      "Compute portfolio expected returns and risk metrics",
      "Calculate bond yields and equity total returns",
      "Classify financial statement items correctly",
      "Analyze transaction impacts across financial statements",
      "Achieve mechanical fluency for timed exam conditions"
    ],
    instructor: {
      name: "Dr. Sarah Chen",
      title: "Professor of Finance",
      bio: "Former Kellogg faculty with 15+ years experience in corporate finance education and ACF exam preparation",
      rating: 4.9,
      courses: 12,
      students: 45678
    },
    modules: [
      {
        id: 1,
        week: "Day 1",
        title: "Present Value & Amortization Mastery",
        duration: "3.5 hours",
        description: "Master time value of money calculations and loan amortization with speed and accuracy",
        contentBreakdown: {
          videos: 6,
          readings: 4,
          assignments: 2,
          quizzes: 3
        },
        lessons: [
          {
            id: "pv-fundamentals",
            title: "Present Value Fundamentals",
            type: "video",
            duration: "25 min",
            description: "Core PV concepts with step-by-step calculations"
          },
          {
            id: "fv-compounding",
            title: "Future Value & Compounding",
            type: "video", 
            duration: "20 min",
            description: "Master compound interest and growth calculations"
          },
          {
            id: "annuity-calculations",
            title: "Annuity Calculations",
            type: "video",
            duration: "30 min",
            description: "Regular and annuity due calculations"
          },
          {
            id: "loan-amortization",
            title: "Loan Amortization",
            type: "video",
            duration: "25 min",
            description: "Monthly payments and amortization schedules"
          },
          {
            id: "calculator-mastery",
            title: "Financial Calculator Mastery",
            type: "interactive",
            duration: "20 min",
            description: "BA II Plus and HP 12C functions for speed"
          },
          {
            id: "pv-speed-drills",
            title: "PV Speed Drills",
            type: "practice",
            duration: "30 min",
            description: "Timed practice: 20 problems in 20 minutes"
          }
        ]
      },
      {
        id: 2,
        week: "Day 2", 
        title: "Portfolio Return & Risk Analysis",
        duration: "3.5 hours",
        description: "Calculate portfolio returns, variance, and correlation effects with precision",
        contentBreakdown: {
          videos: 5,
          readings: 3,
          assignments: 2,
          quizzes: 2
        },
        lessons: [
          {
            id: "expected-returns",
            title: "Expected Portfolio Returns",
            type: "video",
            duration: "20 min",
            description: "Weighted average return calculations"
          },
          {
            id: "portfolio-risk",
            title: "Portfolio Risk & Variance",
            type: "video",
            duration: "30 min", 
            description: "Standard deviation and correlation effects"
          },
          {
            id: "diversification-benefits",
            title: "Diversification Benefits",
            type: "video",
            duration: "25 min",
            description: "How correlation reduces portfolio risk"
          },
          {
            id: "portfolio-calculator",
            title: "Portfolio Calculator Tool",
            type: "interactive",
            duration: "25 min",
            description: "Build and test portfolio scenarios"
          },
          {
            id: "risk-return-drills",
            title: "Risk-Return Speed Drills",
            type: "practice",
            duration: "35 min",
            description: "15 portfolio problems with time pressure"
          }
        ]
      },
      {
        id: 3,
        week: "Day 3",
        title: "Bond Valuation & Investment Returns", 
        duration: "3.5 hours",
        description: "Master bond YTM calculations and equity total return analysis",
        contentBreakdown: {
          videos: 6,
          readings: 3,
          assignments: 2,
          quizzes: 2
        },
        lessons: [
          {
            id: "bond-pricing-basics",
            title: "Bond Pricing Fundamentals",
            type: "video",
            duration: "25 min",
            description: "Coupon bonds and price-yield relationships"
          },
          {
            id: "ytm-calculations",
            title: "Yield to Maturity Calculations",
            type: "video",
            duration: "30 min",
            description: "YTM using trial-and-error and calculator methods"
          },
          {
            id: "equity-total-returns",
            title: "Equity Total Returns",
            type: "video",
            duration: "20 min",
            description: "Dividend yield plus capital gains calculations"
          },
          {
            id: "bond-calculator-functions",
            title: "Bond Calculator Functions",
            type: "interactive",
            duration: "20 min",
            description: "Master bond pricing and YTM functions"
          },
          {
            id: "current-yield-concepts",
            title: "Current Yield vs YTM",
            type: "video",
            duration: "15 min",
            description: "Understanding different yield measures"
          },
          {
            id: "bond-equity-drills",
            title: "Bond & Equity Speed Drills",
            type: "practice",
            duration: "30 min",
            description: "20 YTM and return problems timed"
          }
        ]
      },
      {
        id: 4,
        week: "Day 4",
        title: "Financial Statement Classification",
        duration: "3 hours",
        description: "Rapidly classify balance sheet and income statement items",
        contentBreakdown: {
          videos: 4,
          readings: 5,
          assignments: 1,
          quizzes: 3
        },
        lessons: [
          {
            id: "balance-sheet-structure",
            title: "Balance Sheet Structure",
            type: "video",
            duration: "25 min",
            description: "Assets, liabilities, and equity organization"
          },
          {
            id: "current-vs-longterm",
            title: "Current vs Long-term Classification",
            type: "video",
            duration: "20 min",
            description: "One-year rule and classification criteria"
          },
          {
            id: "common-accounts",
            title: "Common Account Classifications",
            type: "reading",
            duration: "30 min",
            description: "Memorize standard account types"
          },
          {
            id: "classification-game",
            title: "Classification Speed Game",
            type: "interactive",
            duration: "25 min",
            description: "Gamified classification practice"
          },
          {
            id: "classification-drills",
            title: "Classification Speed Drills",
            type: "practice",
            duration: "40 min",
            description: "50 items in 10 minutes challenge"
          }
        ]
      },
      {
        id: 5,
        week: "Day 5",
        title: "Financial Statement Interactions",
        duration: "3 hours",
        description: "Understand how transactions flow through financial statements",
        contentBreakdown: {
          videos: 5,
          readings: 3,
          assignments: 2,
          quizzes: 2
        },
        lessons: [
          {
            id: "accrual-accounting",
            title: "Accrual Accounting Principles",
            type: "video",
            duration: "25 min",
            description: "Revenue recognition and matching principle"
          },
          {
            id: "transaction-analysis",
            title: "Transaction Impact Analysis",
            type: "video",
            duration: "30 min",
            description: "How transactions affect multiple statements"
          },
          {
            id: "credit-sales-impact",
            title: "Credit Sales & Collections",
            type: "video",
            duration: "20 min",
            description: "A/R and revenue timing effects"
          },
          {
            id: "debt-equity-transactions",
            title: "Debt & Equity Transactions",
            type: "video",
            duration: "25 min",
            description: "Financing transaction impacts"
          },
          {
            id: "transaction-simulator",
            title: "Transaction Impact Simulator",
            type: "interactive",
            duration: "30 min",
            description: "Practice transaction effects in real-time"
          }
        ]
      },
      {
        id: 6,
        week: "Day 6",
        title: "Integration & Speed Mastery",
        duration: "4 hours",
        description: "Combine all competency areas with exam-level time pressure",
        contentBreakdown: {
          videos: 3,
          readings: 2,
          assignments: 3,
          quizzes: 4
        },
        lessons: [
          {
            id: "competency-integration",
            title: "Competency Integration",
            type: "video",
            duration: "30 min",
            description: "How all topics connect in practice"
          },
          {
            id: "calculator-efficiency",
            title: "Calculator Efficiency Mastery",
            type: "interactive",
            duration: "25 min",
            description: "Speed techniques for all functions"
          },
          {
            id: "mixed-problem-sets",
            title: "Mixed Problem Sets",
            type: "practice",
            duration: "60 min",
            description: "All competency areas in timed sections"
          },
          {
            id: "weak-area-focus",
            title: "Adaptive Weak Area Practice",
            type: "adaptive",
            duration: "45 min",
            description: "AI-powered practice on your weak areas"
          },
          {
            id: "speed-optimization",
            title: "Speed Optimization Training",
            type: "practice",
            duration: "40 min",
            description: "Target 2 minutes per problem"
          }
        ]
      },
      {
        id: 7,
        week: "Day 7",
        title: "Exam Simulation & Final Prep",
        duration: "4 hours",
        description: "Full exam simulation under actual test conditions",
        contentBreakdown: {
          videos: 2,
          readings: 1,
          assignments: 1,
          quizzes: 2
        },
        lessons: [
          {
            id: "exam-strategy",
            title: "Exam Strategy & Time Management",
            type: "video",
            duration: "20 min",
            description: "Optimal approach for 2-hour exam"
          },
          {
            id: "full-mock-exam",
            title: "Full Mock Exam (2 hours)",
            type: "exam",
            duration: "120 min",
            description: "Complete ACF simulation under test conditions"
          },
          {
            id: "performance-analysis",
            title: "Performance Analysis & Review",
            type: "interactive",
            duration: "30 min",
            description: "Detailed breakdown of mock exam results"
          },
          {
            id: "final-review",
            title: "Final Formula & Concept Review",
            type: "review",
            duration: "30 min",
            description: "Last-minute reinforcement of key concepts"
          }
        ]
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Michael Rodriguez",
        program: "Kellogg MBA 2024",
        rating: 5,
        date: "2024-01-15",
        text: "This course was exactly what I needed to pass the ACF exam. The speed drills and calculator mastery sections were game-changers. Passed on my first attempt!"
      },
      {
        id: 2,
        name: "Jennifer Kim",
        program: "Kellogg MBA 2024", 
        rating: 5,
        date: "2024-01-10",
        text: "The 7-day structure kept me focused and the interactive elements made complex topics manageable. The mock exam was incredibly realistic."
      },
      {
        id: 3,
        name: "David Thompson",
        program: "Kellogg MBA 2023",
        rating: 5,
        date: "2023-12-20",
        text: "As someone with limited finance background, this course built my confidence systematically. The portfolio risk calculations were especially well explained."
      }
    ]
  }
}

