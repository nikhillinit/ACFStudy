import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Circle, Clock, Target, TrendingUp, BookOpen, Calculator, BarChart3, DollarSign, Zap, Brain, ExternalLink, Download, RefreshCw, Filter, ChevronDown, ChevronUp, MessageCircle, LineChart, PieChart, Calendar, Award, AlertCircle, CheckSquare } from 'lucide-react';

const ACFLearningChallenges = () => {
  const [currentView, setCurrentView] = useState('challenges'); // 'challenges' | 'analytics'
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [challengeAttempts, setChallengeAttempts] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPanelContent, setAiPanelContent] = useState('');
  const [preQuizAnswers, setPreQuizAnswers] = useState({});
  const [showPreQuiz, setShowPreQuiz] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setShowSolution(true);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('acf-progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedChallenges(new Set(data.completed || []));
      setChallengeAttempts(data.attempts || {});
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    const data = {
      completed: Array.from(completedChallenges),
      attempts: challengeAttempts
    };
    localStorage.setItem('acf-progress', JSON.stringify(data));
  }, [completedChallenges, challengeAttempts]);

  useEffect(() => {
    saveProgress();
  }, [saveProgress]);

  const challengeCategories = [
    {
      id: 'tvm',
      title: 'Time Value of Money',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Master PV, FV, and compound interest calculations',
      studyGuideUrl: 'https://docs.google.com/document/d/1oTHmSGT2CTJK1ykdpZePxaAS5ZUbMVKp_fTdpqOmFaE/edit#heading=h.tvm_section',
      excelTemplate: 'TVM_Study_Template.xlsx',
      challenges: [
        {
          id: 'tvm1',
          title: 'Quick TVM Challenge',
          difficulty: 'Beginner',
          timeLimit: 180,
          type: 'calculation',
          module: 'TVM',
          expectedAnswer: 8589.93,
          tolerance: 50,
          problem: "You can invest $5,000 today at 7% annual interest, compounded annually. What will it be worth in 8 years?",
          hint: "Use the Future Value formula: FV = PV × (1 + r)^n",
          solution: "$8,589.93 (using FV = 5,000 × (1.07)^8 = 5,000 × 1.7182 = $8,591)",
          excelFormula: "=FV(0.07, 8, 0, -5000)",
          learningPoints: [
            "Always match the compounding frequency with the rate",
            "Use negative PV in Excel when calculating FV",
            "Double-check your exponent calculation"
          ],
          preQuiz: [
            {
              question: "What does PV stand for in TVM calculations?",
              options: ["Present Value", "Previous Value", "Principal Value", "Primary Value"],
              correct: 0
            },
            {
              question: "In the formula FV = PV(1+r)^n, what does 'n' represent?",
              options: ["Interest rate", "Number of periods", "Number of payments", "Net value"],
              correct: 1
            }
          ],
          aiPrompts: {
            hint: "I'm working on a time value of money problem involving future value calculation. Can you explain the difference between simple and compound interest, and walk me through the FV formula step by step?",
            deepDive: "time value money future value present value compound interest calculation tutorial",
            model: "Create an Excel model for future value calculation with $5,000 initial investment at 7% annual rate for 8 years"
          }
        },
        {
          id: 'tvm2',
          title: 'Compounding Frequency Impact',
          difficulty: 'Intermediate',
          timeLimit: 300,
          type: 'comparison',
          module: 'TVM',
          problem: "Compare the future value of $10,000 invested for 5 years at 8% annual rate under: (a) Annual compounding, (b) Monthly compounding, (c) Daily compounding",
          hint: "Use EAR formula: (1 + r/m)^m - 1, then apply to FV calculation",
          solution: "(a) $14,693.28 (b) $14,898.46 (c) $14,918.25. Notice diminishing returns from more frequent compounding.",
          excelFormula: "Annual: =FV(0.08,5,0,-10000) | Monthly: =FV(0.08/12,60,0,-10000)",
          learningPoints: [
            "More frequent compounding increases returns but with diminishing effect",
            "The difference between daily and continuous compounding is minimal",
            "For monthly compounding, divide rate by 12 and multiply periods by 12"
          ],
          preQuiz: [
            {
              question: "What happens to returns as compounding frequency increases?",
              options: ["Decreases significantly", "Increases with diminishing returns", "Stays the same", "Increases exponentially"],
              correct: 1
            }
          ],
          aiPrompts: {
            hint: "Help me understand how different compounding frequencies (annual, monthly, daily) affect investment returns and how to calculate each one.",
            deepDive: "compound interest frequency comparison annual monthly daily continuous compounding effects",
            model: "Build a comparison table showing future value differences across compounding frequencies"
          }
        }
      ]
    },
    {
      id: 'portfolio',
      title: 'Portfolio Theory',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Expected returns, risk, and diversification',
      studyGuideUrl: 'https://docs.google.com/document/d/1oTHmSGT2CTJK1ykdpZePxaAS5ZUbMVKp_fTdpqOmFaE/edit#heading=h.portfolio_section',
      excelTemplate: 'Portfolio_Analysis_Template.xlsx',
      challenges: [
        {
          id: 'port1',
          title: 'Portfolio Return Challenge',
          difficulty: 'Beginner',
          timeLimit: 240,
          type: 'calculation',
          module: 'Portfolio Theory',
          expectedAnswer: 10.8,
          tolerance: 0.5,
          problem: "Create a portfolio with 35% in Stock A (expected return 12%), 45% in Stock B (expected return 8%), and 20% in Stock C (expected return 15%). What is the portfolio's expected return?",
          hint: "Portfolio return = Σ(weight × expected return)",
          solution: "E(Rp) = 0.35(12%) + 0.45(8%) + 0.20(15%) = 4.2% + 3.6% + 3.0% = 10.8%",
          excelFormula: "=SUMPRODUCT({0.35;0.45;0.20},{0.12;0.08;0.15})",
          learningPoints: [
            "Portfolio return is always a weighted average of individual returns",
            "Weights must sum to 100%",
            "Use SUMPRODUCT in Excel for portfolio calculations"
          ],
          preQuiz: [
            {
              question: "Portfolio expected return is calculated as:",
              options: ["Simple average of returns", "Weighted average by market cap", "Weighted average by portfolio allocation", "Highest individual return"],
              correct: 2
            }
          ],
          aiPrompts: {
            hint: "Explain how to calculate portfolio expected return using weighted averages. Why can't we just take a simple average?",
            deepDive: "portfolio theory expected return calculation weighted average diversification",
            model: "Create a portfolio allocation calculator with three assets showing weighted returns"
          }
        },
        {
          id: 'port2',
          title: 'Risk Reduction through Diversification',
          difficulty: 'Advanced',
          timeLimit: 420,
          type: 'analysis',
          module: 'Portfolio Theory',
          problem: "Two stocks: A (σ=25%, E(R)=15%) and B (σ=20%, E(R)=10%). If correlation = -0.3, find the minimum variance portfolio weights and its risk level.",
          hint: "Minimum variance occurs when derivative of portfolio variance = 0",
          solution: "Weight in A = 39.1%, Weight in B = 60.9%, Portfolio σ = 13.8%. The negative correlation provides significant risk reduction.",
          excelFormula: "Use Solver to minimize portfolio variance formula",
          learningPoints: [
            "Negative correlation provides the best diversification benefit",
            "Minimum variance portfolio may not be the optimal risk-return portfolio",
            "Portfolio risk can be less than the lowest individual asset risk"
          ],
          preQuiz: [
            {
              question: "What correlation provides the best diversification benefit?",
              options: ["+1.0", "0", "-1.0", "0.5"],
              correct: 2
            }
          ],
          aiPrompts: {
            hint: "Help me understand portfolio risk calculation and how correlation affects diversification benefits.",
            deepDive: "portfolio risk diversification correlation minimum variance portfolio optimization",
            model: "Build a two-asset portfolio optimizer showing risk-return tradeoffs with different correlations"
          }
        }
      ]
    },
    {
      id: 'bonds',
      title: 'Bond Valuation',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'Pricing, yields, and duration concepts',
      studyGuideUrl: 'https://docs.google.com/document/d/1oTHmSGT2CTJK1ykdpZePxaAS5ZUbMVKp_fTdpqOmFaE/edit#heading=h.bonds_section',
      excelTemplate: 'Bond_Valuation_Template.xlsx',
      challenges: [
        {
          id: 'bond1',
          title: 'Bond Pricing Challenge',
          difficulty: 'Intermediate',
          timeLimit: 360,
          type: 'calculation',
          module: 'Bond Valuation',
          expectedAnswer: 966.88,
          tolerance: 5,
          problem: "A corporate bond has a face value of $1,000, pays a 6% annual coupon, and matures in 4 years. If the current market yield is 7%, what is the bond's price?",
          hint: "Bond price = PV of coupons + PV of face value",
          solution: "$966.88. The bond trades at a discount because the coupon rate (6%) < market yield (7%)",
          excelFormula: "=PV(0.07, 4, 60, 1000) or =PRICE(settlement, maturity, 0.06, 0.07, 100, 1)",
          learningPoints: [
            "When yield > coupon rate, bond trades at discount",
            "When yield < coupon rate, bond trades at premium",
            "Bond prices move inverse to interest rates"
          ],
          preQuiz: [
            {
              question: "When market yield > coupon rate, the bond trades at:",
              options: ["Premium", "Discount", "Par value", "Cannot determine"],
              correct: 1
            }
          ],
          aiPrompts: {
            hint: "Explain bond pricing mechanics and why bonds trade at premium/discount. How do I calculate present value of bond cash flows?",
            deepDive: "bond valuation pricing yield coupon rate discount premium present value",
            model: "Create a bond pricing calculator showing cash flows and present value calculations"
          }
        }
      ]
    },
    {
      id: 'statements',
      title: 'Financial Statements',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'Balance sheet and income statement analysis',
      studyGuideUrl: 'https://docs.google.com/document/d/1oTHmSGT2CTJK1ykdpZePxaAS5ZUbMVKp_fTdpqOmFaE/edit#heading=h.statements_section',
      excelTemplate: 'Financial_Statements_Template.xlsx',
      challenges: [
        {
          id: 'stmt1',
          title: 'Statement Classification Speed Round',
          difficulty: 'Beginner',
          timeLimit: 180,
          type: 'classification',
          module: 'Financial Statements',
          problem: "Classify these items as Current Asset (CA), Non-Current Asset (NCA), Current Liability (CL), Non-Current Liability (NCL), or Equity (E): Accounts Payable, Equipment, Cash, Long-term Debt, Retained Earnings, Inventory, Patents",
          hint: "Current = within one year, consider the one-year rule",
          solution: "Accounts Payable (CL), Equipment (NCA), Cash (CA), Long-term Debt (NCL), Retained Earnings (E), Inventory (CA), Patents (NCA)",
          multipleChoice: [
            { item: "Accounts Payable", options: ["CA", "NCA", "CL", "NCL", "E"], correct: 2 },
            { item: "Equipment", options: ["CA", "NCA", "CL", "NCL", "E"], correct: 1 },
            { item: "Cash", options: ["CA", "NCA", "CL", "NCL", "E"], correct: 0 },
            { item: "Long-term Debt", options: ["CA", "NCA", "CL", "NCL", "E"], correct: 3 },
            { item: "Retained Earnings", options: ["CA", "NCA", "CL", "NCL", "E"], correct: 4 },
            { item: "Inventory", options: ["CA", "NCA", "CL", "NCL", "E"], correct: 0 },
            { item: "Patents", options: ["CA", "NCA", "CL", "NCL", "E"], correct: 1 }
          ],
          learningPoints: [
            "Current items are due/collected within one year",
            "Equipment and patents are long-term assets",
            "Retained earnings represent accumulated profits"
          ],
          preQuiz: [
            {
              question: "What defines a current asset?",
              options: ["High value", "Cash or convertible to cash within 1 year", "Physical asset", "Owned by company"],
              correct: 1
            }
          ],
          aiPrompts: {
            hint: "Help me understand financial statement classification rules. What's the difference between current and non-current items?",
            deepDive: "financial statements balance sheet classification current assets liabilities equity",
            model: "Create a balance sheet template with automatic classification of common line items"
          }
        }
      ]
    },
    {
      id: 'ratios',
      title: 'Ratio Analysis',
      icon: <Calculator className="w-6 h-6" />,
      color: 'bg-red-500',
      description: 'Liquidity, leverage, and profitability ratios',
      studyGuideUrl: 'https://docs.google.com/document/d/1oTHmSGT2CTJK1ykdpZePxaAS5ZUbMVKp_fTdpqOmFaE/edit#heading=h.ratios_section',
      excelTemplate: 'Ratio_Analysis_Template.xlsx',
      challenges: [
        {
          id: 'ratio1',
          title: 'Liquidity Analysis Challenge',
          difficulty: 'Intermediate',
          timeLimit: 300,
          type: 'calculation',
          module: 'Ratio Analysis',
          problem: "Company XYZ has: Current Assets $500K (including Inventory $150K), Current Liabilities $250K, Cash $75K. Calculate: (1) Current Ratio, (2) Quick Ratio, (3) Cash Ratio. Interpret the results.",
          hint: "Current = CA/CL, Quick = (CA-Inventory)/CL, Cash = Cash/CL",
          solution: "(1) 2.0, (2) 1.4, (3) 0.3. Good liquidity overall, but low cash position suggests dependence on converting inventory/receivables",
          excelFormula: "Current: =500/250, Quick: =(500-150)/250, Cash: =75/250",
          expectedAnswers: { current: 2.0, quick: 1.4, cash: 0.3 },
          tolerance: 0.1,
          learningPoints: [
            "Current ratio >2 is generally good for liquidity",
            "Quick ratio removes inventory (least liquid current asset)",
            "Cash ratio shows immediate liquidity without any conversion"
          ],
          preQuiz: [
            {
              question: "Which ratio provides the most conservative liquidity measure?",
              options: ["Current ratio", "Quick ratio", "Cash ratio", "Debt ratio"],
              correct: 2
            }
          ],
          aiPrompts: {
            hint: "Explain the three main liquidity ratios and how to interpret them. What do they tell us about a company's financial health?",
            deepDive: "liquidity ratios current quick cash ratio analysis financial health interpretation",
            model: "Build a liquidity ratio calculator with automatic interpretation and benchmarking"
          }
        }
      ]
    },
    {
      id: 'capbudget',
      title: 'Capital Budgeting',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-indigo-500',
      description: 'NPV, IRR, and investment decisions',
      studyGuideUrl: 'https://docs.google.com/document/d/1oTHmSGT2CTJK1ykdpZePxaAS5ZUbMVKp_fTdpqOmFaE/edit#heading=h.capbudget_section',
      excelTemplate: 'Capital_Budgeting_Template.xlsx',
      challenges: [
        {
          id: 'cap1',
          title: 'NPV vs IRR Decision',
          difficulty: 'Advanced',
          timeLimit: 480,
          type: 'decision',
          module: 'Capital Budgeting',
          problem: "Project Alpha: Initial cost $100K, Year 1: $50K, Year 2: $70K. Project Beta: Initial cost $80K, Year 1: $45K, Year 2: $50K. Both have 12% required return. Which project should you choose and why?",
          hint: "Calculate NPV for both projects, also consider scale differences",
          solution: "Alpha NPV = $6,468, Beta NPV = $4,006. Choose Alpha (higher NPV). Alpha IRR ≈ 15.1%, Beta IRR ≈ 16.1%. NPV rule prevails for mutually exclusive projects.",
          excelFormula: "Alpha: =NPV(0.12,50000,70000)-100000, Beta: =NPV(0.12,45000,50000)-80000",
          learningPoints: [
            "For mutually exclusive projects, use NPV rule",
            "IRR can be misleading due to scale and timing differences",
            "NPV directly measures value creation"
          ],
          preQuiz: [
            {
              question: "For mutually exclusive projects, which decision rule is preferred?",
              options: ["IRR", "NPV", "Payback period", "Profitability index"],
              correct: 1
            }
          ],
          aiPrompts: {
            hint: "Explain the difference between NPV and IRR decision rules. When might they give conflicting recommendations?",
            deepDive: "capital budgeting NPV IRR decision rules mutually exclusive projects comparison",
            model: "Create a capital budgeting analyzer comparing NPV vs IRR for multiple projects"
          }
        }
      ]
    }
  ];

  // Auto-grading function
  const gradeAnswer = (challenge, answer) => {
    if (challenge.type === 'calculation' && challenge.expectedAnswer) {
      const numericAnswer = parseFloat(answer.replace(/[,$%]/g, ''));
      const difference = Math.abs(numericAnswer - challenge.expectedAnswer);
      const percentDiff = (difference / challenge.expectedAnswer) * 100;
      
      if (percentDiff <= 1) {
        return { grade: 'excellent', message: '✔ Excellent! Within 1% of correct answer', score: 100 };
      } else if (percentDiff <= 5) {
        return { grade: 'good', message: '✔ Good! Within 5% of correct answer', score: 85 };
      } else if (percentDiff <= 10) {
        return { grade: 'fair', message: '⚠ Fair. Within 10% but needs improvement', score: 70 };
      } else {
        return { grade: 'poor', message: '✖ Off by more than 10%. Review the solution.', score: 40 };
      }
    }
    return null;
  };

  // Adaptive sequencing - sort challenges based on performance
  const getAdaptiveChallengeOrder = (challenges) => {
    return challenges.sort((a, b) => {
      const aAttempts = challengeAttempts[a.id] || { attempts: 0, avgScore: 0 };
      const bAttempts = challengeAttempts[b.id] || { attempts: 0, avgScore: 0 };
      
      // Prioritize failed challenges, then unattended, then lowest scores
      if (aAttempts.attempts === 0 && bAttempts.attempts === 0) return 0;
      if (aAttempts.attempts === 0) return 1;
      if (bAttempts.attempts === 0) return -1;
      
      return aAttempts.avgScore - bAttempts.avgScore;
    });
  };

  // Analytics calculations
  const getAnalytics = () => {
    const totalChallenges = challengeCategories.reduce((sum, cat) => sum + cat.challenges.length, 0);
    const moduleStats = challengeCategories.map(category => {
      const challenges = category.challenges;
      const completed = challenges.filter(c => completedChallenges.has(c.id)).length;
      const avgTime = challenges.reduce((sum, c) => {
        const attempts = challengeAttempts[c.id];
        return sum + (attempts ? attempts.avgTime : 0);
      }, 0) / challenges.length;
      const avgScore = challenges.reduce((sum, c) => {
        const attempts = challengeAttempts[c.id];
        return sum + (attempts ? attempts.avgScore : 0);
      }, 0) / challenges.length;
      
      return {
        module: category.title,
        completed,
        total: challenges.length,
        completionRate: (completed / challenges.length) * 100,
        avgTime: Math.round(avgTime),
        avgScore: Math.round(avgScore)
      };
    });
    
    return { totalChallenges, completedCount: completedChallenges.size, moduleStats };
  };

  const startChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setCurrentAnswer('');
    setShowSolution(false);
    setGradeResult(null);
    setShowPreQuiz(true);
    setPreQuizAnswers({});
    setReflectionText('');
    setShowReflection(false);
  };

  const startActualChallenge = () => {
    setShowPreQuiz(false);
    setTimeLeft(selectedChallenge.timeLimit);
    setIsTimerActive(true);
  };

  const submitAnswer = () => {
    if (selectedChallenge && currentAnswer.trim()) {
      const grade = gradeAnswer(selectedChallenge, currentAnswer);
      setGradeResult(grade);
      
      // Update attempt statistics
      const challengeId = selectedChallenge.id;
      const currentAttempts = challengeAttempts[challengeId] || { attempts: 0, scores: [], times: [] };
      const timeSpent = selectedChallenge.timeLimit - timeLeft;
      
      setChallengeAttempts(prev => ({
        ...prev,
        [challengeId]: {
          attempts: currentAttempts.attempts + 1,
          scores: [...currentAttempts.scores, grade?.score || 0],
          times: [...currentAttempts.times, timeSpent],
          avgScore: [...currentAttempts.scores, grade?.score || 0].reduce((a, b) => a + b, 0) / (currentAttempts.attempts + 1),
          avgTime: [...currentAttempts.times, timeSpent].reduce((a, b) => a + b, 0) / (currentAttempts.attempts + 1)
        }
      }));
    }
  };

  const completeChallenge = (challengeId) => {
    setCompletedChallenges(new Set([...completedChallenges, challengeId]));
    setIsTimerActive(false);
    setShowReflection(true);
  };

  const openAIPanel = (type, challenge) => {
    const prompts = challenge.aiPrompts;
    let content = '';
    
    switch(type) {
      case 'hint':
        content = `📝 Claude/ChatGPT Prompt:\n\n"${prompts.hint}"\n\n🔗 This would open a chat window with Claude or ChatGPT`;
        break;
      case 'deepDive':
        content = `🔍 Perplexity Labs Query:\n\n"${prompts.deepDive}"\n\n🔗 This would open: perplexity.ai/search?q=${encodeURIComponent(prompts.deepDive)}`;
        break;
      case 'model':
        content = `🧮 Julius AI Prompt:\n\n"${prompts.model}"\n\n🔗 This would create an embeddable Excel widget or chart`;
        break;
    }
    
    setAiPanelContent(content);
    setShowAIPanel(true);
  };

  const downloadTemplate = (templateName) => {
    // Mock download - in real implementation, this would trigger actual file download
    alert(`📁 Downloading ${templateName}...\n\nIn a real implementation, this would download the Excel template file.`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredCategories = challengeCategories.map(category => ({
    ...category,
    challenges: getAdaptiveChallengeOrder(category.challenges.filter(challenge => {
      const difficultyMatch = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty;
      const moduleMatch = filterModule === 'all' || challenge.module === filterModule;
      return difficultyMatch && moduleMatch;
    }))
  })).filter(category => category.challenges.length > 0);

  // Analytics View
  if (currentView === 'analytics') {
    const analytics = getAnalytics();
    
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <button 
            onClick={() => setCurrentView('challenges')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Challenges
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <Target className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{analytics.completedCount}/{analytics.totalChallenges}</div>
                <div className="text-gray-600">Challenges Complete</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <Award className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((analytics.completedCount / analytics.totalChallenges) * 100)}%
                </div>
                <div className="text-gray-600">Overall Progress</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <Calendar className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {Object.keys(challengeAttempts).length}
                </div>
                <div className="text-gray-600">Challenges Attempted</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Module Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Module</th>
                  <th className="text-center py-2">Completion</th>
                  <th className="text-center py-2">Avg Score</th>
                  <th className="text-center py-2">Avg Time</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.moduleStats.map((stat, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 font-medium">{stat.module}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${stat.completionRate}%`}}
                          ></div>
                        </div>
                        <span className="text-sm">{stat.completed}/{stat.total}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`font-bold ${
                        stat.avgScore >= 85 ? 'text-green-600' : 
                        stat.avgScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {stat.avgScore || 0}%
                      </span>
                    </td>
                    <td className="text-center">{stat.avgTime || 0}s</td>
                    <td className="text-center">
                      {stat.completionRate === 100 ? 
                        <span className="text-green-600">✓ Complete</span> :
                        stat.completionRate > 0 ? 
                        <span className="text-yellow-600">⚠ In Progress</span> :
                        <span className="text-gray-500">○ Not Started</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Suggested Study Plan</h3>
            <div className="space-y-3">
              {analytics.moduleStats
                .sort((a, b) => a.avgScore - b.avgScore)
                .slice(0, 3)
                .map((stat, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-yellow-50 rounded">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <div className="font-medium">Focus on {stat.module}</div>
                      <div className="text-sm text-gray-600">
                        {stat.avgScore < 70 ? 'Needs significant improvement' : 'Needs practice'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Upcoming Reviews</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-2">Spaced repetition schedule:</div>
              {Object.entries(challengeAttempts)
                .filter(([_, attempts]) => attempts.avgScore < 85)
                .slice(0, 3)
                .map(([challengeId, attempts], idx) => (
                  <div key={idx} className="flex items-center p-3 bg-blue-50 rounded">
                    <RefreshCw className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">Review {challengeId}</div>
                      <div className="text-sm text-gray-600">
                        Scheduled for {new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pre-Quiz Modal
  if (showPreQuiz && selectedChallenge) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Pre-Challenge Assessment</h2>
          <p className="text-gray-600 mb-6">Let's gauge your readiness for: <strong>{selectedChallenge.title}</strong></p>
          
          <div className="space-y-6">
            {selectedChallenge.preQuiz?.map((question, idx) => (
              <div key={idx} className="bg-white p-4 rounded border">
                <h4 className="font-bold mb-3">{question.question}</h4>
                <div className="space-y-2">
                  {question.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center">
                      <input
                        type="radio"
                        name={`preQuiz-${idx}`}
                        value={optIdx}
                        onChange={(e) => setPreQuizAnswers({
                          ...preQuizAnswers,
                          [idx]: parseInt(e.target.value)
                        })}
                        className="mr-3"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={startActualChallenge}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Start Challenge
            </button>
            <button
              onClick={() => setSelectedChallenge(null)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reflection Modal
  if (showReflection && selectedChallenge) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Challenge Reflection</h2>
          <p className="text-gray-600 mb-6">Take a moment to reflect on: <strong>{selectedChallenge.title}</strong></p>
          
          {gradeResult && (
            <div className={`p-4 rounded mb-4 ${
              gradeResult.grade === 'excellent' ? 'bg-green-100 text-green-800' :
              gradeResult.grade === 'good' ? 'bg-blue-100 text-blue-800' :
              gradeResult.grade === 'fair' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <div className="font-bold">{gradeResult.message}</div>
              <div className="text-sm mt-1">Score: {gradeResult.score}%</div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block font-bold mb-2">What was most challenging about this problem?</label>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="w-full h-24 p-3 border rounded"
              placeholder="Reflect on what you found difficult, what you learned, or what you'd do differently..."
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded mb-6">
            <h4 className="font-bold mb-2">💡 AI-Generated Study Tip:</h4>
            <p className="text-sm text-gray-700">
              "Based on your reflection, I'd recommend reviewing the {selectedChallenge.module} fundamentals, 
              particularly focusing on {selectedChallenge.learningPoints?.[0]?.toLowerCase()}. 
              Consider practicing similar problems daily for the next week."
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowReflection(false);
                setSelectedChallenge(null);
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Continue Learning
            </button>
            <button
              onClick={() => {
                // Schedule for spaced repetition (mock)
                alert('📅 This challenge has been scheduled for review in 2 days!');
                setShowReflection(false);
                setSelectedChallenge(null);
              }}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Schedule Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Challenge View
  if (selectedChallenge && !showPreQuiz && !showReflection) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="mb-6">
          <button 
            onClick={() => setSelectedChallenge(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Challenges
          </button>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedChallenge.title}</h2>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedChallenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    selectedChallenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedChallenge.difficulty}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {selectedChallenge.module}
                  </span>
                </div>
              </div>
              
              {timeLeft !== null && (
                <div className={`text-2xl font-mono ${timeLeft < 30 ? 'text-red-600' : 'text-gray-700'}`}>
                  <Clock className="w-5 h-5 inline mr-2" />
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded border-l-4 border-blue-500 mb-6">
              <h3 className="font-bold text-lg mb-2">Challenge Problem:</h3>
              <p className="text-gray-700 leading-relaxed">{selectedChallenge.problem}</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">Your Solution:</label>
                
                {selectedChallenge.type === 'classification' && selectedChallenge.multipleChoice ? (
                  <div className="space-y-4 mb-4">
                    {selectedChallenge.multipleChoice.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium mb-2">{item.item}:</div>
                        <div className="grid grid-cols-5 gap-2">
                          {item.options.map((option, optIdx) => (
                            <label key={optIdx} className="flex items-center text-sm">
                              <input
                                type="radio"
                                name={`classify-${idx}`}
                                value={optIdx}
                                className="mr-1"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-full h-32 p-3 border rounded-lg mb-4"
                    placeholder="Show your work and final answer..."
                  />
                )}
                
                {gradeResult && (
                  <div className={`p-3 rounded mb-4 ${
                    gradeResult.grade === 'excellent' ? 'bg-green-100 text-green-800' :
                    gradeResult.grade === 'good' ? 'bg-blue-100 text-blue-800' :
                    gradeResult.grade === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {gradeResult.message}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={submitAnswer}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Submit & Grade
                  </button>
                  
                  <button
                    onClick={() => completeChallenge(selectedChallenge.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Mark Complete
                  </button>
                  
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    {showSolution ? 'Hide' : 'Show'} Solution
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* AI Tool Launchers */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded border">
                  <h4 className="font-bold mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Study Tools
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => openAIPanel('hint', selectedChallenge)}
                      className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Get AI Hint
                    </button>
                    <button
                      onClick={() => openAIPanel('deepDive', selectedChallenge)}
                      className="w-full bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Deep Dive Research
                    </button>
                    <button
                      onClick={() => openAIPanel('model', selectedChallenge)}
                      className="w-full bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 flex items-center"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Model in Excel
                    </button>
                  </div>
                </div>

                {/* Study Resources */}
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold text-blue-800 mb-3">📚 Study Resources</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => window.open(challengeCategories.find(cat => 
                        cat.challenges.some(c => c.id === selectedChallenge.id)
                      )?.studyGuideUrl, '_blank')}
                      className="w-full text-left text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More in Study Guide
                    </button>
                    <button 
                      onClick={() => downloadTemplate(challengeCategories.find(cat => 
                        cat.challenges.some(c => c.id === selectedChallenge.id)
                      )?.excelTemplate)}
                      className="w-full text-left text-green-600 hover:text-green-800 text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Excel Template
                    </button>
                  </div>
                </div>
                
                {showSolution && (
                  <div className="bg-green-50 p-4 rounded border">
                    <h4 className="font-bold text-green-800 mb-2">✅ Solution:</h4>
                    <p className="text-green-700 mb-3 text-sm">{selectedChallenge.solution}</p>
                    
                    {selectedChallenge.excelFormula && (
                      <div className="bg-gray-100 p-3 rounded mb-3">
                        <h5 className="font-bold text-sm mb-1">Excel Formula:</h5>
                        <code className="text-xs">{selectedChallenge.excelFormula}</code>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="font-bold text-sm mb-2">Key Learning Points:</h5>
                      <ul className="text-xs space-y-1">
                        {selectedChallenge.learningPoints?.map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Panel Modal */}
        {showAIPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">AI Tool Integration</h3>
                <button 
                  onClick={() => setShowAIPanel(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded border">
                <pre className="whitespace-pre-wrap text-sm">{aiPanelContent}</pre>
              </div>
              <div className="mt-4 text-xs text-gray-600">
                💡 In a full implementation, this would integrate with actual AI services and open external tools.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Challenges Dashboard
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Kellogg ACF Learning Challenges</h1>
          <p className="text-gray-600">Enhanced interactive challenges with AI-powered study tools</p>
        </div>
        <button 
          onClick={() => setCurrentView('analytics')}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </button>
      </div>

      {/* Stats Overview */}
      <div className="flex justify-center items-center mb-6 space-x-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {challengeCategories.reduce((sum, cat) => sum + cat.challenges.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Challenges</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completedChallenges.size}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((completedChallenges.size / challengeCategories.reduce((sum, cat) => sum + cat.challenges.length, 0)) * 100) || 0}%
          </div>
          <div className="text-sm text-gray-600">Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{Object.keys(challengeAttempts).length}</div>
          <div className="text-sm text-gray-600">Attempted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Modules</option>
            {challengeCategories.map(cat => (
              <option key={cat.id} value={cat.title}>{cat.title}</option>
            ))}
          </select>
          
          <button
            onClick={() => {
              setFilterDifficulty('all');
              setFilterModule('all');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Challenge Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`${category.color} text-white p-4`}>
              <div className="flex items-center mb-2">
                {category.icon}
                <h3 className="text-xl font-bold ml-3">{category.title}</h3>
              </div>
              <p className="text-sm opacity-90">{category.description}</p>
              
              {/* Category-level actions */}
              <div className="flex items-center mt-3 space-x-2">
                <button 
                  onClick={() => window.open(category.studyGuideUrl, '_blank')}
                  className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded flex items-center"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Study Guide
                </button>
                <button 
                  onClick={() => downloadTemplate(category.excelTemplate)}
                  className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded flex items-center"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Templates
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {category.challenges.map((challenge) => {
                  const attempts = challengeAttempts[challenge.id];
                  const needsReview = attempts && attempts.avgScore < 85;
                  
                  return (
                    <div key={challenge.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                              challenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700