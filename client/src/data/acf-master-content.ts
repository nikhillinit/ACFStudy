// Enhanced ACF Learning Content based on Master Playbook

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyFormulas: Formula[];
  excelTips: ExcelTip[];
  practiceProblems: PracticeProblem[];
  conceptMap?: string;
  videoResources: VideoResource[];
  quickReference: QuickReference[];
  miniModels: MiniModel[];
}

export interface Formula {
  name: string;
  formula: string;
  excelFunction: string;
  description: string;
  variables: { [key: string]: string };
}

export interface ExcelTip {
  action: string;
  shortcut: string;
  description: string;
}

export interface PracticeProblem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  excelSolution?: string;
  difficulty: number;
  timeEstimate: number;
}

export interface VideoResource {
  title: string;
  url: string;
  duration: string;
  description: string;
}

export interface QuickReference {
  concept: string;
  rule: string;
  example?: string;
}

export interface MiniModel {
  name: string;
  scenario: string;
  inputs: { [key: string]: any };
  excelFormula: string;
  result: string;
  explanation: string;
}

export const acfMasterContent: { [key: string]: LearningModule } = {
  "Time Value of Money": {
    id: "tvm",
    title: "Time Value of Money (TVM)",
    description: "Master the fundamental concept that a dollar today is worth more than a dollar tomorrow. Learn PV, FV, and compound interest calculations.",
    duration: 90,
    difficulty: 'Beginner',
    conceptMap: "Time value of money concept map illustrating cash flows across time periods",
    
    keyFormulas: [
      {
        name: "Present Value (Single Sum)",
        formula: "PV = FV / (1 + r)^n",
        excelFunction: "=PV(r, n, 0, -FV)",
        description: "Calculate the current value of a future cash flow",
        variables: {
          "PV": "Present Value",
          "FV": "Future Value", 
          "r": "Interest Rate",
          "n": "Number of Periods"
        }
      },
      {
        name: "Future Value (Single Sum)",
        formula: "FV = PV × (1 + r)^n",
        excelFunction: "=FV(r, n, 0, -PV)",
        description: "Calculate the future value of a present cash flow",
        variables: {
          "PV": "Present Value",
          "FV": "Future Value", 
          "r": "Interest Rate",
          "n": "Number of Periods"
        }
      },
      {
        name: "Effective Rate",
        formula: "Effective Rate = (1 + r/m)^m - 1",
        excelFunction: "=EFFECT(r,m)",
        description: "Convert nominal rate to effective annual rate",
        variables: {
          "r": "Nominal Rate",
          "m": "Compounding Periods per Year"
        }
      }
    ],

    excelTips: [
      {
        action: "Absolute References",
        shortcut: "F4",
        description: "Lock cells quickly during formula creation"
      },
      {
        action: "Goal Seek",
        shortcut: "Alt → A → W → G",
        description: "Find break-even rates or target values"
      },
      {
        action: "Format as Percentage",
        shortcut: "Ctrl + Shift + %",
        description: "Quick percentage formatting"
      }
    ],

    miniModels: [
      {
        name: "Present Value Calculation",
        scenario: "How much is $10,000 received in 4 years worth today at 6%?",
        inputs: { FV: 10000, rate: 0.06, periods: 4 },
        excelFormula: "=PV(0.06,4,0,-10000)",
        result: "$7,920.14",
        explanation: "The present value discounts future cash flows at the given rate"
      }
    ],

    practiceProblems: [
      {
        id: "tvm-1",
        question: "What is the present value of $5,000 received in 7 years at a 7% discount rate?",
        options: ["$3,106.16", "$3,500.00", "$4,200.00", "$4,650.00"],
        correctAnswer: 0,
        explanation: "PV = $5,000 / (1.07)^7 = $3,106.16",
        excelSolution: "=PV(0.07,7,0,-5000)",
        difficulty: 1,
        timeEstimate: 120
      },
      {
        id: "tvm-2", 
        question: "If you invest $1,000 at 8% annual interest, what will it be worth in 10 years?",
        options: ["$2,158.92", "$1,800.00", "$2,000.00", "$2,500.00"],
        correctAnswer: 0,
        explanation: "FV = $1,000 × (1.08)^10 = $2,158.92",
        excelSolution: "=FV(0.08,10,0,-1000)",
        difficulty: 1,
        timeEstimate: 120
      }
    ],

    videoResources: [
      {
        title: "Khan Academy: Intro to Time Value of Money",
        url: "https://www.youtube.com/watch?v=pTdGH5MY4i8",
        duration: "8 min",
        description: "Step-by-step introduction to TVM concepts"
      },
      {
        title: "TED-Ed: Time Value of Money",
        url: "https://www.youtube.com/watch?v=MhvjCWfy-lw", 
        duration: "3 min",
        description: "Quick conceptual overview of TVM principles"
      }
    ],

    quickReference: [
      {
        concept: "Core Principle",
        rule: "A dollar today is worth more than a dollar tomorrow",
        example: "$100 today > $100 in 1 year (due to earning potential)"
      },
      {
        concept: "Discounting",
        rule: "Future values are discounted to present using interest rates",
        example: "Higher rates = lower present values"
      }
    ]
  },

  "Portfolio Theory": {
    id: "portfolio",
    title: "Portfolio Theory & Diversification", 
    description: "Learn risk-return relationships, correlation effects, and efficient portfolio construction using modern portfolio theory.",
    duration: 120,
    difficulty: 'Intermediate',
    conceptMap: "Efficient frontier showing risk-return trade-offs and correlation benefits",

    keyFormulas: [
      {
        name: "Expected Return",
        formula: "E(R) = Σ(wi × Ri)",
        excelFunction: "=SUMPRODUCT(weights, returns)",
        description: "Weighted average of individual asset returns",
        variables: {
          "E(R)": "Expected Portfolio Return",
          "wi": "Weight of Asset i",
          "Ri": "Return of Asset i"
        }
      },
      {
        name: "Two-Asset Portfolio Variance",
        formula: "σp² = w₁²σ₁² + w₂²σ₂² + 2w₁w₂σ₁σ₂ρ₁₂",
        excelFunction: "Complex calculation using CORREL and STDEV functions",
        description: "Portfolio risk considering correlation between assets",
        variables: {
          "σp": "Portfolio Standard Deviation",
          "w": "Asset Weights",
          "σ": "Asset Standard Deviations", 
          "ρ": "Correlation Coefficient"
        }
      }
    ],

    excelTips: [
      {
        action: "Portfolio Return",
        shortcut: "=SUMPRODUCT(weights,returns)",
        description: "Calculate weighted portfolio returns in one cell"
      },
      {
        action: "Correlation",
        shortcut: "=CORREL(rangeA,rangeB)",
        description: "Calculate correlation between two asset series"
      },
      {
        action: "Standard Deviation",
        shortcut: "=STDEV.S(range)",
        description: "Calculate sample standard deviation of returns"
      }
    ],

    practiceProblems: [
      {
        id: "port-1",
        question: "What is the expected return of a portfolio with 60% stocks (12% return) and 40% bonds (6% return)?",
        options: ["9.6%", "10.2%", "8.8%", "11.4%"],
        correctAnswer: 0,
        explanation: "E(R) = (0.60 × 12%) + (0.40 × 6%) = 7.2% + 2.4% = 9.6%",
        excelSolution: "=SUMPRODUCT({0.6;0.4},{0.12;0.06})",
        difficulty: 2,
        timeEstimate: 150
      },
      {
        id: "port-2",
        question: "If two assets have standard deviations of 12% and 8% in a 50/50 portfolio with correlation 0, what is the portfolio standard deviation?",
        options: ["7.07%", "10.0%", "6.0%", "8.5%"],
        correctAnswer: 0,
        explanation: "σp = √[(0.5²×0.12²) + (0.5²×0.08²) + 2(0.5)(0.5)(0.12)(0.08)(0)] = 7.07%",
        difficulty: 3,
        timeEstimate: 180
      }
    ],

    videoResources: [
      {
        title: "Portfolio Risk & Return in Excel",
        url: "https://www.youtube.com/watch?v=portfolio-excel",
        duration: "12 min", 
        description: "Complete Excel walkthrough of portfolio calculations"
      }
    ],

    quickReference: [
      {
        concept: "Diversification Benefit",
        rule: "Lower correlation = greater risk reduction",
        example: "ρ = -1 (perfect negative) provides maximum diversification"
      },
      {
        concept: "Efficient Frontier",
        rule: "Optimal portfolios offer highest return for given risk level"
      }
    ]
  },

  "Bond Valuation": {
    id: "bonds",
    title: "Investment Returns & Bond Math",
    description: "Master bond pricing, yield calculations, duration concepts, and holding period returns for fixed income analysis.",
    duration: 135,
    difficulty: 'Intermediate',

    keyFormulas: [
      {
        name: "Bond Price (Annual Coupons)",
        formula: "P = Σ[C/(1+y)ᵗ] + F/(1+y)ⁿ",
        excelFunction: "=PV(y, n, -C, -F)",
        description: "Present value of bond's cash flows",
        variables: {
          "P": "Bond Price",
          "C": "Annual Coupon Payment",
          "y": "Yield to Maturity",
          "F": "Face Value",
          "n": "Years to Maturity"
        }
      },
      {
        name: "Yield to Maturity",
        formula: "Solve: Price = PV of all cash flows",
        excelFunction: "=RATE(n, C, -Price, F)",
        description: "Internal rate of return for bond investment",
        variables: {
          "n": "Periods to Maturity",
          "C": "Coupon Payment",
          "Price": "Current Bond Price",
          "F": "Face Value"
        }
      },
      {
        name: "Holding Period Return",
        formula: "HPR = (P₁ - P₀ + Dividends) / P₀",
        excelFunction: "=(P1-P0+Dividends)/P0",
        description: "Total return over holding period",
        variables: {
          "P₁": "Ending Price",
          "P₀": "Beginning Price"
        }
      },
      {
        name: "Duration",
        formula: "Modified Duration = Duration / (1 + YTM)",
        excelFunction: "=DURATION(settlement, maturity, coupon, yld, frequency)",
        description: "Price sensitivity to yield changes",
        variables: {
          "Duration": "Macaulay Duration",
          "YTM": "Yield to Maturity"
        }
      }
    ],

    miniModels: [
      {
        name: "Bond Pricing Example",
        scenario: "10-year bond, 5% coupon, 4% YTM - what's the price?",
        inputs: { coupon: 0.05, ytm: 0.04, years: 10, faceValue: 1000 },
        excelFormula: "=PV(0.04, 10, -50, -1000)",
        result: "$1,081.11",
        explanation: "Bond trades at premium because coupon rate > YTM"
      }
    ],

    practiceProblems: [
      {
        id: "bond-1",
        question: "What is the price of a 10-year bond with 5% annual coupon and 4% YTM (face value $1,000)?",
        options: ["$1,081.11", "$1,000.00", "$950.25", "$1,150.00"],
        correctAnswer: 0,
        explanation: "Using PV function: =PV(0.04, 10, -50, -1000) = $1,081.11",
        excelSolution: "=PV(0.04,10,-50,-1000)",
        difficulty: 2,
        timeEstimate: 180
      }
    ],

    videoResources: [
      {
        title: "Khan Academy: Bond Pricing",
        url: "https://www.youtube.com/watch?v=Qh-M3_L4xYk",
        duration: "10 min",
        description: "Complete bond valuation walkthrough with examples"
      }
    ],

    quickReference: [
      {
        concept: "Price-Yield Relationship",
        rule: "Bond prices move inversely to yields",
        example: "Yields up → Prices down"
      },
      {
        concept: "Premium vs Discount",
        rule: "Coupon rate vs YTM determines premium/discount",
        example: "Coupon > YTM → Premium bond"
      }
    ]
  },

  "Financial Statements": {
    id: "statements",
    title: "Financial Statements Analysis",
    description: "Understand balance sheet structure, income statement flows, and key financial ratios for comprehensive company analysis.",
    duration: 105,
    difficulty: 'Beginner',

    keyFormulas: [
      {
        name: "Fundamental Accounting Equation",
        formula: "Assets = Liabilities + Equity",
        excelFunction: "=Assets_Total-Liabilities_Total (should equal Equity)",
        description: "Core balance sheet relationship that must always balance",
        variables: {
          "Assets": "Everything company owns",
          "Liabilities": "What company owes",
          "Equity": "Owners' residual claim"
        }
      },
      {
        name: "Current Ratio",
        formula: "Current Ratio = Current Assets / Current Liabilities",
        excelFunction: "=IF(CL=0,\"—\",CA/CL)",
        description: "Measures short-term liquidity",
        variables: {
          "CA": "Current Assets",
          "CL": "Current Liabilities"
        }
      },
      {
        name: "Quick Ratio",
        formula: "Quick Ratio = (Current Assets - Inventory) / Current Liabilities",
        excelFunction: "=(CA-Inventory)/CL",
        description: "More conservative liquidity measure",
        variables: {
          "CA": "Current Assets",
          "CL": "Current Liabilities"
        }
      },
      {
        name: "Debt-to-Equity Ratio",
        formula: "D/E = Total Debt / Total Equity",
        excelFunction: "=Total_Debt/Total_Equity",
        description: "Measures financial leverage",
        variables: {
          "D/E": "Debt-to-Equity Ratio"
        }
      }
    ],

    practiceProblems: [
      {
        id: "fs-1",
        question: "If current assets are $50,000 and current liabilities are $30,000, what is the current ratio?",
        options: ["1.67", "0.60", "1.20", "2.00"],
        correctAnswer: 0,
        explanation: "Current Ratio = $50,000 / $30,000 = 1.67",
        excelSolution: "=50000/30000",
        difficulty: 1,
        timeEstimate: 90
      },
      {
        id: "fs-2",
        question: "A company has total debt of $200,000 and total equity of $100,000. What is the debt-to-equity ratio?",
        options: ["2.0", "0.5", "1.5", "3.0"],
        correctAnswer: 0,
        explanation: "D/E Ratio = $200,000 / $100,000 = 2.0",
        difficulty: 1,
        timeEstimate: 90
      }
    ],

    quickReference: [
      {
        concept: "Balance Sheet Flow",
        rule: "Net Income flows to Retained Earnings (part of Equity)",
        example: "Net Income - Dividends → Retained Earnings increase"
      },
      {
        concept: "Asset Classification",
        rule: "Current assets convert to cash within 1 year",
        example: "Cash, A/R, Inventory = Current; PPE = Long-term"
      },
      {
        concept: "Healthy Ratios",
        rule: "Current Ratio ≥ 1 (but not too high), D/E varies by industry",
        example: "D/E > 2 typically indicates high leverage"
      }
    ]
  },

  "Derivatives": {
    id: "derivatives", 
    title: "Capital Budgeting (NPV & IRR)",
    description: "Master investment decision-making using Net Present Value and Internal Rate of Return analysis for capital allocation.",
    duration: 120,
    difficulty: 'Advanced',

    keyFormulas: [
      {
        name: "Net Present Value",
        formula: "NPV = Σ[CFt/(1+r)ᵗ] - Initial Investment",
        excelFunction: "=NPV(rate,CF1:CFn)+CF0",
        description: "Present value of all cash flows minus initial investment",
        variables: {
          "CFt": "Cash Flow in Period t",
          "r": "Discount Rate (hurdle rate)",
          "t": "Time Period"
        }
      },
      {
        name: "Internal Rate of Return",
        formula: "IRR: Rate where NPV = 0",
        excelFunction: "=IRR(CF0:CFn)",
        description: "Discount rate that makes NPV equal zero",
        variables: {
          "IRR": "Internal Rate of Return"
        }
      }
    ],

    miniModels: [
      {
        name: "NPV & IRR Analysis",
        scenario: "Project: Initial cost $10,000, annual cash flows $4,000 for 3 years, 8% hurdle rate",
        inputs: { CF0: -10000, CF1: 4000, CF2: 4000, CF3: 4000, rate: 0.08 },
        excelFormula: "NPV: =NPV(0.08,4000,4000,4000)-10000 | IRR: =IRR(-10000,4000,4000,4000)",
        result: "NPV: $1,193 | IRR: 13.6%",
        explanation: "Positive NPV and IRR > hurdle rate → Accept project"
      }
    ],

    practiceProblems: [
      {
        id: "cap-1",
        question: "A project requires $15,000 initial investment and generates $7,000 annually for 3 years. At 10% discount rate, what is the NPV?",
        options: ["$2,395", "$1,500", "$3,000", "$500"],
        correctAnswer: 0,
        explanation: "NPV = -$15,000 + $7,000×PVIFA(10%,3) = -$15,000 + $17,395 = $2,395",
        excelSolution: "=NPV(0.10,7000,7000,7000)-15000",
        difficulty: 3,
        timeEstimate: 200
      }
    ],

    quickReference: [
      {
        concept: "Decision Rules",
        rule: "Accept if NPV > 0 and IRR > hurdle rate",
        example: "NPV $1,193 > 0 ✓ and IRR 13.6% > 8% ✓ → Accept"
      },
      {
        concept: "NPV vs IRR",
        rule: "NPV is preferred for mutually exclusive projects",
        example: "NPV considers project scale and reinvestment assumptions"
      }
    ]
  }
};

// Quick reference formulas for exam preparation
export const examQuickReference = {
  excelStealth: [
    "F4: Lock cell references",
    "Alt+A+W+G: Goal Seek", 
    "Ctrl+Shift+%: Format as percentage",
    "Ctrl+Shift+$: Format as currency",
    "Ctrl+1: Format cells dialog"
  ],
  
  rapidFire: [
    "TVM: PV of $5,000 in 7yrs at 7%",
    "Bonds: Price 10yr, 5% coupon, 4% YTM", 
    "Portfolio: σp for 50/50 assets (σ=12%,8%; ρ=0)",
    "Ratios: Quick ratio after selling inventory",
    "NPV/IRR: CF0=-15k; CF1-3=7k each"
  ],

  lastLapChecklist: [
    "Print formula tables and diagrams",
    "Pre-save Excel templates for TVM, bonds, NPV",
    "Bookmark video resources for quick review",
    "Practice speed calculations under time pressure"
  ]
};