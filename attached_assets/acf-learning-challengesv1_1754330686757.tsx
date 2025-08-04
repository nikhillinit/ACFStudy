import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Target, TrendingUp, BookOpen, Calculator, BarChart3, DollarSign, Zap } from 'lucide-react';

const ACFLearningChallenges = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

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

  const challengeCategories = [
    {
      id: 'tvm',
      title: 'Time Value of Money',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Master PV, FV, and compound interest calculations',
      challenges: [
        {
          id: 'tvm1',
          title: 'Quick TVM Challenge',
          difficulty: 'Beginner',
          timeLimit: 180,
          type: 'calculation',
          problem: "You can invest $5,000 today at 7% annual interest, compounded annually. What will it be worth in 8 years?",
          hint: "Use the Future Value formula: FV = PV × (1 + r)^n",
          solution: "$8,589.93 (using FV = 5,000 × (1.07)^8 = 5,000 × 1.7182 = $8,591)",
          excelFormula: "=FV(0.07, 8, 0, -5000)",
          learningPoints: [
            "Always match the compounding frequency with the rate",
            "Use negative PV in Excel when calculating FV",
            "Double-check your exponent calculation"
          ]
        },
        {
          id: 'tvm2',
          title: 'Compounding Frequency Impact',
          difficulty: 'Intermediate',
          timeLimit: 300,
          type: 'comparison',
          problem: "Compare the future value of $10,000 invested for 5 years at 8% annual rate under: (a) Annual compounding, (b) Monthly compounding, (c) Daily compounding",
          hint: "Use EAR formula: (1 + r/m)^m - 1, then apply to FV calculation",
          solution: "(a) $14,693.28 (b) $14,898.46 (c) $14,918.25. Notice diminishing returns from more frequent compounding.",
          excelFormula: "Annual: =FV(0.08,5,0,-10000) | Monthly: =FV(0.08/12,60,0,-10000)",
          learningPoints: [
            "More frequent compounding increases returns but with diminishing effect",
            "The difference between daily and continuous compounding is minimal",
            "For monthly compounding, divide rate by 12 and multiply periods by 12"
          ]
        }
      ]
    },
    {
      id: 'portfolio',
      title: 'Portfolio Theory',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Expected returns, risk, and diversification',
      challenges: [
        {
          id: 'port1',
          title: 'Portfolio Return Challenge',
          difficulty: 'Beginner',
          timeLimit: 240,
          type: 'calculation',
          problem: "Create a portfolio with 35% in Stock A (expected return 12%), 45% in Stock B (expected return 8%), and 20% in Stock C (expected return 15%). What is the portfolio's expected return?",
          hint: "Portfolio return = Σ(weight × expected return)",
          solution: "E(Rp) = 0.35(12%) + 0.45(8%) + 0.20(15%) = 4.2% + 3.6% + 3.0% = 10.8%",
          excelFormula: "=SUMPRODUCT({0.35;0.45;0.20},{0.12;0.08;0.15})",
          learningPoints: [
            "Portfolio return is always a weighted average of individual returns",
            "Weights must sum to 100%",
            "Use SUMPRODUCT in Excel for portfolio calculations"
          ]
        },
        {
          id: 'port2',
          title: 'Risk Reduction through Diversification',
          difficulty: 'Advanced',
          timeLimit: 420,
          type: 'analysis',
          problem: "Two stocks: A (σ=25%, E(R)=15%) and B (σ=20%, E(R)=10%). If correlation = -0.3, find the minimum variance portfolio weights and its risk level.",
          hint: "Minimum variance occurs when derivative of portfolio variance = 0",
          solution: "Weight in A = 39.1%, Weight in B = 60.9%, Portfolio σ = 13.8%. The negative correlation provides significant risk reduction.",
          excelFormula: "Use Solver to minimize portfolio variance formula",
          learningPoints: [
            "Negative correlation provides the best diversification benefit",
            "Minimum variance portfolio may not be the optimal risk-return portfolio",
            "Portfolio risk can be less than the lowest individual asset risk"
          ]
        }
      ]
    },
    {
      id: 'bonds',
      title: 'Bond Valuation',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'Pricing, yields, and duration concepts',
      challenges: [
        {
          id: 'bond1',
          title: 'Bond Pricing Challenge',
          difficulty: 'Intermediate',
          timeLimit: 360,
          type: 'calculation',
          problem: "A corporate bond has a face value of $1,000, pays a 6% annual coupon, and matures in 4 years. If the current market yield is 7%, what is the bond's price?",
          hint: "Bond price = PV of coupons + PV of face value",
          solution: "$966.88. The bond trades at a discount because the coupon rate (6%) < market yield (7%)",
          excelFormula: "=PV(0.07, 4, 60, 1000) or =PRICE(settlement, maturity, 0.06, 0.07, 100, 1)",
          learningPoints: [
            "When yield > coupon rate, bond trades at discount",
            "When yield < coupon rate, bond trades at premium",
            "Bond prices move inverse to interest rates"
          ]
        }
      ]
    },
    {
      id: 'statements',
      title: 'Financial Statements',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'Balance sheet and income statement analysis',
      challenges: [
        {
          id: 'stmt1',
          title: 'Statement Classification Speed Round',
          difficulty: 'Beginner',
          timeLimit: 180,
          type: 'classification',
          problem: "Classify these items as Current Asset (CA), Non-Current Asset (NCA), Current Liability (CL), Non-Current Liability (NCL), or Equity (E): Accounts Payable, Equipment, Cash, Long-term Debt, Retained Earnings, Inventory, Patents",
          hint: "Current = within one year, consider the one-year rule",
          solution: "Accounts Payable (CL), Equipment (NCA), Cash (CA), Long-term Debt (NCL), Retained Earnings (E), Inventory (CA), Patents (NCA)",
          learningPoints: [
            "Current items are due/collected within one year",
            "Equipment and patents are long-term assets",
            "Retained earnings represent accumulated profits"
          ]
        }
      ]
    },
    {
      id: 'ratios',
      title: 'Ratio Analysis',
      icon: <Calculator className="w-6 h-6" />,
      color: 'bg-red-500',
      description: 'Liquidity, leverage, and profitability ratios',
      challenges: [
        {
          id: 'ratio1',
          title: 'Liquidity Analysis Challenge',
          difficulty: 'Intermediate',
          timeLimit: 300,
          type: 'calculation',
          problem: "Company XYZ has: Current Assets $500K (including Inventory $150K), Current Liabilities $250K, Cash $75K. Calculate: (1) Current Ratio, (2) Quick Ratio, (3) Cash Ratio. Interpret the results.",
          hint: "Current = CA/CL, Quick = (CA-Inventory)/CL, Cash = Cash/CL",
          solution: "(1) 2.0, (2) 1.4, (3) 0.3. Good liquidity overall, but low cash position suggests dependence on converting inventory/receivables",
          excelFormula: "Current: =500/250, Quick: =(500-150)/250, Cash: =75/250",
          learningPoints: [
            "Current ratio >2 is generally good for liquidity",
            "Quick ratio removes inventory (least liquid current asset)",
            "Cash ratio shows immediate liquidity without any conversion"
          ]
        }
      ]
    },
    {
      id: 'capbudget',
      title: 'Capital Budgeting',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-indigo-500',
      description: 'NPV, IRR, and investment decisions',
      challenges: [
        {
          id: 'cap1',
          title: 'NPV vs IRR Decision',
          difficulty: 'Advanced',
          timeLimit: 480,
          type: 'decision',
          problem: "Project Alpha: Initial cost $100K, Year 1: $50K, Year 2: $70K. Project Beta: Initial cost $80K, Year 1: $45K, Year 2: $50K. Both have 12% required return. Which project should you choose and why?",
          hint: "Calculate NPV for both projects, also consider scale differences",
          solution: "Alpha NPV = $6,468, Beta NPV = $4,006. Choose Alpha (higher NPV). Alpha IRR ≈ 15.1%, Beta IRR ≈ 16.1%. NPV rule prevails for mutually exclusive projects.",
          excelFormula: "Alpha: =NPV(0.12,50000,70000)-100000, Beta: =NPV(0.12,45000,50000)-80000",
          learningPoints: [
            "For mutually exclusive projects, use NPV rule",
            "IRR can be misleading due to scale and timing differences",
            "NPV directly measures value creation"
          ]
        }
      ]
    }
  ];

  const startChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setCurrentAnswer('');
    setShowSolution(false);
    setTimeLeft(challenge.timeLimit);
    setIsTimerActive(true);
  };

  const completeChallenge = (challengeId) => {
    setCompletedChallenges(new Set([...completedChallenges, challengeId]));
    setIsTimerActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedChallenge) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
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
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  selectedChallenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  selectedChallenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedChallenge.difficulty}
                </span>
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
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Solution:</label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg"
                  placeholder="Show your work and final answer..."
                />
                
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                  >
                    {showSolution ? 'Hide' : 'Show'} Solution
                  </button>
                  
                  <button
                    onClick={() => completeChallenge(selectedChallenge.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold text-blue-800 mb-2">💡 Hint:</h4>
                  <p className="text-blue-700">{selectedChallenge.hint}</p>
                </div>
                
                {showSolution && (
                  <div className="bg-green-50 p-4 rounded border">
                    <h4 className="font-bold text-green-800 mb-2">✅ Solution:</h4>
                    <p className="text-green-700 mb-3">{selectedChallenge.solution}</p>
                    
                    {selectedChallenge.excelFormula && (
                      <div className="bg-gray-100 p-3 rounded">
                        <h5 className="font-bold text-sm mb-1">Excel Formula:</h5>
                        <code className="text-sm">{selectedChallenge.excelFormula}</code>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h5 className="font-bold text-sm mb-2">Key Learning Points:</h5>
                      <ul className="text-sm space-y-1">
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
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Kellogg ACF Learning Challenges</h1>
        <p className="text-gray-600">Interactive challenges to master your ACF exam topics</p>
        
        <div className="flex justify-center items-center mt-4 space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{challengeCategories.reduce((sum, cat) => sum + cat.challenges.length, 0)}</div>
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
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challengeCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`${category.color} text-white p-4`}>
              <div className="flex items-center mb-2">
                {category.icon}
                <h3 className="text-xl font-bold ml-3">{category.title}</h3>
              </div>
              <p className="text-sm opacity-90">{category.description}</p>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {category.challenges.map((challenge) => (
                  <div key={challenge.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                            challenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {challenge.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {Math.floor(challenge.timeLimit / 60)}m
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-2">
                        {completedChallenges.has(challenge.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => startChallenge(challenge)}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      {completedChallenges.has(challenge.id) ? 'Review Challenge' : 'Start Challenge'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Challenge Strategy Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold mb-2">📈 Progressive Difficulty</h4>
            <p className="text-gray-600 text-sm">Start with Beginner challenges to build confidence, then advance to Intermediate and Advanced levels.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">⏱️ Time Management</h4>
            <p className="text-gray-600 text-sm">Each challenge has a time limit similar to ACF exam conditions. Practice working under pressure!</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">🧮 Excel Integration</h4>
            <p className="text-gray-600 text-sm">Most challenges include Excel formulas - practice these as they're crucial for the ACF exam.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">🎯 Focus Areas</h4>
            <p className="text-gray-600 text-sm">Complete all challenges in your weakest topic areas first, then reinforce your strengths.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ACFLearningChallenges;