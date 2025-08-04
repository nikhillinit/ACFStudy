// Enhanced module definitions with detailed learning objectives
// Integrated from deployment package for comprehensive learning paths

export interface EnhancedModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  problemCount: number;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  keyFormulas: string[];
  realWorldApplications: string[];
  practiceProblems: {
    beginner: number;
    intermediate: number; 
    advanced: number;
  };
}

export const ENHANCED_MODULES: EnhancedModule[] = [
  {
    id: 'time-value-money',
    title: 'Time Value of Money',
    description: 'Master present value, future value, and annuity calculations essential for all corporate finance decisions',
    category: 'Foundation',
    difficulty: 1,
    problemCount: 25,
    estimatedTime: 120, // minutes
    prerequisites: [],
    learningObjectives: [
      'Calculate present and future values of single cash flows',
      'Evaluate annuities and perpetuities',
      'Apply NPV and IRR for investment decisions',
      'Understand compounding and discounting concepts',
      'Master time value applications in real scenarios'
    ],
    keyFormulas: [
      'PV = FV / (1+r)^n',
      'FV = PV × (1+r)^n', 
      'NPV = Σ CF_t / (1+r)^t - Initial Investment',
      'PMT = PV × [r(1+r)^n] / [(1+r)^n - 1]'
    ],
    realWorldApplications: [
      'Investment project evaluation',
      'Loan and mortgage calculations',
      'Retirement planning',
      'Bond and stock valuation foundations'
    ],
    practiceProblems: {
      beginner: 10,
      intermediate: 10,
      advanced: 5
    }
  },
  {
    id: 'portfolio-theory',
    title: 'Portfolio Theory',
    description: 'Learn CAPM, risk-return relationships, and modern portfolio optimization techniques',
    category: 'Risk Management',
    difficulty: 2,
    problemCount: 25,
    estimatedTime: 150,
    prerequisites: ['Time Value of Money'],
    learningObjectives: [
      'Calculate expected returns and portfolio risk',
      'Apply CAPM for required return estimation',
      'Understand diversification benefits and limitations',
      'Construct efficient portfolios using Markowitz theory',
      'Analyze beta, alpha, and systematic vs unsystematic risk'
    ],
    keyFormulas: [
      'E(R_p) = Σ w_i × E(R_i)',
      'σ_p² = Σ w_i² × σ_i² + 2Σ w_i w_j × Cov(i,j)',
      'R_i = R_f + β_i × (R_m - R_f)',
      'Sharpe Ratio = (R_p - R_f) / σ_p'
    ],
    realWorldApplications: [
      'Asset allocation decisions',
      'Risk management strategies',
      'Performance evaluation',
      'Capital budgeting under uncertainty'
    ],
    practiceProblems: {
      beginner: 8,
      intermediate: 12,
      advanced: 5
    }
  },
  {
    id: 'bond-valuation',
    title: 'Bond Valuation',
    description: 'Understand bond pricing, yield calculations, duration, and interest rate risk management',
    category: 'Fixed Income',
    difficulty: 2,
    problemCount: 25,
    estimatedTime: 135,
    prerequisites: ['Time Value of Money'],
    learningObjectives: [
      'Price bonds using present value techniques',
      'Calculate yield to maturity and current yield',
      'Measure duration and convexity for risk assessment',
      'Analyze interest rate sensitivity and immunization',
      'Evaluate credit risk and bond ratings impact'
    ],
    keyFormulas: [
      'Bond Price = Σ (Coupon / (1+YTM)^t) + (Face Value / (1+YTM)^n)',
      'Modified Duration = Duration / (1 + YTM)',
      'Price Change ≈ -Modified Duration × ΔYield',
      'Current Yield = Annual Coupon / Current Price'
    ],
    realWorldApplications: [
      'Corporate debt financing decisions',
      'Interest rate risk hedging',
      'Fixed income portfolio management',
      'Credit analysis and rating'
    ],
    practiceProblems: {
      beginner: 8,
      intermediate: 12,
      advanced: 5
    }
  },
  {
    id: 'financial-statements',
    title: 'Financial Statements',
    description: 'Analyze balance sheets, income statements, and cash flow for financial decision making',
    category: 'Financial Analysis',
    difficulty: 1,
    problemCount: 15,
    estimatedTime: 90,
    prerequisites: [],
    learningObjectives: [
      'Interpret balance sheet components and relationships',
      'Analyze income statement for profitability assessment',
      'Understand cash flow statement construction',
      'Calculate and interpret key financial ratios',
      'Apply financial statement analysis for decision making'
    ],
    keyFormulas: [
      'ROE = Net Income / Shareholders Equity',
      'ROA = Net Income / Total Assets',
      'Current Ratio = Current Assets / Current Liabilities',
      'Debt-to-Equity = Total Debt / Total Equity'
    ],
    realWorldApplications: [
      'Credit analysis and lending decisions',
      'Investment screening and selection',
      'Performance benchmarking',
      'Merger and acquisition evaluation'
    ],
    practiceProblems: {
      beginner: 8,
      intermediate: 5,
      advanced: 2
    }
  },
  {
    id: 'derivatives',
    title: 'Derivatives',
    description: 'Master options, futures, forwards, and swaps for risk management and speculation',
    category: 'Advanced Instruments',
    difficulty: 3,
    problemCount: 25,
    estimatedTime: 180,
    prerequisites: ['Portfolio Theory', 'Bond Valuation'],
    learningObjectives: [
      'Value options using Black-Scholes and binomial models',
      'Understand futures and forward contract mechanics',
      'Apply derivatives for hedging strategies',
      'Calculate Greeks for risk management',
      'Design complex derivative strategies'
    ],
    keyFormulas: [
      'Black-Scholes Call = S₀N(d₁) - Xe^(-rT)N(d₂)',
      'Put-Call Parity: C - P = S₀ - Xe^(-rT)',
      'Delta = ∂Option Price / ∂Stock Price',
      'Forward Price = S₀ × e^(rT)'
    ],
    realWorldApplications: [
      'Currency and interest rate hedging',
      'Commodity price risk management',
      'Executive compensation design',
      'Corporate risk management strategies'
    ],
    practiceProblems: {
      beginner: 5,
      intermediate: 10,
      advanced: 10
    }
  }
];

export function getModuleById(moduleId: string): EnhancedModule | undefined {
  return ENHANCED_MODULES.find(module => module.id === moduleId);
}

export function getModulesByDifficulty(difficulty: number): EnhancedModule[] {
  return ENHANCED_MODULES.filter(module => module.difficulty === difficulty);
}

export function getModulesByPrerequisite(prerequisite: string): EnhancedModule[] {
  return ENHANCED_MODULES.filter(module => 
    module.prerequisites.includes(prerequisite)
  );
}

export function calculateModuleProgress(moduleId: string, userProgress: any): {
  completionRate: number;
  accuracy: number;
  problemsCompleted: number;
  estimatedTimeRemaining: number;
} {
  const module = getModuleById(moduleId);
  if (!module) {
    return { completionRate: 0, accuracy: 0, problemsCompleted: 0, estimatedTimeRemaining: 0 };
  }

  const progress = userProgress[module.title] || { completed: [], accuracy: 0 };
  const problemsCompleted = progress.completed.length;
  const completionRate = problemsCompleted / module.problemCount;
  const estimatedTimeRemaining = module.estimatedTime * (1 - completionRate);

  return {
    completionRate: Math.round(completionRate * 100),
    accuracy: Math.round(progress.accuracy * 100),
    problemsCompleted,
    estimatedTimeRemaining: Math.round(estimatedTimeRemaining)
  };
}