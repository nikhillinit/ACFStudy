// Expanded Question Bank - 50+ questions per topic with enhanced features
export const expandedQuestionBank: { [topicId: string]: EnhancedQuestion[] } = {
  tvm: [
    // Easy Questions (15)
    {
      id: 'tvm_1',
      question: "What is the present value of $1,500 received in 3 years at 5% annual rate?",
      options: ["$1,295.34", "$1,736.44", "$1,428.57", "$1,323.92"],
      correct: 0,
      explanation: "PV = FV/(1+r)^n = 1500/(1.05)^3 = 1500/1.157625 = $1,295.34",
      difficulty: 'easy',
      concepts: ['Present Value', 'Discount Rate', 'Time Periods'],
      hints: [
        "Use the present value formula: PV = FV/(1+r)^n",
        "FV = $1,500, r = 5% = 0.05, n = 3 years",
        "Calculate (1.05)^3 first, then divide"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Identify the variables",
          explanation: "FV = $1,500 (future value), r = 5% = 0.05 (discount rate), n = 3 (years)"
        },
        {
          step: 2,
          description: "Apply the PV formula",
          formula: "PV = FV / (1 + r)^n",
          calculation: "PV = 1,500 / (1 + 0.05)^3",
          explanation: "We divide the future value by the compound factor"
        },
        {
          step: 3,
          description: "Calculate the compound factor",
          calculation: "(1.05)^3 = 1.157625",
          explanation: "This represents how much $1 grows to in 3 years at 5%"
        },
        {
          step: 4,
          description: "Complete the calculation",
          calculation: "PV = 1,500 / 1.157625 = $1,295.34",
          explanation: "This is how much you need today to have $1,500 in 3 years",
          tip: "Always round financial calculations to 2 decimal places"
        }
      ],
      commonMistakes: [
        "Using simple interest instead of compound interest",
        "Multiplying instead of dividing by the compound factor",
        "Forgetting to convert percentage to decimal"
      ],
      estimatedTime: 90,
      prerequisites: [],
      relatedQuestions: ['tvm_2', 'tvm_15', 'tvm_25']
    },
    {
      id: 'tvm_2',
      question: "If the discount rate increases, present value:",
      options: ["Increases", "Decreases", "Stays the same", "Cannot determine"],
      correct: 1,
      explanation: "Higher discount rates reduce present value because future cash flows are worth less today",
      difficulty: 'easy',
      concepts: ['Present Value', 'Discount Rate'],
      hints: [
        "Think about the PV formula: PV = FV/(1+r)^n",
        "What happens to the denominator when r increases?",
        "If denominator increases, what happens to the result?"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Understand the relationship",
          formula: "PV = FV / (1 + r)^n",
          explanation: "Present value is inversely related to the discount rate"
        },
        {
          step: 2,
          description: "Analyze the effect",
          explanation: "As r increases, (1+r)^n increases, making the denominator larger",
          tip: "Larger denominator means smaller result"
        }
      ],
      commonMistakes: [
        "Confusing discount rate with interest earned",
        "Not understanding inverse relationships"
      ],
      estimatedTime: 60,
      prerequisites: [],
      relatedQuestions: ['tvm_1', 'tvm_3']
    },
    {
      id: 'tvm_3',
      question: "You invest $1,000 today at 6% annual interest. How much will you have in 2 years?",
      options: ["$1,123.60", "$1,120.00", "$1,060.00", "$1,100.00"],
      correct: 0,
      explanation: "FV = PV(1+r)^n = 1000(1.06)^2 = 1000(1.1236) = $1,123.60",
      difficulty: 'easy',
      concepts: ['Future Value', 'Compounding'],
      hints: [
        "Use the future value formula: FV = PV(1+r)^n",
        "Remember to use compound interest, not simple",
        "Square 1.06 to get the compound factor"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Identify variables",
          explanation: "PV = $1,000, r = 6% = 0.06, n = 2 years"
        },
        {
          step: 2,
          description: "Apply FV formula",
          formula: "FV = PV × (1 + r)^n",
          calculation: "FV = 1,000 × (1.06)^2",
          explanation: "This calculates compound growth"
        },
        {
          step: 3,
          description: "Calculate compound factor",
          calculation: "(1.06)^2 = 1.1236",
          explanation: "This is how much $1 grows to in 2 years"
        },
        {
          step: 4,
          description: "Final calculation",
          calculation: "FV = 1,000 × 1.1236 = $1,123.60",
          explanation: "You earn $123.60 in interest over 2 years"
        }
      ],
      commonMistakes: [
        "Using simple interest: 1000 × 0.06 × 2 = $120",
        "Adding interest separately each year"
      ],
      estimatedTime: 90,
      prerequisites: [],
      relatedQuestions: ['tvm_1', 'tvm_4']
    },
    {
      id: 'tvm_4',
      question: "What is the primary principle behind time value of money?",
      options: [
        "Money loses value over time",
        "Money today is worth more than money tomorrow",
        "Interest rates always increase",
        "Future cash flows are uncertain"
      ],
      correct: 1,
      explanation: "Money today can be invested to earn returns, making it worth more than the same amount in the future",
      difficulty: 'easy',
      concepts: ['Time Value of Money'],
      hints: [
        "Think about opportunity cost",
        "Consider what you can do with money today vs. tomorrow",
        "Investment potential is key"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Core concept",
          explanation: "Money has earning potential - you can invest it today to grow"
        },
        {
          step: 2,
          description: "Opportunity cost",
          explanation: "Waiting to receive money means losing potential investment returns",
          tip: "This is why we discount future cash flows"
        }
      ],
      commonMistakes: [
        "Focusing only on inflation",
        "Ignoring investment opportunities"
      ],
      estimatedTime: 45,
      prerequisites: [],
      relatedQuestions: ['tvm_5']
    },
    {
      id: 'tvm_5',
      question: "To calculate PV in Excel with annual payments, which argument represents the discount rate?",
      options: ["nper", "rate", "pmt", "type"],
      correct: 1,
      explanation: "The 'rate' argument is the discount rate in Excel's PV function: =PV(rate, nper, pmt, [fv], [type])",
      difficulty: 'easy',
      concepts: ['Excel Functions', 'Present Value'],
      hints: [
        "Think about what each argument means",
        "Rate is another word for interest or discount rate",
        "The function syntax is =PV(rate, nper, pmt, [fv], [type])"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Excel PV function syntax",
          formula: "=PV(rate, nper, pmt, [fv], [type])",
          explanation: "Each argument has a specific purpose"
        },
        {
          step: 2,
          description: "Argument meanings",
          explanation: "rate = discount rate, nper = number of periods, pmt = payment amount",
          tip: "Arguments in brackets are optional"
        }
      ],
      commonMistakes: [
        "Confusing rate with number of periods",
        "Using annual rate for monthly payments without adjusting"
      ],
      estimatedTime: 60,
      prerequisites: [],
      relatedQuestions: ['excel_1', 'excel_2']
    },
    // Add 10 more easy questions here...
    
    // Medium Questions (20)
    {
      id: 'tvm_16',
      question: "You can receive $500 today or $550 in one year. If your required return is 8%, which should you choose?",
      options: ["$500 today", "$550 in one year", "They are equal", "Need more info"],
      correct: 1,
      explanation: "PV of $550 = 550/1.08 = $509.26. Since $509.26 > $500, take $550 in one year.",
      difficulty: 'medium',
      concepts: ['Present Value', 'Decision Making'],
      hints: [
        "Compare both options in present value terms",
        "Calculate PV of $550: PV = 550/1.08",
        "Choose the option with higher present value"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Set up the comparison",
          explanation: "Option A: $500 today (PV = $500), Option B: $550 in 1 year (PV = ?)"
        },
        {
          step: 2,
          description: "Calculate PV of Option B",
          formula: "PV = FV / (1 + r)^n",
          calculation: "PV = 550 / (1.08)^1 = 550 / 1.08 = $509.26",
          explanation: "This is what $550 next year is worth today"
        },
        {
          step: 3,
          description: "Compare present values",
          explanation: "Option A: $500 < Option B: $509.26",
          tip: "Always compare options in the same time period (usually present)"
        }
      ],
      commonMistakes: [
        "Comparing $500 directly to $550 without discounting",
        "Using wrong discount rate",
        "Discounting the wrong cash flow"
      ],
      estimatedTime: 120,
      prerequisites: ['tvm_1'],
      relatedQuestions: ['tvm_17', 'tvm_30']
    },
    {
      id: 'tvm_17',
      question: "A project costs $10,000 today and returns $12,000 in 2 years. What's the annual return?",
      options: ["9.54%", "10%", "20%", "8.33%"],
      correct: 0,
      explanation: "Using (FV/PV)^(1/n) - 1 = (12000/10000)^(1/2) - 1 = 1.095445 - 1 = 9.54%",
      difficulty: 'medium',
      concepts: ['Rate of Return', 'Compounding'],
      hints: [
        "You need to find the rate that makes PV of $12,000 equal to $10,000",
        "Use: (FV/PV)^(1/n) - 1",
        "Take the square root since n = 2"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Set up the equation",
          explanation: "We need rate r where: 10,000 = 12,000/(1+r)^2"
        },
        {
          step: 2,
          description: "Rearrange to solve for r",
          formula: "(1+r)^2 = 12,000/10,000 = 1.2",
          explanation: "Isolate the compound factor"
        },
        {
          step: 3,
          description: "Take square root",
          calculation: "(1+r) = √1.2 = 1.095445",
          explanation: "Since n = 2, we take the square root"
        },
        {
          step: 4,
          description: "Solve for r",
          calculation: "r = 1.095445 - 1 = 0.0954 = 9.54%",
          explanation: "This is the annual compound return"
        }
      ],
      commonMistakes: [
        "Using simple return: (12,000-10,000)/10,000 = 20% total",
        "Dividing 20% by 2 to get 10% per year",
        "Not taking the root for multiple periods"
      ],
      estimatedTime: 150,
      prerequisites: ['tvm_3'],
      relatedQuestions: ['tvm_16', 'tvm_35']
    },
    // Add 18 more medium questions here...
    
    // Hard Questions (10)
    {
      id: 'tvm_36',
      question: "You need $50,000 in 5 years. If you can earn 7% annually and make equal annual deposits starting today, how much must each deposit be?",
      options: ["$7,929.86", "$8,705.65", "$8,130.15", "$9,478.39"],
      correct: 2,
      explanation: "This is an annuity due problem. Using Excel: =PMT(7%,5,0,-50000,1) = $8,130.15",
      difficulty: 'hard',
      concepts: ['Annuity Due', 'Future Value', 'Payment Calculation'],
      hints: [
        "This is annuity due since payments start today",
        "You're solving for PMT given FV",
        "In Excel, use type=1 for beginning of period payments"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Identify the problem type",
          explanation: "Annuity due (payments at beginning) with known FV, solving for PMT"
        },
        {
          step: 2,
          description: "Set up the annuity due formula",
          formula: "FV = PMT × [(1+r)^n - 1]/r × (1+r)",
          explanation: "The (1+r) at the end accounts for beginning-of-period payments"
        },
        {
          step: 3,
          description: "Rearrange to solve for PMT",
          formula: "PMT = FV / {[(1+r)^n - 1]/r × (1+r)}",
          calculation: "PMT = 50,000 / {[(1.07)^5 - 1]/0.07 × 1.07}",
          explanation: "Substitute known values"
        },
        {
          step: 4,
          description: "Calculate the annuity factor",
          calculation: "[(1.07)^5 - 1]/0.07 = 5.7507, then × 1.07 = 6.1507",
          explanation: "This is the future value annuity due factor"
        },
        {
          step: 5,
          description: "Final calculation",
          calculation: "PMT = 50,000 / 6.1507 = $8,130.15",
          explanation: "Each payment must be $8,130.15",
          tip: "Verify: 5 payments of $8,130.15 growing at 7% = $50,000"
        }
      ],
      commonMistakes: [
        "Using ordinary annuity instead of annuity due",
        "Solving for PV instead of FV",
        "Forgetting the extra (1+r) factor for annuity due"
      ],
      estimatedTime: 180,
      prerequisites: ['tvm_16', 'annuities_1'],
      relatedQuestions: ['annuities_10', 'tvm_40']
    },
    // Add 9 more hard questions here...
    
    // Expert Questions (5)
    {
      id: 'tvm_46',
      question: "A loan of $100,000 at 6% annual rate requires monthly payments of $600. After how many years will it be paid off?",
      options: ["28.4 years", "30.1 years", "25.3 years", "Never (payments too small)"],
      correct: 3,
      explanation: "Monthly payment of $600 < Monthly interest of $500 (100,000×0.06/12). The loan balance grows!",
      difficulty: 'expert',
      concepts: ['Loan Amortization', 'Negative Amortization'],
      hints: [
        "Calculate the monthly interest on $100,000",
        "Compare monthly interest to monthly payment",
        "What happens if payment < interest?"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Calculate monthly interest rate",
          calculation: "Monthly rate = 6% / 12 = 0.5% = 0.005",
          explanation: "Convert annual rate to monthly"
        },
        {
          step: 2,
          description: "Calculate first month's interest",
          calculation: "Interest = $100,000 × 0.005 = $500",
          explanation: "This is the interest charged in month 1"
        },
        {
          step: 3,
          description: "Compare payment to interest",
          explanation: "Payment ($600) > Interest ($500) by only $100",
          tip: "Only $100 goes to principal each month initially"
        },
        {
          step: 4,
          description: "Check if loan can be repaid",
          calculation: "For full repayment, need: PMT > PV × r / (1 - (1+r)^(-∞))",
          explanation: "Minimum payment ≈ $599.55 for 360 months",
          tip: "At $600, it takes about 360 months (30 years) to repay"
        }
      ],
      commonMistakes: [
        "Not converting annual rate to monthly",
        "Assuming any payment will eventually pay off loan",
        "Not recognizing near-minimum payment situation"
      ],
      estimatedTime: 240,
      prerequisites: ['tvm_36', 'excel_15'],
      relatedQuestions: ['tvm_47', 'tvm_50']
    }
    // Add 4 more expert questions here...
  ],

  portfolio: [
    // 50+ questions following similar pattern
    {
      id: 'portfolio_1',
      question: "Portfolio with 40% Stock A (E(R)=15%) and 60% Stock B (E(R)=10%), expected return is:",
      options: ["12.5%", "12%", "11.5%", "13%"],
      correct: 1,
      explanation: "E(Rp) = 0.4(15%) + 0.6(10%) = 6% + 6% = 12%",
      difficulty: 'easy',
      concepts: ['Expected Return', 'Portfolio Weights'],
      hints: [
        "Use weighted average formula",
        "E(Rp) = w₁×E(R₁) + w₂×E(R₂)",
        "Multiply each weight by its return, then add"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Identify the components",
          explanation: "w₁ = 40% = 0.4, E(R₁) = 15%, w₂ = 60% = 0.6, E(R₂) = 10%"
        },
        {
          step: 2,
          description: "Apply portfolio return formula",
          formula: "E(Rp) = w₁×E(R₁) + w₂×E(R₂)",
          calculation: "E(Rp) = 0.4×15% + 0.6×10%",
          explanation: "This is a weighted average of returns"
        },
        {
          step: 3,
          description: "Calculate each component",
          calculation: "0.4×15% = 6%, 0.6×10% = 6%",
          explanation: "Each stock contributes based on its weight"
        },
        {
          step: 4,
          description: "Sum the contributions",
          calculation: "E(Rp) = 6% + 6% = 12%",
          explanation: "The portfolio expected return is 12%"
        }
      ],
      commonMistakes: [
        "Using simple average (15%+10%)/2 = 12.5%",
        "Mixing up the weights",
        "Forgetting to convert percentages"
      ],
      estimatedTime: 90,
      prerequisites: [],
      relatedQuestions: ['portfolio_2', 'portfolio_15']
    }
    // Add remaining portfolio questions...
  ],

  bonds: [
    // 50+ bond questions
    {
      id: 'bonds_1',
      question: "$1,000 face bond, 5% coupon, 3 years, YTM=6%. Price is approximately:",
      options: ["$973.27", "$1,000.00", "$1,027.09", "$950.25"],
      correct: 0,
      explanation: "Bond trades at discount when YTM > coupon. Price = PV of coupons + PV of face = $973.27",
      difficulty: 'medium',
      concepts: ['Bond Pricing', 'Yield to Maturity', 'Present Value'],
      hints: [
        "YTM > Coupon means discount bond",
        "Price = PV(Coupons) + PV(Face Value)",
        "Discount each cash flow at YTM"
      ],
      detailedSolution: [
        {
          step: 1,
          description: "Identify cash flows",
          explanation: "Annual coupon = $1,000 × 5% = $50 for 3 years, plus $1,000 face at maturity"
        },
        {
          step: 2,
          description: "Calculate PV of coupons",
          formula: "PV = C × [1 - (1+r)^-n] / r",
          calculation: "PV = 50 × [1 - (1.06)^-3] / 0.06 = 50 × 2.673 = $133.65",
          explanation: "This is the present value of the coupon stream"
        },
        {
          step: 3,
          description: "Calculate PV of face value",
          formula: "PV = FV / (1+r)^n",
          calculation: "PV = 1,000 / (1.06)^3 = 1,000 / 1.191 = $839.62",
          explanation: "This is what the principal repayment is worth today"
        },
        {
          step: 4,
          description: "Sum the present values",
          calculation: "Price = $133.65 + $839.62 = $973.27",
          explanation: "Bond price is sum of all discounted cash flows",
          tip: "Price < Face because YTM > Coupon Rate"
        }
      ],
      commonMistakes: [
        "Using coupon rate instead of YTM for discounting",
        "Forgetting to include face value repayment",
        "Not understanding discount vs. premium bonds"
      ],
      estimatedTime: 180,
      prerequisites: ['tvm_1'],
      relatedQuestions: ['bonds_2', 'bonds_20']
    }
    // Add remaining bond questions...
  ],

  // Continue with other topics...
};

