import { db } from "../server/db.js";
import { modules, problems } from "../shared/schema.js";

async function seedModules() {
  console.log("Seeding modules...");

  try {
    // Insert sample modules
    const moduleData = [
      {
        id: "tvm-module",
        title: "Time Value of Money",
        description: "Master present value, future value, and annuity calculations essential for financial analysis",
        category: "Core Concepts",
        difficulty: 1,
        estimatedMinutes: 90,
        problemCount: 25,
        topics: ["Present Value", "Future Value", "Annuities", "Perpetuities"],
        learningObjectives: [
          "Calculate present and future values",
          "Understand annuity formulas",
          "Apply time value concepts to real scenarios"
        ]
      },
      {
        id: "portfolio-module", 
        title: "Portfolio Theory",
        description: "Learn risk, return, and diversification principles for optimal portfolio construction",
        category: "Investment Theory",
        difficulty: 2,
        estimatedMinutes: 75,
        problemCount: 22,
        topics: ["CAPM", "Risk & Return", "Diversification", "Efficient Frontier"],
        learningObjectives: [
          "Calculate portfolio risk and return",
          "Apply CAPM model",
          "Understand diversification benefits"
        ]
      },
      {
        id: "bonds-module",
        title: "Bond Valuation", 
        description: "Understand bond pricing, yield calculations, and interest rate risk management",
        category: "Fixed Income",
        difficulty: 2,
        estimatedMinutes: 85,
        problemCount: 20,
        topics: ["Bond Pricing", "Yield Calculations", "Duration", "Convexity"],
        learningObjectives: [
          "Price bonds using different methods",
          "Calculate various yield measures",
          "Assess interest rate sensitivity"
        ]
      },
      {
        id: "statements-module",
        title: "Financial Statements",
        description: "Analyze balance sheets, income statements, and cash flow statements effectively",
        category: "Financial Analysis", 
        difficulty: 1,
        estimatedMinutes: 95,
        problemCount: 28,
        topics: ["Balance Sheet", "Income Statement", "Cash Flow", "Ratios"],
        learningObjectives: [
          "Interpret financial statements",
          "Calculate financial ratios",
          "Assess company performance"
        ]
      },
      {
        id: "derivatives-module",
        title: "Derivatives",
        description: "Master options, futures, and other derivative instruments for risk management",
        category: "Advanced Topics",
        difficulty: 3,
        estimatedMinutes: 100,
        problemCount: 20,
        topics: ["Options", "Futures", "Swaps", "Risk Management"],
        learningObjectives: [
          "Value derivative instruments",
          "Understand hedging strategies", 
          "Apply derivatives for risk management"
        ]
      }
    ];

    // Insert modules
    for (const module of moduleData) {
      await db.insert(modules).values(module).onConflictDoNothing();
    }

    // Insert sample problems for each module
    const sampleProblems = [
      {
        id: "tvm-001",
        topic: "Time Value of Money",
        difficulty: 1,
        question: "What is the present value of $1,000 received in 3 years at a 5% discount rate?",
        answer: "A",
        solution: "PV = $1,000 / (1.05)^3 = $1,000 / 1.1576 = $863.84",
        concepts: ["Present Value", "Discounting"],
        isActive: "Y"
      },
      {
        id: "portfolio-001", 
        topic: "Portfolio Theory",
        difficulty: 2,
        question: "If a stock has a beta of 1.2 and the market risk premium is 8%, what is the expected return using CAPM with a risk-free rate of 3%?",
        answer: "B", 
        solution: "Expected Return = Rf + β(Rm - Rf) = 3% + 1.2(8%) = 3% + 9.6% = 12.6%",
        concepts: ["CAPM", "Beta", "Risk Premium"],
        isActive: "Y"
      },
      {
        id: "bonds-001",
        topic: "Bond Valuation",
        difficulty: 2,
        question: "A bond with a 6% annual coupon, 5 years to maturity, and $1,000 face value is priced to yield 4%. What is its current price?",
        answer: "C",
        solution: "Price = Σ[60/(1.04)^t] + 1000/(1.04)^5 = $1,089.04",
        concepts: ["Bond Pricing", "Yield to Maturity"],
        isActive: "Y"
      },
      {
        id: "statements-001",
        topic: "Financial Statements", 
        difficulty: 1,
        question: "If a company has current assets of $500,000 and current liabilities of $250,000, what is its current ratio?",
        answer: "D",
        solution: "Current Ratio = Current Assets / Current Liabilities = $500,000 / $250,000 = 2.0",
        concepts: ["Liquidity Ratios", "Current Ratio"],
        isActive: "Y"
      },
      {
        id: "derivatives-001",
        topic: "Derivatives",
        difficulty: 3,
        question: "What is the intrinsic value of a call option with a strike price of $50 when the stock price is $55?",
        answer: "A",
        solution: "Intrinsic Value = Max(S - K, 0) = Max($55 - $50, 0) = $5",
        concepts: ["Options", "Intrinsic Value"],
        isActive: "Y"
      }
    ];

    // Insert sample problems
    for (const problem of sampleProblems) {
      await db.insert(problems).values(problem).onConflictDoNothing();
    }

    console.log("✅ Modules and sample problems seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding modules:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedModules().then(() => process.exit(0));
}

export { seedModules };