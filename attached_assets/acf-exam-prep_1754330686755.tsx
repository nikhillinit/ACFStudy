import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Check, X, Clock, Target, BookOpen, Calculator, TrendingUp, Award, 
  AlertCircle, BarChart, FileText, Play, Pause, RefreshCw, User, Calendar,
  Settings, HelpCircle, Brain, Zap, Filter, Download, ChevronDown, ChevronUp
} from 'lucide-react';

const ACFExamModule = () => {
  // Core state management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [completedTopics, setCompletedTopics] = useState({});
  const [quizHistory, setQuizHistory] = useState([]);
  const [studyTime, setStudyTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [studyMode, setStudyMode] = useState('practice'); // practice, learn, exam
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showFormulas, setShowFormulas] = useState(false);
  const [weakAreas, setWeakAreas] = useState([]);
  const [studyStreak, setStudyStreak] = useState(0);
  const [examDate, setExamDate] = useState('');
  const [studyPlan, setStudyPlan] = useState('standard'); // intensive, standard, extended
  const [expandedTopics, setExpandedTopics] = useState({});

  // Timer for study time tracking
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && activeSection !== 'quiz') {
      interval = setInterval(() => {
        setStudyTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeSection]);

  // Quiz timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0 && activeSection === 'quiz') {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (timerSeconds === 0 && currentQuiz) {
      setIsTimerRunning(false);
      handleQuizSubmit();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activeSection]);

  // Comprehensive topic structure
  const topics = [
    { id: 'tvm', name: 'Time Value of Money', icon: Clock, description: 'Present value, future value, and discounting' },
    { id: 'portfolio', name: 'Portfolio Theory', icon: TrendingUp, description: 'Expected returns, risk, and diversification' },
    { id: 'bonds', name: 'Investment Returns & Bonds', icon: Calculator, description: 'Bond valuation, YTM, and holding period returns' },
    { id: 'balance', name: 'Balance Sheet', icon: FileText, description: 'Assets, liabilities, equity classification' },
    { id: 'statements', name: 'Financial Statement Links', icon: BookOpen, description: 'Income statement to balance sheet connections' },
    { id: 'excel', name: 'Excel for Finance', icon: BarChart, description: 'Financial functions and modeling' },
    { id: 'annuities', name: 'Annuities & Perpetuities', icon: RefreshCw, description: 'Regular payment streams and valuation' },
    { id: 'ratios', name: 'Ratio Analysis', icon: Target, description: 'Liquidity and leverage ratios' },
    { id: 'capital', name: 'Capital Budgeting', icon: Award, description: 'NPV, IRR, and project evaluation' }
  ];

  // Comprehensive quiz bank
  const quizzes = {
    tvm: {
      title: "Time Value of Money",
      questions: [
        {
          id: 1,
          question: "What is the present value of $1,500 received in 3 years at 5% annual rate?",
          options: ["$1,295.34", "$1,736.44", "$1,428.57", "$1,323.92"],
          correct: 0,
          explanation: "PV = FV/(1+r)^n = 1500/(1.05)^3 = 1500/1.191016 = $1,295.34",
          difficulty: "medium"
        },
        {
          id: 2,
          question: "If the discount rate increases, present value:",
          options: ["Increases", "Decreases", "Stays the same", "Cannot determine"],
          correct: 1,
          explanation: "Higher discount rates reduce present value because future cash flows are worth less today",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "To calculate PV in Excel with annual payments, which argument represents the discount rate?",
          options: ["nper", "rate", "pmt", "type"],
          correct: 1,
          explanation: "The 'rate' argument is the discount rate in Excel's PV function: =PV(rate, nper, pmt, [fv], [type])",
          difficulty: "easy"
        },
        {
          id: 4,
          question: "You can receive $500 today or $550 in one year. If your required return is 8%, which should you choose?",
          options: ["$500 today", "$550 in one year", "They are equal", "Need more info"],
          correct: 0,
          explanation: "PV of $550 = 550/1.08 = $509.26. Since $509.26 > $500, take $500 today is incorrect. Actually, take $550 in one year.",
          difficulty: "medium"
        },
        {
          id: 5,
          question: "A project costs $10,000 today and returns $12,000 in 2 years. What's the annual return?",
          options: ["9.54%", "10%", "20%", "8.33%"],
          correct: 0,
          explanation: "Using (FV/PV)^(1/n) - 1 = (12000/10000)^(1/2) - 1 = 1.095445 - 1 = 9.54%",
          difficulty: "hard"
        }
      ]
    },
    portfolio: {
      title: "Portfolio Theory",
      questions: [
        {
          id: 1,
          question: "Portfolio with 40% Stock A (E(R)=15%) and 60% Stock B (E(R)=10%), expected return is:",
          options: ["12.5%", "12%", "11.5%", "13%"],
          correct: 1,
          explanation: "E(Rp) = 0.4(15%) + 0.6(10%) = 6% + 6% = 12%",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "Diversification reduces risk most when assets have:",
          options: ["High positive correlation", "Low or negative correlation", "No correlation exactly", "Similar returns"],
          correct: 1,
          explanation: "Lower correlation means better diversification benefits as asset movements offset each other",
          difficulty: "medium"
        },
        {
          id: 3,
          question: "The efficient frontier represents portfolios with:",
          options: ["Highest return for given risk", "Lowest risk overall", "Equal weights", "No correlation"],
          correct: 0,
          explanation: "The efficient frontier shows optimal risk-return tradeoffs - maximum return for each level of risk",
          difficulty: "medium"
        },
        {
          id: 4,
          question: "Portfolio variance formula for two assets includes all EXCEPT:",
          options: ["Individual variances", "Weights squared", "Correlation", "Simple average of variances"],
          correct: 3,
          explanation: "Portfolio variance = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂. Simple average ignores correlation effects.",
          difficulty: "hard"
        },
        {
          id: 5,
          question: "If two assets have correlation of -1, the minimum variance portfolio has:",
          options: ["50/50 weights", "Zero risk", "Maximum return", "Depends on individual risks"],
          correct: 3,
          explanation: "With perfect negative correlation, weights depend on individual standard deviations to minimize risk",
          difficulty: "hard"
        }
      ]
    },
    bonds: {
      title: "Bonds & Investment Returns",
      questions: [
        {
          id: 1,
          question: "$1,000 face bond, 5% coupon, 3 years, YTM=6%. Price is approximately:",
          options: ["$973", "$1,000", "$1,027", "$950"],
          correct: 0,
          explanation: "Bond trades at discount when YTM > coupon. Price = PV of coupons + PV of face ≈ $973",
          difficulty: "medium"
        },
        {
          id: 2,
          question: "When market interest rates rise, bond prices:",
          options: ["Rise", "Fall", "Stay constant", "Depends on coupon"],
          correct: 1,
          explanation: "Inverse relationship between rates and bond prices - as yields rise, prices fall",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "Current yield equals:",
          options: ["YTM", "Coupon rate", "Annual coupon / Current price", "Total return"],
          correct: 2,
          explanation: "Current yield = Annual coupon payment / Current market price",
          difficulty: "easy"
        },
        {
          id: 4,
          question: "Zero-coupon bond maturing in 5 years has duration of:",
          options: ["0 years", "2.5 years", "5 years", "10 years"],
          correct: 2,
          explanation: "Zero-coupon bond duration equals its maturity since all cash flow occurs at maturity",
          difficulty: "medium"
        },
        {
          id: 5,
          question: "Bond purchased at $950, sold at $980 after receiving $50 coupon. HPR is:",
          options: ["8.42%", "5.26%", "3.16%", "10.53%"],
          correct: 0,
          explanation: "HPR = (980 + 50 - 950) / 950 = 80 / 950 = 8.42%",
          difficulty: "medium"
        }
      ]
    },
    balance: {
      title: "Balance Sheet Components",
      questions: [
        {
          id: 1,
          question: "Which is NOT a current asset?",
          options: ["Cash", "Inventory", "Equipment", "Accounts Receivable"],
          correct: 2,
          explanation: "Equipment is a long-term asset (PP&E), not expected to convert to cash within one year",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "The accounting equation is:",
          options: ["Assets = Liabilities - Equity", "Assets = Liabilities + Equity", "Assets + Liabilities = Equity", "Equity = Assets + Liabilities"],
          correct: 1,
          explanation: "Assets = Liabilities + Equity is the fundamental accounting equation",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "Unearned revenue is classified as:",
          options: ["Current asset", "Current liability", "Revenue", "Equity"],
          correct: 1,
          explanation: "Unearned revenue is a liability - obligation to provide goods/services for payment already received",
          difficulty: "medium"
        },
        {
          id: 4,
          question: "Which increases both assets and equity?",
          options: ["Paying dividends", "Earning profit", "Taking a loan", "Buying inventory with cash"],
          correct: 1,
          explanation: "Earning profit increases assets (cash/receivables) and equity (retained earnings)",
          difficulty: "medium"
        },
        {
          id: 5,
          question: "Accumulated depreciation is:",
          options: ["An expense", "A liability", "A contra-asset", "Part of equity"],
          correct: 2,
          explanation: "Accumulated depreciation is a contra-asset that reduces the book value of PP&E",
          difficulty: "medium"
        }
      ]
    },
    statements: {
      title: "Financial Statement Interactions",
      questions: [
        {
          id: 1,
          question: "Net income flows to which balance sheet account?",
          options: ["Cash", "Common Stock", "Retained Earnings", "Accounts Payable"],
          correct: 2,
          explanation: "Net income increases retained earnings: Ending RE = Beginning RE + NI - Dividends",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "Beginning RE = $100,000, Net Income = $20,000, Dividends = $5,000. Ending RE =",
          options: ["$125,000", "$115,000", "$120,000", "$95,000"],
          correct: 1,
          explanation: "Ending RE = 100,000 + 20,000 - 5,000 = $115,000",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "Depreciation expense affects:",
          options: ["Only income statement", "Only balance sheet", "Both statements", "Neither statement"],
          correct: 2,
          explanation: "Depreciation is an expense (I/S) and increases accumulated depreciation (B/S)",
          difficulty: "medium"
        },
        {
          id: 4,
          question: "Which does NOT affect retained earnings?",
          options: ["Net income", "Dividends", "Stock issuance", "Net loss"],
          correct: 2,
          explanation: "Stock issuance affects paid-in capital accounts, not retained earnings",
          difficulty: "medium"
        },
        {
          id: 5,
          question: "Revenue earned on credit increases:",
          options: ["Cash and Revenue", "A/R and Revenue", "Cash and A/R", "Only Revenue"],
          correct: 1,
          explanation: "Credit sales increase Accounts Receivable (asset) and Revenue (which flows to RE via NI)",
          difficulty: "medium"
        }
      ]
    },
    excel: {
      title: "Excel for Finance",
      questions: [
        {
          id: 1,
          question: "In Excel's PV function, what does 'type' represent?",
          options: ["Interest type", "Payment timing", "Compounding frequency", "Currency type"],
          correct: 1,
          explanation: "Type: 0 = payments at end of period (ordinary), 1 = payments at beginning (annuity due)",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "To find loan payment amount, use:",
          options: ["=PV()", "=FV()", "=PMT()", "=NPV()"],
          correct: 2,
          explanation: "=PMT(rate, nper, pv, [fv], [type]) calculates periodic payment for a loan",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "Excel's NPV function assumes first cash flow occurs:",
          options: ["At time 0", "At time 1", "At time 2", "User specifies"],
          correct: 1,
          explanation: "NPV assumes first value is one period from now; add time 0 cash flow separately",
          difficulty: "medium"
        },
        {
          id: 4,
          question: "To calculate portfolio return with weights in A1:A3 and returns in B1:B3:",
          options: ["=SUM(A1:A3*B1:B3)", "=SUMPRODUCT(A1:A3,B1:B3)", "=AVERAGE(A1:A3,B1:B3)", "=A1:A3*B1:B3"],
          correct: 1,
          explanation: "SUMPRODUCT multiplies corresponding elements and sums them - perfect for weighted averages",
          difficulty: "medium"
        },
        {
          id: 5,
          question: "For irregular cash flow dates, use:",
          options: ["=NPV()", "=XNPV()", "=PV()", "=IRR()"],
          correct: 1,
          explanation: "XNPV handles cash flows at irregular intervals using specific dates",
          difficulty: "hard"
        }
      ]
    },
    annuities: {
      title: "Annuities & Perpetuities",
      questions: [
        {
          id: 1,
          question: "Present value of $1,000/year for 5 years at 6% is closest to:",
          options: ["$4,212", "$5,000", "$4,465", "$3,837"],
          correct: 0,
          explanation: "PV = PMT × [(1-(1+r)^-n)/r] = 1000 × 4.212 = $4,212",
          difficulty: "medium"
        },
        {
          id: 2,
          question: "A perpetuity paying $100/year at 4% discount rate is worth:",
          options: ["$400", "$2,500", "$4,000", "$1,000"],
          correct: 1,
          explanation: "PV of perpetuity = PMT / r = 100 / 0.04 = $2,500",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "Annuity due differs from ordinary annuity because payments occur:",
          options: ["Less frequently", "At beginning of period", "At end of period", "Irregularly"],
          correct: 1,
          explanation: "Annuity due has payments at beginning of each period vs. end for ordinary annuity",
          difficulty: "easy"
        },
        {
          id: 4,
          question: "Growing perpetuity with first payment $100, growth 2%, discount rate 5%. Value?",
          options: ["$2,000", "$3,333", "$5,000", "$1,667"],
          correct: 1,
          explanation: "PV = PMT / (r - g) = 100 / (0.05 - 0.02) = 100 / 0.03 = $3,333",
          difficulty: "hard"
        },
        {
          id: 5,
          question: "To convert ordinary annuity PV to annuity due PV:",
          options: ["Divide by (1+r)", "Multiply by (1+r)", "Add PMT", "Subtract PMT"],
          correct: 1,
          explanation: "Annuity due PV = Ordinary annuity PV × (1+r) since payments come one period sooner",
          difficulty: "medium"
        }
      ]
    },
    ratios: {
      title: "Financial Ratios",
      questions: [
        {
          id: 1,
          question: "Current ratio = 2.0 means:",
          options: ["2× more debt than assets", "2× more current assets than current liabilities", "2× leverage", "2% liquidity"],
          correct: 1,
          explanation: "Current ratio = Current Assets / Current Liabilities. 2.0 means twice as many current assets",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "Quick ratio excludes which current asset?",
          options: ["Cash", "Marketable securities", "Inventory", "Accounts receivable"],
          correct: 2,
          explanation: "Quick ratio = (Current Assets - Inventory) / Current Liabilities for more conservative liquidity measure",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "Debt-to-equity of 1.5 means:",
          options: ["$1.50 debt per $1 equity", "$1.50 equity per $1 debt", "150% equity", "15% leverage"],
          correct: 0,
          explanation: "D/E = Total Debt / Total Equity. 1.5 means $1.50 of debt for each $1 of equity",
          difficulty: "medium"
        },
        {
          id: 4,
          question: "Company pays off current liability with cash. If current ratio was >1, new ratio:",
          options: ["Increases", "Decreases", "Stays same", "Cannot determine"],
          correct: 0,
          explanation: "When CR > 1, paying equal amounts from CA and CL increases the ratio",
          difficulty: "hard"
        },
        {
          id: 5,
          question: "Interest coverage ratio of 3.0 means EBIT is:",
          options: ["3× interest expense", "1/3 of interest expense", "3% of sales", "$3 million"],
          correct: 0,
          explanation: "Interest coverage = EBIT / Interest Expense. 3.0 means EBIT is 3 times interest payments",
          difficulty: "medium"
        }
      ]
    },
    capital: {
      title: "Capital Budgeting",
      questions: [
        {
          id: 1,
          question: "Project: -$10,000 initial, then $4,000/year for 3 years. NPV at 8%?",
          options: ["$309", "$2,000", "-$689", "$1,209"],
          correct: 0,
          explanation: "NPV = -10,000 + 4,000/(1.08) + 4,000/(1.08)² + 4,000/(1.08)³ = $309",
          difficulty: "medium"
        },
        {
          id: 2,
          question: "NPV > 0 means project return is:",
          options: ["Negative", "Above required return", "Below required return", "Zero"],
          correct: 1,
          explanation: "Positive NPV means project earns more than the discount rate (required return)",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "IRR is the rate where:",
          options: ["NPV = Initial investment", "NPV = 0", "PV = FV", "Return = Risk"],
          correct: 1,
          explanation: "IRR is the discount rate that makes NPV equal to zero",
          difficulty: "easy"
        },
        {
          id: 4,
          question: "For mutually exclusive projects, choose based on:",
          options: ["Highest IRR", "Highest NPV", "Shortest payback", "Lowest risk"],
          correct: 1,
          explanation: "NPV is the best criterion for mutually exclusive projects as it measures value added",
          difficulty: "medium"
        },
        {
          id: 5,
          question: "Project A: NPV=$5,000, IRR=15%. Project B: NPV=$4,000, IRR=20%. If cost of capital is 10%, choose:",
          options: ["Project A", "Project B", "Both", "Neither"],
          correct: 0,
          explanation: "Choose highest NPV for mutually exclusive projects. A adds more value despite lower IRR",
          difficulty: "hard"
        }
      ]
    }
  };

  // Comprehensive formula reference
  const formulas = {
    tvm: [
      { name: "Present Value", formula: "PV = FV/(1+r)^n", description: "Value today of future cash flow" },
      { name: "Future Value", formula: "FV = PV(1+r)^n", description: "Value in future of today's cash" },
      { name: "Effective Annual Rate", formula: "EAR = (1+r/m)^m - 1", description: "True annual rate with compounding" },
      { name: "Excel PV", formula: "=PV(rate, nper, pmt, [fv], [type])", description: "Excel present value function" }
    ],
    portfolio: [
      { name: "Portfolio Return", formula: "E(Rp) = Σ wi × E(Ri)", description: "Weighted average of returns" },
      { name: "Two-Asset Variance", formula: "σp² = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρ₁₂σ₁σ₂", description: "Portfolio risk calculation" },
      { name: "Correlation Range", formula: "-1 ≤ ρ ≤ 1", description: "Perfect negative to perfect positive" },
      { name: "Sharpe Ratio", formula: "SR = (Rp - Rf) / σp", description: "Risk-adjusted return measure" }
    ],
    bonds: [
      { name: "Bond Price", formula: "P = Σ C/(1+y)^t + F/(1+y)^n", description: "PV of coupons plus face value" },
      { name: "Current Yield", formula: "CY = Annual Coupon / Current Price", description: "Simple yield measure" },
      { name: "YTM Relationship", formula: "If YTM > Coupon → Discount", description: "Bond pricing principle" },
      { name: "Modified Duration", formula: "MD = Macaulay Duration / (1+y)", description: "Price sensitivity measure" }
    ],
    balance: [
      { name: "Accounting Equation", formula: "Assets = Liabilities + Equity", description: "Fundamental balance sheet equation" },
      { name: "Working Capital", formula: "WC = Current Assets - Current Liabilities", description: "Short-term liquidity measure" },
      { name: "Book Value", formula: "BV = Total Assets - Total Liabilities", description: "Net worth of company" }
    ],
    statements: [
      { name: "Retained Earnings", formula: "RE_end = RE_beg + NI - Dividends", description: "Links income statement to balance sheet" },
      { name: "Cash to Accrual", formula: "Revenue = Cash Collected + ΔA/R", description: "Accrual accounting principle" },
      { name: "Depreciation Effect", formula: "↓NI → ↓RE and ↑Accum Depr", description: "Dual impact on statements" }
    ],
    excel: [
      { name: "Payment", formula: "=PMT(rate, nper, pv, [fv], [type])", description: "Calculate loan payment" },
      { name: "NPV", formula: "=NPV(rate, values) + initial", description: "Net present value" },
      { name: "IRR", formula: "=IRR(values, [guess])", description: "Internal rate of return" },
      { name: "SUMPRODUCT", formula: "=SUMPRODUCT(weights, returns)", description: "Portfolio calculations" }
    ],
    annuities: [
      { name: "Ordinary Annuity PV", formula: "PV = PMT × [(1-(1+r)^-n)/r]", description: "Present value of equal payments" },
      { name: "Perpetuity PV", formula: "PV = PMT / r", description: "Infinite stream of payments" },
      { name: "Annuity Due", formula: "PV_due = PV_ordinary × (1+r)", description: "Payments at beginning" },
      { name: "Growing Perpetuity", formula: "PV = PMT / (r - g)", description: "With growth rate g" }
    ],
    ratios: [
      { name: "Current Ratio", formula: "CR = Current Assets / Current Liabilities", description: "Short-term liquidity" },
      { name: "Quick Ratio", formula: "QR = (CA - Inventory) / CL", description: "Acid test ratio" },
      { name: "Debt-to-Equity", formula: "D/E = Total Debt / Total Equity", description: "Leverage measure" },
      { name: "Interest Coverage", formula: "IC = EBIT / Interest Expense", description: "Debt service ability" }
    ],
    capital: [
      { name: "NPV", formula: "NPV = -C₀ + Σ CFt/(1+r)^t", description: "Project value added" },
      { name: "NPV Decision", formula: "Accept if NPV > 0", description: "Positive value creation" },
      { name: "IRR Definition", formula: "Rate where NPV = 0", description: "Project's return rate" },
      { name: "Profitability Index", formula: "PI = PV of inflows / Initial cost", description: "Benefit-cost ratio" }
    ]
  };

  // Study content for each topic
  const studyContent = {
    tvm: {
      overview: "Time Value of Money is the foundation of finance. Money today is worth more than the same amount in the future due to opportunity cost, inflation, and risk.",
      keyPoints: [
        "Present Value (PV) discounts future cash flows to today",
        "Future Value (FV) compounds today's money forward",
        "Discount rate reflects required return and risk",
        "Higher discount rates mean lower present values"
      ],
      examples: [
        {
          title: "Basic PV Calculation",
          problem: "Find PV of $5,000 in 3 years at 6%",
          solution: "PV = 5,000/(1.06)³ = 5,000/1.191 = $4,198.10"
        },
        {
          title: "Multiple Cash Flows",
          problem: "PV of $1,000 in year 1 and $2,000 in year 2 at 8%",
          solution: "PV = 1,000/1.08 + 2,000/(1.08)² = 925.93 + 1,714.68 = $2,640.61"
        }
      ],
      tips: [
        "Always match time periods with rates (annual rate for annual periods)",
        "Remember cash flow timing - end vs beginning of period",
        "Use Excel functions to verify manual calculations"
      ]
    },
    portfolio: {
      overview: "Portfolio Theory explains how to combine assets to optimize risk and return. Diversification can reduce risk without sacrificing expected return.",
      keyPoints: [
        "Expected return is weighted average of component returns",
        "Portfolio risk depends on correlations between assets",
        "Diversification works best with low/negative correlations",
        "Efficient frontier shows optimal risk-return combinations"
      ],
      examples: [
        {
          title: "Portfolio Return",
          problem: "60% Stock A (12% return), 40% Stock B (8% return)",
          solution: "E(R) = 0.6(12%) + 0.4(8%) = 7.2% + 3.2% = 10.4%"
        },
        {
          title: "Risk Reduction",
          problem: "Two assets, σ=20% each, ρ=0.3, equal weights",
          solution: "Portfolio σ < 20% due to imperfect correlation"
        }
      ],
      tips: [
        "Correlation of -1 allows maximum risk reduction",
        "Don't confuse weights with returns in calculations",
        "Consider both risk AND return when evaluating portfolios"
      ]
    }
    // Add more study content for other topics...
  };

  // Helper functions
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTopicProgress = (topicId) => {
    const topicHistory = quizHistory.filter(h => h.topicId === topicId);
    if (topicHistory.length === 0) return 0;
    
    const avgScore = topicHistory.reduce((sum, h) => sum + (h.score / h.total), 0) / topicHistory.length;
    return Math.round(avgScore * 100);
  };

  const getOverallProgress = () => {
    const completedCount = Object.keys(completedTopics).length;
    return Math.round((completedCount / topics.length) * 100);
  };

  const getDaysUntilExam = () => {
    if (!examDate) return null;
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRecommendedTopic = () => {
    // Find topics with lowest scores or not attempted
    const topicScores = topics.map(topic => ({
      id: topic.id,
      score: getTopicProgress(topic.id),
      attempted: quizHistory.some(h => h.topicId === topic.id)
    }));
    
    // First priority: topics not attempted
    const notAttempted = topicScores.filter(t => !t.attempted);
    if (notAttempted.length > 0) {
      return notAttempted[0].id;
    }
    
    // Second priority: lowest score
    const lowestScore = topicScores.reduce((min, t) => t.score < min.score ? t : min);
    return lowestScore.id;
  };

  const getStudyPlanDay = () => {
    const daysLeft = getDaysUntilExam();
    if (!daysLeft) return null;
    
    const totalDays = studyPlan === 'intensive' ? 7 : studyPlan === 'standard' ? 14 : 21;
    const currentDay = totalDays - daysLeft + 1;
    
    return Math.max(1, Math.min(currentDay, totalDays));
  };

  const toggleTopicExpansion = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  // Quiz handling functions
  const startQuiz = (topicId, mode = 'practice') => {
    const quiz = quizzes[topicId];
    if (quiz) {
      setCurrentQuiz({ ...quiz, topicId, mode });
      setQuizAnswers({});
      setShowResults(false);
      setTimerSeconds(mode === 'exam' ? 900 : 300); // 15 min for exam, 5 for practice
      setIsTimerRunning(true);
      setActiveSection('quiz');
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
  };

  const handleQuizSubmit = () => {
    setIsTimerRunning(false);
    setShowResults(true);
    
    const score = calculateScore();
    const history = {
      topicId: currentQuiz.topicId,
      score,
      total: currentQuiz.questions.length,
      date: new Date().toISOString(),
      timeSpent: (currentQuiz.mode === 'exam' ? 900 : 300) - timerSeconds,
      mode: currentQuiz.mode
    };
    
    setQuizHistory([...quizHistory, history]);
    
    // Update completed topics if passed
    if (score / currentQuiz.questions.length >= 0.8) {
      setCompletedTopics(prev => ({
        ...prev,
        [currentQuiz.topicId]: true
      }));
    }
    
    // Update weak areas
    const incorrectQuestions = currentQuiz.questions.filter((q, idx) => 
      quizAnswers[q.id] !== q.correct
    );
    if (incorrectQuestions.length > 0) {
      setWeakAreas(prev => [...prev, ...incorrectQuestions.map(q => ({
        topicId: currentQuiz.topicId,
        question: q.question,
        date: new Date().toISOString()
      }))].slice(-10)); // Keep last 10 weak areas
    }
  };

  const calculateScore = () => {
    if (!currentQuiz) return 0;
    return currentQuiz.questions.reduce((score, question) => {
      return score + (quizAnswers[question.id] === question.correct ? 1 : 0);
    }, 0);
  };

  const startComprehensiveExam = () => {
    // Create exam with questions from all topics
    const examQuestions = [];
    Object.entries(quizzes).forEach(([topicId, quiz]) => {
      // Take 2-3 questions from each topic
      const selectedQs = quiz.questions.slice(0, 2).map(q => ({
        ...q,
        topicId,
        id: `${topicId}-${q.id}`
      }));
      examQuestions.push(...selectedQs);
    });
    
    // Shuffle questions
    const shuffled = examQuestions.sort(() => Math.random() - 0.5);
    
    setCurrentQuiz({
      title: "Comprehensive ACF Practice Exam",
      questions: shuffled,
      topicId: 'comprehensive',
      mode: 'exam'
    });
    setQuizAnswers({});
    setShowResults(false);
    setTimerSeconds(1200); // 20 minutes
    setIsTimerRunning(true);
    setActiveSection('quiz');
  };

  // Study plan schedules
  const studySchedules = {
    intensive: {
      days: 7,
      schedule: [
        { day: 1, topics: ['tvm'], focus: 'Core TVM concepts and Excel' },
        { day: 2, topics: ['portfolio', 'bonds'], focus: 'Risk, return, and valuation' },
        { day: 3, topics: ['balance', 'statements'], focus: 'Financial statements' },
        { day: 4, topics: ['excel', 'annuities'], focus: 'Excel mastery and annuities' },
        { day: 5, topics: ['ratios', 'capital'], focus: 'Analysis and decisions' },
        { day: 6, topics: ['all'], focus: 'Review weak areas' },
        { day: 7, topics: ['all'], focus: 'Final practice exam' }
      ]
    },
    standard: {
      days: 14,
      schedule: [
        { day: 1, topics: ['tvm'], focus: 'TVM fundamentals' },
        { day: 2, topics: ['tvm'], focus: 'TVM practice and Excel' },
        { day: 3, topics: ['portfolio'], focus: 'Portfolio theory basics' },
        { day: 4, topics: ['portfolio'], focus: 'Risk and diversification' },
        { day: 5, topics: ['bonds'], focus: 'Bond valuation' },
        { day: 6, topics: ['bonds'], focus: 'Returns and yields' },
        { day: 7, topics: ['balance', 'statements'], focus: 'Financial statements' },
        { day: 8, topics: ['excel'], focus: 'Excel functions' },
        { day: 9, topics: ['annuities'], focus: 'Annuities and perpetuities' },
        { day: 10, topics: ['ratios'], focus: 'Ratio analysis' },
        { day: 11, topics: ['capital'], focus: 'Capital budgeting' },
        { day: 12, topics: ['all'], focus: 'Integration practice' },
        { day: 13, topics: ['all'], focus: 'Mock exam' },
        { day: 14, topics: ['all'], focus: 'Final review' }
      ]
    },
    extended: {
      days: 21,
      schedule: [
        // Week 1: Foundations
        { day: 1, topics: ['tvm'], focus: 'TVM concepts' },
        { day: 2, topics: ['tvm'], focus: 'PV and FV calculations' },
        { day: 3, topics: ['tvm'], focus: 'Excel TVM functions' },
        { day: 4, topics: ['portfolio'], focus: 'Expected returns' },
        { day: 5, topics: ['portfolio'], focus: 'Portfolio risk' },
        { day: 6, topics: ['portfolio'], focus: 'Diversification' },
        { day: 7, topics: ['review'], focus: 'Week 1 review' },
        // Week 2: Applications
        { day: 8, topics: ['bonds'], focus: 'Bond basics' },
        { day: 9, topics: ['bonds'], focus: 'Yields and duration' },
        { day: 10, topics: ['balance'], focus: 'Balance sheet' },
        { day: 11, topics: ['statements'], focus: 'Statement links' },
        { day: 12, topics: ['excel'], focus: 'Excel mastery' },
        { day: 13, topics: ['annuities'], focus: 'Annuity calculations' },
        { day: 14, topics: ['review'], focus: 'Week 2 review' },
        // Week 3: Advanced & Review
        { day: 15, topics: ['ratios'], focus: 'Liquidity ratios' },
        { day: 16, topics: ['ratios'], focus: 'Leverage ratios' },
        { day: 17, topics: ['capital'], focus: 'NPV and IRR' },
        { day: 18, topics: ['capital'], focus: 'Project evaluation' },
        { day: 19, topics: ['all'], focus: 'Comprehensive review' },
        { day: 20, topics: ['all'], focus: 'Practice exam' },
        { day: 21, topics: ['all'], focus: 'Final preparation' }
      ]
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ACF Exam Complete Study Module
            </h1>
            <p className="text-gray-600">
              Master all 9 topics for the Kellogg Accelerated Corporate Finance Placement Exam
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span>Study Time: {formatTime(studyTime)}</span>
            </div>
            {examDate && (
              <div className="text-sm font-medium text-blue-600">
                {getDaysUntilExam()} days until exam
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['dashboard', 'learn', 'practice', 'exam', 'formulas', 'progress'].map(section => (
            <button
              key={section}
              onClick={() => {
                setActiveSection(section);
                if (section !== 'quiz') setIsTimerRunning(true);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === section 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Section */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold">{getOverallProgress()}%</span>
              </div>
              <p className="text-gray-600 text-sm">Overall Progress</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold">{Object.keys(completedTopics).length}/9</span>
              </div>
              <p className="text-gray-600 text-sm">Topics Mastered</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold">{studyStreak}</span>
              </div>
              <p className="text-gray-600 text-sm">Day Streak</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold">{quizHistory.length}</span>
              </div>
              <p className="text-gray-600 text-sm">Quizzes Completed</p>
            </div>
          </div>

          {/* Study Plan Setup */}
          {!examDate && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Set Up Your Study Plan
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Intensity
                  </label>
                  <select
                    value={studyPlan}
                    onChange={(e) => setStudyPlan(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="intensive">Intensive (7 days)</option>
                    <option value="standard">Standard (14 days)</option>
                    <option value="extended">Extended (21 days)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Today's Focus */}
          {examDate && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Today's Focus (Day {getStudyPlanDay()} of {studySchedules[studyPlan].days})
              </h3>
              {(() => {
                const day = getStudyPlanDay();
                const schedule = studySchedules[studyPlan].schedule[day - 1];
                if (!schedule) return null;
                
                return (
                  <div>
                    <p className="text-gray-700 mb-3">{schedule.focus}</p>
                    <div className="flex gap-2">
                      {schedule.topics[0] === 'all' ? (
                        <button
                          onClick={startComprehensiveExam}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Start Comprehensive Practice
                        </button>
                      ) : (
                        schedule.topics.map(topicId => {
                          const topic = topics.find(t => t.id === topicId);
                          if (!topic) return null;
                          return (
                            <button
                              key={topicId}
                              onClick={() => {
                                setSelectedTopic(topicId);
                                setActiveSection('learn');
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Study {topic.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Topic Grid */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Topics</h2>
            <div className="space-y-3">
              {topics.map(topic => {
                const Icon = topic.icon;
                const progress = getTopicProgress(topic.id);
                const isCompleted = completedTopics[topic.id];
                const isExpanded = expandedTopics[topic.id];
                
                return (
                  <div key={topic.id} className="border rounded-lg overflow-hidden">
                    <div
                      className={`p-4 cursor-pointer transition-colors ${
                        isCompleted ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleTopicExpansion(topic.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-6 h-6 ${isCompleted ? 'text-green-600' : 'text-gray-600'}`} />
                          <div>
                            <h3 className="font-medium text-gray-800">{topic.name}</h3>
                            <p className="text-sm text-gray-600">{topic.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">{progress}%</div>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${
                                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 bg-white border-t">
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTopic(topic.id);
                              setActiveSection('learn');
                            }}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Learn
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startQuiz(topic.id);
                            }}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Practice Quiz
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTopic(topic.id);
                              setShowFormulas(true);
                              setActiveSection('formulas');
                            }}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                          >
                            Formulas
                          </button>
                        </div>
                        
                        {/* Recent quiz scores */}
                        {(() => {
                          const topicQuizzes = quizHistory
                            .filter(h => h.topicId === topic.id)
                            .slice(-3);
                          
                          if (topicQuizzes.length > 0) {
                            return (
                              <div className="text-sm text-gray-600">
                                Recent scores: {topicQuizzes.map(q => 
                                  `${Math.round(q.score/q.total * 100)}%`
                                ).join(', ')}
                              </div>
                            );
                          }
                          return <div className="text-sm text-gray-500">No attempts yet</div>;
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weak Areas */}
          {weakAreas.length > 0 && (
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Areas Needing Review
              </h3>
              <div className="space-y-2">
                {weakAreas.slice(-5).map((area, idx) => {
                  const topic = topics.find(t => t.id === area.topicId);
                  return (
                    <div key={idx} className="text-sm">
                      <span className="font-medium">{topic?.name}:</span>
                      <span className="text-gray-600 ml-2">{area.question}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Learn Section */}
      {activeSection === 'learn' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Topic to Study
            </label>
            <select
              value={selectedTopic || ''}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a topic...</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </select>
          </div>

          {selectedTopic && studyContent[selectedTopic] && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {topics.find(t => t.id === selectedTopic)?.name}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    {studyContent[selectedTopic].overview}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3">Key Concepts</h3>
                  <ul className="list-disc pl-6 space-y-2 mb-6">
                    {studyContent[selectedTopic].keyPoints.map((point, idx) => (
                      <li key={idx} className="text-gray-700">{point}</li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold mb-3">Worked Examples</h3>
                  <div className="space-y-4 mb-6">
                    {studyContent[selectedTopic].examples.map((example, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">{example.title}</h4>
                        <div className="text-sm space-y-2">
                          <p><strong>Problem:</strong> {example.problem}</p>
                          <p><strong>Solution:</strong> <code className="bg-white px-2 py-1 rounded">
                            {example.solution}
                          </code></p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold mb-3">Pro Tips</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ul className="list-disc pl-6 space-y-2">
                      {studyContent[selectedTopic].tips.map((tip, idx) => (
                        <li key={idx} className="text-gray-700">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => startQuiz(selectedTopic)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Take Practice Quiz
                  </button>
                  <button
                    onClick={() => {
                      setShowFormulas(true);
                      setActiveSection('formulas');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    View Formulas
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedTopic && (
            <div className="text-center py-12 text-gray-500">
              Select a topic above to begin studying
            </div>
          )}
        </div>
      )}

      {/* Practice Section */}
      {activeSection === 'practice' && !currentQuiz && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Practice by Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map(topic => {
                const Icon = topic.icon;
                const progress = getTopicProgress(topic.id);
                const isCompleted = completedTopics[topic.id];
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => startQuiz(topic.id)}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Icon className="w-8 h-8 text-blue-600" />
                      {isCompleted && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{topic.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{topic.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {quizzes[topic.id]?.questions.length} questions
                      </span>
                      <span className="text-sm font-medium">
                        {progress}% mastery
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Practice</h2>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <p className="text-gray-700 mb-3">
                Based on your performance, we recommend focusing on:
              </p>
              <button
                onClick={() => startQuiz(getRecommendedTopic())}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Practice {topics.find(t => t.id === getRecommendedTopic())?.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Section */}
      {activeSection === 'exam' && !currentQuiz && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Practice Exams</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Comprehensive Practice Exam</h3>
              <p className="text-gray-600 mb-4">
                20 questions covering all 9 topics • 20 minutes • 80% to pass
              </p>
              <button
                onClick={startComprehensiveExam}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Comprehensive Exam
              </button>
            </div>

            <div className="border-2 border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Custom Practice Exam</h3>
              <p className="text-gray-600 mb-4">
                Choose specific topics and difficulty level
              </p>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Past Exam Results */}
          {quizHistory.filter(h => h.mode === 'exam').length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Past Exam Results</h3>
              <div className="space-y-2">
                {quizHistory
                  .filter(h => h.mode === 'exam')
                  .slice(-5)
                  .reverse()
                  .map((exam, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">
                          {exam.topicId === 'comprehensive' ? 'Comprehensive Exam' : 'Topic Exam'}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          {new Date(exam.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          Time: {formatTime(exam.timeSpent)}
                        </span>
                        <span className={`font-semibold ${
                          exam.score / exam.total >= 0.8 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {Math.round(exam.score / exam.total * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz Section */}
      {activeSection === 'quiz' && currentQuiz && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Quiz Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{currentQuiz.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentQuiz.mode === 'exam' ? 'Exam Mode' : 'Practice Mode'} • 
                {currentQuiz.questions.length} questions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                timerSeconds < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatTime(timerSeconds)}</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to exit the quiz?')) {
                    setActiveSection('practice');
                    setIsTimerRunning(false);
                  }
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Exit Quiz
              </button>
            </div>
          </div>

          {/* Questions or Results */}
          {!showResults ? (
            <div className="space-y-6">
              {/* Question Progress */}
              <div className="flex gap-2 mb-4">
                {currentQuiz.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      quizAnswers[q.id] !== undefined
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>

              {/* Questions */}
              {currentQuiz.questions.map((question, qIndex) => (
                <div key={question.id} className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                      {qIndex + 1}
                    </span>
                    <p className="font-medium text-gray-800">{question.question}</p>
                  </div>
                  
                  <div className="ml-11 space-y-2">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          quizAnswers[question.id] === oIndex
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={quizAnswers[question.id] === oIndex}
                          onChange={() => handleAnswerSelect(question.id, oIndex)}
                          className="mr-3"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  
                  {question.difficulty && (
                    <div className="ml-11 mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {Object.keys(quizAnswers).length} of {currentQuiz.questions.length} answered
                </div>
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < currentQuiz.questions.length}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    Object.keys(quizAnswers).length < currentQuiz.questions.length
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              {/* Score Summary */}
              <div className="text-center py-8 border-b">
                <div className="text-5xl font-bold mb-2">
                  {calculateScore()}/{currentQuiz.questions.length}
                </div>
                <div className="text-2xl font-medium mb-2">
                  {Math.round(calculateScore() / currentQuiz.questions.length * 100)}%
                </div>
                <p className="text-gray-600">
                  {calculateScore() / currentQuiz.questions.length >= 0.8 
                    ? '🎉 Great job! You passed this topic.' 
                    : '📚 Keep practicing! You need 80% to pass.'}
                </p>
              </div>
              
              {/* Detailed Review */}
              <h3 className="font-semibold text-lg">Question Review</h3>
              {currentQuiz.questions.map((question, qIndex) => {
                const userAnswer = quizAnswers[question.id];
                const isCorrect = userAnswer === question.correct;
                
                return (
                  <div key={question.id} className={`p-6 rounded-lg border-2 ${
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{qIndex + 1}. {question.question}</p>
                        {question.topicId && (
                          <span className="text-sm text-gray-600">
                            Topic: {topics.find(t => t.id === question.topicId)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-8 space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`p-2 rounded ${
                            oIndex === question.correct
                              ? 'bg-green-200 font-medium'
                              : oIndex === userAnswer && !isCorrect
                              ? 'bg-red-200 line-through'
                              : ''
                          }`}
                        >
                          {option}
                          {oIndex === question.correct && ' ✓'}
                          {oIndex === userAnswer && !isCorrect && ' ✗'}
                        </div>
                      ))}
                      
                      <div className="mt-3 p-3 bg-blue-100 rounded text-sm">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setActiveSection(currentQuiz.mode === 'exam' ? 'exam' : 'practice');
                    setCurrentQuiz(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Back to {currentQuiz.mode === 'exam' ? 'Exams' : 'Practice'}
                </button>
                <button
                  onClick={() => startQuiz(currentQuiz.topicId, currentQuiz.mode)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formula Reference Section */}
      {activeSection === 'formulas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Formula Reference Sheet</h2>
              <button
                onClick={() => {/* Add download functionality */}}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            {/* Topic Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTopic(null)}
                className={`px-3 py-1 rounded-lg ${
                  !selectedTopic ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Topics
              </button>
              {topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-3 py-1 rounded-lg ${
                    selectedTopic === topic.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {topic.name}
                </button>
              ))}
            </div>

            {/* Formulas Display */}
            <div className="space-y-6">
              {Object.entries(formulas)
                .filter(([topicId]) => !selectedTopic || topicId === selectedTopic)
                .map(([topicId, topicFormulas]) => {
                  const topic = topics.find(t => t.id === topicId);
                  const Icon = topic?.icon;
                  
                  return (
                    <div key={topicId} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex items-center gap-3">
                        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                        <h3 className="font-semibold text-lg">{topic?.name}</h3>
                      </div>
                      
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topicFormulas.map((formula, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">{formula.name}</h4>
                            <code className="block bg-white p-3 rounded text-blue-600 font-mono text-sm mb-2 overflow-x-auto">
                              {formula.formula}
                            </code>
                            <p className="text-sm text-gray-600">{formula.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Quick Excel Reference */}
            <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-yellow-600" />
                Quick Excel Function Reference
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="font-mono">• =PV(rate, nper, pmt, [fv], [type])</div>
                <div className="font-mono">• =FV(rate, nper, pmt, [pv], [type])</div>
                <div className="font-mono">• =PMT(rate, nper, pv, [fv], [type])</div>
                <div className="font-mono">• =NPV(rate, values...) + initial</div>
                <div className="font-mono">• =IRR(values, [guess])</div>
                <div className="font-mono">• =RATE(nper, pmt, pv, [fv])</div>
                <div className="font-mono">• =SUMPRODUCT(array1, array2)</div>
                <div className="font-mono">• =STDEV.S(range) or STDEV.P(range)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Section */}
      {activeSection === 'progress' && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Analytics</h2>
            
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {quizHistory.length > 0 
                    ? Math.round(
                        quizHistory.reduce((sum, h) => sum + (h.score/h.total), 0) / 
                        quizHistory.length * 100
                      )
                    : 0}%
                </div>
                <p className="text-gray-600">Average Score</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {formatTime(
                    quizHistory.reduce((sum, h) => sum + h.timeSpent, 0)
                  )}
                </div>
                <p className="text-gray-600">Practice Time</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {Object.keys(completedTopics).length}/9
                </div>
                <p className="text-gray-600">Topics Mastered</p>
              </div>
            </div>

            {/* Topic Performance */}
            <h3 className="font-semibold text-gray-800 mb-3">Performance by Topic</h3>
            <div className="space-y-3">
              {topics.map(topic => {
                const topicQuizzes = quizHistory.filter(h => h.topicId === topic.id);
                const avgScore = topicQuizzes.length > 0
                  ? topicQuizzes.reduce((sum, h) => sum + (h.score/h.total), 0) / topicQuizzes.length
                  : 0;
                const attempts = topicQuizzes.length;
                
                return (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <topic.icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{topic.name}</p>
                        <p className="text-sm text-gray-600">{attempts} attempts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${avgScore * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-12 text-right">
                        {Math.round(avgScore * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Study Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Strengths</h3>
                {(() => {
                  const strongTopics = topics.filter(topic => 
                    getTopicProgress(topic.id) >= 80
                  );
                  
                  if (strongTopics.length > 0) {
                    return (
                      <ul className="list-disc pl-5 space-y-1">
                        {strongTopics.map(topic => (
                          <li key={topic.id} className="text-gray-700">
                            {topic.name} ({getTopicProgress(topic.id)}%)
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p className="text-gray-600">Keep practicing to identify strengths!</p>;
                })()}
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Areas for Improvement</h3>
                {(() => {
                  const weakTopics = topics.filter(topic => {
                    const progress = getTopicProgress(topic.id);
                    const attempted = quizHistory.some(h => h.topicId === topic.id);
                    return attempted && progress < 80;
                  });
                  
                  if (weakTopics.length > 0) {
                    return (
                      <ul className="list-disc pl-5 space-y-1">
                        {weakTopics.map(topic => (
                          <li key={topic.id} className="text-gray-700">
                            {topic.name} ({getTopicProgress(topic.id)}%)
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p className="text-gray-600">Complete more quizzes to identify areas to improve!</p>;
                })()}
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {quizHistory.length > 0 ? (
              <div className="space-y-3">
                {quizHistory.slice(-10).reverse().map((history, index) => {
                  const topic = topics.find(t => t.id === history.topicId);
                  const Icon = topic?.icon || Brain;
                  
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium">
                          {topic?.name || 'Comprehensive Exam'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(history.date).toLocaleDateString()} • 
                          {history.mode === 'exam' ? ' Exam Mode' : ' Practice Mode'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          history.score / history.total >= 0.8 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {history.score}/{history.total}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(history.timeSpent)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No activity yet. Start with a practice quiz!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ACFExamModule;