// Video Lessons Data
export const videoLessonsData: VideoLesson[] = [
  {
    id: 'video_tvm_1',
    topicId: 'tvm',
    title: 'Introduction to Time Value of Money',
    duration: 480, // 8 minutes
    thumbnailUrl: '/thumbnails/tvm_intro.jpg',
    videoUrl: '/videos/tvm_intro.mp4',
    transcript: 'Welcome to Time Value of Money...',
    keyPoints: [
      'Money today is worth more than money tomorrow',
      'Three key factors: Present Value, Future Value, and Interest Rate',
      'Applications in investment decisions and loan calculations'
    ],
    embeddedQuizzes: [
      {
        timestamp: 120,
        question: "Why is money today worth more than money tomorrow?",
        options: [
          "Because of inflation only",
          "Because it can be invested to earn returns",
          "Because of uncertainty",
          "All of the above"
        ],
        correct: 1,
        explanation: "The primary reason is opportunity cost - money today can be invested to grow"
      },
      {
        timestamp: 360,
        question: "Which formula calculates present value?",
        options: [
          "PV = FV × (1+r)^n",
          "PV = FV / (1+r)^n",
          "PV = FV + r × n",
          "PV = FV - r × n"
        ],
        correct: 1,
        explanation: "PV = FV / (1+r)^n discounts future value back to present"
      }
    ],
    watchedPercentage: 0,
    notes: []
  },
  {
    id: 'video_tvm_2',
    topicId: 'tvm',
    title: 'Calculating Present and Future Values',
    duration: 600, // 10 minutes
    thumbnailUrl: '/thumbnails/tvm_calc.jpg',
    videoUrl: '/videos/tvm_calc.mp4',
    transcript: 'In this lesson, we will dive deep into calculations...',
    keyPoints: [
      'Step-by-step PV and FV calculations',
      'Using financial calculators and Excel',
      'Common mistakes to avoid'
    ],
    embeddedQuizzes: [
      {
        timestamp: 300,
        question: "Calculate FV of $1,000 at 5% for 2 years",
        options: ["$1,100", "$1,102.50", "$1,050", "$1,105"],
        correct: 1,
        explanation: "FV = 1,000 × (1.05)^2 = 1,000 × 1.1025 = $1,102.50"
      }
    ],
    watchedPercentage: 0,
    notes: []
  },
  // Add more videos for each topic...
];

