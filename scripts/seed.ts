import { db } from "../server/db";
import { modules, problems } from "../shared/schema";

// Complete problem bank from the original implementation
const ALL_PROBLEMS = [
  // Time Value of Money problems
  {
    id: "tvm-1",
    topic: "Time Value of Money",
    difficulty: 0,
    question: "What is the present value of $3,000 received in 5 years at 8% annual interest?",
    answer: "2042.10",
    solution: "Step 1: Use PV formula: PV = FV / (1+r)^n\nStep 2: PV = 3000 / (1.08)^5\nStep 3: PV = 3000 / 1.4693 = $2,042.10",
    concepts: ["Present Value", "Discounting", "Time Value"]
  },
  {
    id: "tvm-2", 
    topic: "Time Value of Money",
    difficulty: 1,
    question: "What is the present value of an annuity paying $500 annually for 10 years at 6%?",
    answer: "3680.04",
    solution: "Step 1: Use PV annuity formula: PV = PMT × [1-(1+r)^-n]/r\nStep 2: PV = 500 × [1-(1.06)^-10]/0.06\nStep 3: PV = 500 × 7.3601 = $3,680.04",
    concepts: ["Annuity", "Present Value", "Cash Flow"]
  },
  {
    id: "tvm-3",
    topic: "Time Value of Money", 
    difficulty: 0,
    question: "What is the future value of $2,000 invested for 8 years at 7%?",
    answer: "3436.42",
    solution: "Step 1: Use FV formula: FV = PV × (1+r)^n\nStep 2: FV = 2000 × (1.07)^8\nStep 3: FV = 2000 × 1.7182 = $3,436.42",
    concepts: ["Future Value", "Compounding", "Growth"]
  },
  
  // Portfolio Theory problems
  {
    id: "port-1",
    topic: "Portfolio Theory",
    difficulty: 1,
    question: "Using CAPM, calculate expected return for a stock with β=1.2, Rf=3%, Rm=12%.",
    answer: "13.8%",
    solution: "Step 1: CAPM formula: E(R) = Rf + β(Rm - Rf)\nStep 2: E(R) = 0.03 + 1.2(0.12 - 0.03)\nStep 3: E(R) = 0.03 + 1.2(0.09) = 0.138 = 13.8%",
    concepts: ["CAPM", "Beta", "Expected Return"]
  },
  {
    id: "port-2",
    topic: "Portfolio Theory",
    difficulty: 2,
    question: "Portfolio with weights 0.6, 0.4, volatilities 15%, 25%, correlation 0.3. Calculate portfolio standard deviation.",
    answer: "16.82%",
    solution: "Step 1: σp² = w1²σ1² + w2²σ2² + 2w1w2ρσ1σ2\nStep 2: σp² = (0.6)²(0.15)² + (0.4)²(0.25)² + 2(0.6)(0.4)(0.3)(0.15)(0.25)\nStep 3: σp² = 0.0081 + 0.025 + 0.0054 = 0.0283\nStep 4: σp = √0.0283 = 16.82%",
    concepts: ["Portfolio Variance", "Correlation", "Diversification"]
  },
  
  // Bond Valuation problems
  {
    id: "bond-1", 
    topic: "Bond Valuation",
    difficulty: 1,
    question: "Bond with 5% coupon, 10 years maturity, $1000 face value, YTM 6%. What's the price?",
    answer: "926.40",
    solution: "Step 1: Annual coupon = $50\nStep 2: PV of coupons = 50 × [1-(1.06)^-10]/0.06 = $368.00\nStep 3: PV of principal = 1000/(1.06)^10 = $558.40\nStep 4: Bond price = $368.00 + $558.40 = $926.40",
    concepts: ["Bond Pricing", "YTM", "Present Value"]
  },
  {
    id: "bond-2",
    topic: "Bond Valuation", 
    difficulty: 2,
    question: "Calculate Macaulay duration for 3-year bond, 4% coupon, YTM 5%.",
    answer: "2.86",
    solution: "Step 1: Calculate present value of each cash flow\nStep 2: Weight each time period by PV of cash flow\nStep 3: Sum weighted times and divide by bond price\nStep 4: Duration = 2.86 years",
    concepts: ["Duration", "Bond Analytics", "Interest Rate Risk"]
  },

  // Financial Statements problems
  {
    id: "fs-1",
    topic: "Financial Statements",
    difficulty: 0,
    question: "Wages Payable - Current or Non-current liability?",
    answer: "Current liability",
    solution: "Current liability - Usually paid within the next payroll cycle (typically within a year).",
    concepts: ["Balance Sheet", "Current Liabilities"]
  },
  {
    id: "fs-2", 
    topic: "Financial Statements",
    difficulty: 1,
    question: "Company receives $10,000 cash in advance for services to be performed next month. Impact?",
    answer: "Assets +10,000 (Cash), Liabilities +10,000 (Unearned Revenue)",
    solution: "Creates an obligation to perform services in the future. Cash increases assets, unearned revenue increases liabilities.",
    concepts: ["Balance Sheet", "Unearned Revenue", "Cash"]
  },
  {
    id: "fs-3",
    topic: "Financial Statements", 
    difficulty: 0,
    question: "Notes Payable due in 3 years - Current or Non-current liability?",
    answer: "Non-current liability",
    solution: "Non-current liability - Payment due after one year.",
    concepts: ["Balance Sheet", "Long-term Debt"]
  },
  {
    id: "fs-4",
    topic: "Financial Statements",
    difficulty: 1,
    question: "Paid $2,000 rent expense in cash. Impact?",
    answer: "Assets -2,000 (Cash), Equity -2,000 (Expense reduces retained earnings)",
    solution: "Expense reduces net income and cash. Retained earnings decrease through expense recognition.",
    concepts: ["Income Statement", "Cash Flow", "Retained Earnings"]
  },
  {
    id: "fs-5",
    topic: "Financial Statements",
    difficulty: 1,
    question: "Accrued interest expense not yet paid. Impact on books?",
    answer: "Liabilities + (Interest Payable), Equity - (Expense)",
    solution: "Increases liability for unpaid interest and decreases retained earnings through expense.",
    concepts: ["Accruals", "Interest Payable", "Matching Principle"]
  },

  // Derivatives problems  
  {
    id: "deriv-1",
    topic: "Derivatives",
    difficulty: 0,
    question: "European call option, strike $100, stock price at expiration $120. What's the payoff?",
    answer: "20",
    solution: "Step 1: Call payoff = max(S - K, 0)\nStep 2: Payoff = max(120 - 100, 0)\nStep 3: Payoff = max(20, 0) = $20",
    concepts: ["Options", "Call Payoff", "Exercise Value"]
  },
  {
    id: "deriv-2",
    topic: "Derivatives",
    difficulty: 1,
    question: "Forward price for non-dividend stock, S0=$50, r=4%, T=2 years?",
    answer: "54.08",
    solution: "Step 1: Forward price F = S0 × e^(rT)\nStep 2: F = 50 × e^(0.04×2)\nStep 3: F = 50 × e^0.08 = 50 × 1.0833 = $54.08",
    concepts: ["Forward Pricing", "Arbitrage", "Cost of Carry"]
  }
];