// Formula References
export const formulaReferences: FormulaReference[] = [
  {
    id: 'formula_pv',
    name: 'Present Value',
    formula: 'PV = FV / (1 + r)^n',
    variables: [
      { symbol: 'PV', meaning: 'Present Value' },
      { symbol: 'FV', meaning: 'Future Value' },
      { symbol: 'r', meaning: 'Discount/Interest Rate (decimal)' },
      { symbol: 'n', meaning: 'Number of Periods' }
    ],
    usage: 'Calculates what a future cash flow is worth today',
    examples: [
      {
        description: 'PV of $1,000 received in 3 years at 5%',
        calculation: 'PV = 1,000 / (1.05)^3 = $863.84'
      },
      {
        description: 'PV of $5,000 received in 10 years at 8%',
        calculation: 'PV = 5,000 / (1.08)^10 = $2,315.97'
      }
    ],
    relatedFormulas: ['formula_fv', 'formula_npv'],
    tags: ['tvm', 'basic', 'discounting']
  },
  {
    id: 'formula_fv',
    name: 'Future Value',
    formula: 'FV = PV × (1 + r)^n',
    variables: [
      { symbol: 'FV', meaning: 'Future Value' },
      { symbol: 'PV', meaning: 'Present Value' },
      { symbol: 'r', meaning: 'Interest Rate (decimal)' },
      { symbol: 'n', meaning: 'Number of Periods' }
    ],
    usage: 'Calculates how much an investment will grow to',
    examples: [
      {
        description: 'FV of $1,000 invested for 5 years at 6%',
        calculation: 'FV = 1,000 × (1.06)^5 = $1,338.23'
      }
    ],
    relatedFormulas: ['formula_pv'],
    tags: ['tvm', 'basic', 'compounding']
  },
  {
    id: 'formula_annuity_pv',
    name: 'Present Value of Annuity',
    formula: 'PV = PMT × [(1 - (1+r)^-n) / r]',
    variables: [
      { symbol: 'PV', meaning: 'Present Value' },
      { symbol: 'PMT', meaning: 'Payment Amount' },
      { symbol: 'r', meaning: 'Discount Rate per Period' },
      { symbol: 'n', meaning: 'Number of Payments' }
    ],
    usage: 'Values a series of equal payments',
    examples: [
      {
        description: '$100/month for 5 years at 12% annual (1% monthly)',
        calculation: 'PV = 100 × [(1 - (1.01)^-60) / 0.01] = $4,495.50'
      }
    ],
    relatedFormulas: ['formula_annuity_fv', 'formula_perpetuity'],
    tags: ['annuities', 'tvm']
  },
  {
    id: 'formula_perpetuity',
    name: 'Perpetuity Value',
    formula: 'PV = PMT / r',
    variables: [
      { symbol: 'PV', meaning: 'Present Value' },
      { symbol: 'PMT', meaning: 'Payment Amount' },
      { symbol: 'r', meaning: 'Discount Rate' }
    ],
    usage: 'Values infinite series of equal payments',
    examples: [
      {
        description: '$1,000 annual payment at 5% discount rate',
        calculation: 'PV = 1,000 / 0.05 = $20,000'
      }
    ],
    relatedFormulas: ['formula_growing_perpetuity', 'formula_annuity_pv'],
    tags: ['annuities', 'perpetuities']
  },
  {
    id: 'formula_growing_perpetuity',
    name: 'Growing Perpetuity',
    formula: 'PV = PMT / (r - g)',
    variables: [
      { symbol: 'PV', meaning: 'Present Value' },
      { symbol: 'PMT', meaning: 'First Payment' },
      { symbol: 'r', meaning: 'Discount Rate' },
      { symbol: 'g', meaning: 'Growth Rate' }
    ],
    usage: 'Values infinite series of growing payments',
    examples: [
      {
        description: '$100 first payment, 3% growth, 8% discount rate',
        calculation: 'PV = 100 / (0.08 - 0.03) = $2,000'
      }
    ],
    relatedFormulas: ['formula_perpetuity'],
    tags: ['annuities', 'perpetuities', 'growth']
  },
  {
    id: 'formula_portfolio_return',
    name: 'Portfolio Expected Return',
    formula: 'E(Rp) = Σ wi × E(Ri)',
    variables: [
      { symbol: 'E(Rp)', meaning: 'Expected Portfolio Return' },
      { symbol: 'wi', meaning: 'Weight of Asset i' },
      { symbol: 'E(Ri)', meaning: 'Expected Return of Asset i' }
    ],
    usage: 'Calculates weighted average return of portfolio',
    examples: [
      {
        description: '60% Stock A (12% return), 40% Stock B (8% return)',
        calculation: 'E(Rp) = 0.6×12% + 0.4×8% = 10.4%'
      }
    ],
    relatedFormulas: ['formula_portfolio_variance'],
    tags: ['portfolio', 'returns']
  },
  {
    id: 'formula_portfolio_variance',
    name: 'Two-Asset Portfolio Variance',
    formula: 'σp² = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρ₁₂σ₁σ₂',
    variables: [
      { symbol: 'σp²', meaning: 'Portfolio Variance' },
      { symbol: 'wi', meaning: 'Weight of Asset i' },
      { symbol: 'σi', meaning: 'Standard Deviation of Asset i' },
      { symbol: 'ρ₁₂', meaning: 'Correlation between Assets' }
    ],
    usage: 'Measures portfolio risk considering correlation',
    examples: [
      {
        description: 'Equal weights, σ₁=20%, σ₂=30%, ρ=0.5',
        calculation: 'σp² = 0.5²×0.2² + 0.5²×0.3² + 2×0.5×0.5×0.5×0.2×0.3'
      }
    ],
    relatedFormulas: ['formula_portfolio_return'],
    tags: ['portfolio', 'risk', 'variance']
  },
  {
    id: 'formula_bond_price',
    name: 'Bond Price',
    formula: 'P = Σ C/(1+y)^t + F/(1+y)^n',
    variables: [
      { symbol: 'P', meaning: 'Bond Price' },
      { symbol: 'C', meaning: 'Coupon Payment' },
      { symbol: 'F', meaning: 'Face Value' },
      { symbol: 'y', meaning: 'Yield to Maturity' },
      { symbol: 't', meaning: 'Time Period' },
      { symbol: 'n', meaning: 'Maturity' }
    ],
    usage: 'Values a bond based on its cash flows',
    examples: [
      {
        description: '$1,000 face, 5% coupon, 3 years, 6% YTM',
        calculation: 'P = 50/1.06 + 50/1.06² + 50/1.06³ + 1000/1.06³ = $973.27'
      }
    ],
    relatedFormulas: ['formula_current_yield', 'formula_duration'],
    tags: ['bonds', 'fixed income']
  },
  {
    id: 'formula_current_yield',
    name: 'Current Yield',
    formula: 'Current Yield = Annual Coupon / Current Price',
    variables: [
      { symbol: 'Annual Coupon', meaning: 'Total coupon payments per year' },
      { symbol: 'Current Price', meaning: 'Market price of bond' }
    ],
    usage: 'Simple yield measure based on current price',
    examples: [
      {
        description: '$50 annual coupon, $950 price',
        calculation: 'Current Yield = 50 / 950 = 5.26%'
      }
    ],
    relatedFormulas: ['formula_bond_price', 'formula_ytm'],
    tags: ['bonds', 'yield']
  },
  {
    id: 'formula_current_ratio',
    name: 'Current Ratio',
    formula: 'Current Ratio = Current Assets / Current Liabilities',
    variables: [
      { symbol: 'Current Assets', meaning: 'Assets convertible to cash within 1 year' },
      { symbol: 'Current Liabilities', meaning: 'Obligations due within 1 year' }
    ],
    usage: 'Measures short-term liquidity',
    examples: [
      {
        description: '$500,000 current assets, $250,000 current liabilities',
        calculation: 'Current Ratio = 500,000 / 250,000 = 2.0'
      }
    ],
    relatedFormulas: ['formula_quick_ratio'],
    tags: ['ratios', 'liquidity']
  },
  {
    id: 'formula_quick_ratio',
    name: 'Quick Ratio (Acid Test)',
    formula: 'Quick Ratio = (Current Assets - Inventory) / Current Liabilities',
    variables: [
      { symbol: 'Current Assets', meaning: 'Short-term assets' },
      { symbol: 'Inventory', meaning: 'Stock on hand' },
      { symbol: 'Current Liabilities', meaning: 'Short-term obligations' }
    ],
    usage: 'More conservative liquidity measure',
    examples: [
      {
        description: '$500k assets, $150k inventory, $250k liabilities',
        calculation: 'Quick Ratio = (500 - 150) / 250 = 1.4'
      }
    ],
    relatedFormulas: ['formula_current_ratio'],
    tags: ['ratios', 'liquidity']
  },
  {
    id: 'formula_debt_to_equity',
    name: 'Debt-to-Equity Ratio',
    formula: 'D/E = Total Debt / Total Equity',
    variables: [
      { symbol: 'Total Debt', meaning: 'All interest-bearing liabilities' },
      { symbol: 'Total Equity', meaning: 'Shareholders\' equity' }
    ],
    usage: 'Measures financial leverage',
    examples: [
      {
        description: '$600k debt, $400k equity',
        calculation: 'D/E = 600,000 / 400,000 = 1.5'
      }
    ],
    relatedFormulas: ['formula_interest_coverage'],
    tags: ['ratios', 'leverage']
  },
  {
    id: 'formula_npv',
    name: 'Net Present Value',
    formula: 'NPV = Σ CFt/(1+r)^t - Initial Investment',
    variables: [
      { symbol: 'CFt', meaning: 'Cash flow at time t' },
      { symbol: 'r', meaning: 'Discount rate' },
      { symbol: 't', meaning: 'Time period' }
    ],
    usage: 'Evaluates project profitability',
    examples: [
      {
        description: '-$10k initial, $4k/year for 3 years, 10% rate',
        calculation: 'NPV = -10,000 + 4,000/1.1 + 4,000/1.1² + 4,000/1.1³ = -$51'
      }
    ],
    relatedFormulas: ['formula_irr', 'formula_pi'],
    tags: ['capital', 'npv', 'investment']
  },
  {
    id: 'formula_irr',
    name: 'Internal Rate of Return',
    formula: '0 = Σ CFt/(1+IRR)^t',
    variables: [
      { symbol: 'CFt', meaning: 'Cash flow at time t' },
      { symbol: 'IRR', meaning: 'Internal rate of return' },
      { symbol: 't', meaning: 'Time period' }
    ],
    usage: 'Rate where NPV equals zero',
    examples: [
      {
        description: 'Solve iteratively or use Excel =IRR()',
        calculation: 'Find rate where PV of inflows = Initial investment'
      }
    ],
    relatedFormulas: ['formula_npv', 'formula_mirr'],
    tags: ['capital', 'irr', 'investment']
  }
];

// AI Tutor Responses Database
export const aiTutorResponses = {
  concepts: {
    'present value': {
      explanation: "Present value is the current worth of a future sum of money. Think of it as answering: 'How much would I need to invest today to have $X in the future?'",
      analogies: [
        "It's like reverse compound interest - working backwards from future to present",
        "Similar to asking 'What's the seed money needed to grow to my target?'"
      ],
      commonErrors: [
        "Forgetting to convert interest rates (e.g., annual to monthly)",
        "Using multiplication instead of division",
        "Not matching time periods with interest rate periods"
      ]
    },
    'portfolio theory': {
      explanation: "Portfolio theory shows how to combine investments to maximize return for a given risk level, or minimize risk for a target return.",
      analogies: [
        "Like mixing ingredients in cooking - the combination matters as much as individual quality",
        "Similar to not putting all eggs in one basket, but being smart about which baskets to use"
      ],
      commonErrors: [
        "Ignoring correlation between assets",
        "Using simple average instead of weighted average for returns",
        "Forgetting that variance uses squared weights"
      ]
    }
  },
  problemTypes: {
    'time value calculations': {
      approach: "1) Identify what you're solving for (PV, FV, r, or n)\n2) List all known variables\n3) Choose the appropriate formula\n4) Substitute and solve\n5) Check if answer makes sense",
      tips: [
        "Draw a timeline to visualize cash flows",
        "Always check: does PV < FV when r > 0?",
        "Use Excel functions to verify manual calculations"
      ]
    }
  }
};