async function seedData() {
  // Seed modules first
  const moduleData = [
    {
      id: 'time-value-money',
      title: 'Time Value of Money',
      description: 'Master present value, future value, and annuity calculations',
      category: 'Foundation',
      difficulty: 1,
      estimatedTime: 90,
      problemCount: 25
    },
    {
      id: 'portfolio-theory',
      title: 'Portfolio Theory',
      description: 'Learn risk, return, and diversification principles',
      category: 'Investments',
      difficulty: 2,
      estimatedTime: 75,
      problemCount: 25
    },
    {
      id: 'bond-valuation',
      title: 'Bond Valuation',
      description: 'Understand bond pricing and yield calculations',
      category: 'Fixed Income',
      difficulty: 2,
      estimatedTime: 85,
      problemCount: 25
    },
    {
      id: 'financial-statements',
      title: 'Financial Statements',
      description: 'Analyze balance sheets and income statements',
      category: 'Analysis',
      difficulty: 1,
      estimatedTime: 95,
      problemCount: 15
    },
    {
      id: 'derivatives',
      title: 'Derivatives',
      description: 'Options, futures, and forward contracts',
      category: 'Advanced',
      difficulty: 3,
      estimatedTime: 100,
      problemCount: 25
    }
  ];

  try {
    // Seed modules
    for (const module of moduleData) {
      await db.insert(modules).values(module).onConflictDoNothing();
    }
    console.log('✅ Modules seeded successfully');

    // Seed problems
    for (const problem of ALL_PROBLEMS) {
      await db.insert(problems).values(problem).onConflictDoNothing();
    }
    console.log('✅ Problems seeded successfully');
    console.log(`📊 Total problems seeded: ${ALL_PROBLEMS.length}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedData().catch(console.error);