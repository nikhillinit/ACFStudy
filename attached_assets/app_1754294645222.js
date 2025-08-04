// Global state management
const AppState = {
    currentUser: localStorage.getItem('acf_user') || 'student',
    progress: JSON.parse(localStorage.getItem('acf_progress')) || {
        'Time Value of Money': { completed: [], accuracy: 0 },
        'Portfolio Theory': { completed: [], accuracy: 0 },
        'Bond Valuation': { completed: [], accuracy: 0 },
        'Financial Statements': { completed: [], accuracy: 0 },
        'Derivatives': { completed: [], accuracy: 0 }
    },
    diagnosticCompleted: localStorage.getItem('acf_diagnostic') === 'true',
    currentSession: null,
    problemIndex: 0,
    sessionScore: 0,
    startTime: null,
    currentProblem: null
};

// Financial Statements problems
const FINANCIAL_STATEMENTS_PROBLEMS = [
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
    {
        id: "fs-6",
        topic: "Financial Statements",
        difficulty: 1,
        question: "Received a utility bill for $800, will pay next month. Impact?",
        answer: "Liabilities +800 (Utilities Payable), Equity -800 (Expense)",
        solution: "Expense is recognized when incurred, not when paid. Creates payable liability.",
        concepts: ["Accrual Accounting", "Accounts Payable", "Utilities Expense"]
    },
    {
        id: "fs-7",
        topic: "Financial Statements",
        difficulty: 0,
        question: "Is prepaid insurance an asset or liability?",
        answer: "Asset",
        solution: "Asset - Payment provides a future benefit (insurance coverage).",
        concepts: ["Prepaid Expenses", "Current Assets"]
    },
    {
        id: "fs-8",
        topic: "Financial Statements",
        difficulty: 1,
        question: "Earned $5,000 service revenue on account. Impact?",
        answer: "Assets +5,000 (Accounts Receivable), Equity +5,000 (Revenue)",
        solution: "Recognize revenue when earned, increases receivables. Revenue increases retained earnings.",
        concepts: ["Revenue Recognition", "Accounts Receivable", "Service Revenue"]
    },
    {
        id: "fs-9",
        topic: "Financial Statements",
        difficulty: 1,
        question: "Paid off $3,000 of accounts payable with cash. Impact?",
        answer: "Assets -3,000 (Cash), Liabilities -3,000 (AP)",
        solution: "Settles liability without impacting equity. Both cash and accounts payable decrease.",
        concepts: ["Cash Payments", "Accounts Payable", "Balance Sheet"]
    },
    {
        id: "fs-10",
        topic: "Financial Statements",
        difficulty: 1,
        question: "Company declares dividends of $2,500. Immediate impact?",
        answer: "Liabilities +2,500 (Dividends Payable), Equity -2,500 (Retained Earnings)",
        solution: "Declaration creates obligation (liability) and reduces retained earnings immediately.",
        concepts: ["Dividends", "Retained Earnings", "Dividends Payable"]
    },
    {
        id: "fs-11",
        topic: "Financial Statements",
        difficulty: 1,
        question: "Office supplies purchased for $1,200 cash, used immediately. Impact?",
        answer: "Assets -1,200 (Cash), Equity -1,200 (Expense)",
        solution: "Expense recognized immediately since supplies are used. Cash decreases, expense reduces equity.",
        concepts: ["Supplies Expense", "Cash", "Immediate Recognition"]
    },
    {
        id: "fs-12",
        topic: "Financial Statements",
        difficulty: 2,
        question: "Depreciation expense of $4,000 recorded for equipment. Impact?",
        answer: "Assets -4,000 (Accumulated Depreciation), Equity -4,000 (Expense)",
        solution: "Reduces asset value through accumulated depreciation and equity through expense.",
        concepts: ["Depreciation", "Accumulated Depreciation", "Contra Asset"]
    },
    {
        id: "fs-13",
        topic: "Financial Statements",
        difficulty: 1,
        question: "Company issues $100,000 in common stock for cash. Impact?",
        answer: "Assets +100,000 (Cash), Equity +100,000 (Common Stock)",
        solution: "Increases both cash and stockholders' equity through stock issuance.",
        concepts: ["Common Stock", "Cash", "Stockholders Equity"]
    },
    {
        id: "fs-14",
        topic: "Financial Statements",
        difficulty: 2,
        question: "Accounts Receivable of $6,500 is written off as uncollectible. Impact?",
        answer: "Assets -6,500 (Accounts Receivable), Assets +6,500 (Allowance for Doubtful Accounts; net change is zero)",
        solution: "Only affects accounts within assets. If allowance method used, net impact on total assets is zero.",
        concepts: ["Bad Debt", "Allowance Method", "Accounts Receivable"]
    },
    {
        id: "fs-15",
        topic: "Financial Statements",
        difficulty: 2,
        question: "Machinery valued at $40,000 is reclassified as 'Assets Held for Sale.' Impact?",
        answer: "Assets: -40,000 (Machinery), +40,000 (Assets Held for Sale)",
        solution: "Change in asset category, total assets unchanged. Reclassification within asset categories.",
        concepts: ["Asset Classification", "Assets Held for Sale", "Reclassification"]
    }
];

// All problems combined
const ALL_PROBLEMS = [
    // Time Value of Money problems (25)
    {
        id: "tvm-1",
        topic: "Time Value of Money",
        difficulty: 0,
        question: "What is the present value of $3,000 received in 5 years at 8% annual interest?",
        answer: 2042.10,
        solution: "Step 1: Use PV formula: PV = FV / (1+r)^n\nStep 2: PV = 3000 / (1.08)^5\nStep 3: PV = 3000 / 1.4693 = $2,042.10",
        concepts: ["Present Value", "Discounting", "Time Value"]
    },
    {
        id: "tvm-2", 
        topic: "Time Value of Money",
        difficulty: 1,
        question: "What is the present value of an annuity paying $500 annually for 10 years at 6%?",
        answer: 3680.04,
        solution: "Step 1: Use PV annuity formula: PV = PMT × [1-(1+r)^-n]/r\nStep 2: PV = 500 × [1-(1.06)^-10]/0.06\nStep 3: PV = 500 × 7.3601 = $3,680.04",
        concepts: ["Annuity", "Present Value", "Cash Flow"]
    },
    {
        id: "tvm-3",
        topic: "Time Value of Money", 
        difficulty: 0,
        question: "What is the future value of $2,000 invested for 8 years at 7%?",
        answer: 3436.42,
        solution: "Step 1: Use FV formula: FV = PV × (1+r)^n\nStep 2: FV = 2000 × (1.07)^8\nStep 3: FV = 2000 × 1.7182 = $3,436.42",
        concepts: ["Future Value", "Compounding", "Growth"]
    },
    
    // Portfolio Theory problems (25)
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
    
    // Bond Valuation problems (25)
    {
        id: "bond-1", 
        topic: "Bond Valuation",
        difficulty: 1,
        question: "Bond with 5% coupon, 10 years maturity, $1000 face value, YTM 6%. What's the price?",
        answer: 926.40,
        solution: "Step 1: Annual coupon = $50\nStep 2: PV of coupons = 50 × [1-(1.06)^-10]/0.06 = $368.00\nStep 3: PV of principal = 1000/(1.06)^10 = $558.40\nStep 4: Bond price = $368.00 + $558.40 = $926.40",
        concepts: ["Bond Pricing", "YTM", "Present Value"]
    },
    {
        id: "bond-2",
        topic: "Bond Valuation", 
        difficulty: 2,
        question: "Calculate Macaulay duration for 3-year bond, 4% coupon, YTM 5%.",
        answer: 2.86,
        solution: "Step 1: Calculate present value of each cash flow\nStep 2: Weight each time period by PV of cash flow\nStep 3: Sum weighted times and divide by bond price\nStep 4: Duration = 2.86 years",
        concepts: ["Duration", "Bond Analytics", "Interest Rate Risk"]
    },
    
    // Add all Financial Statements problems
    ...FINANCIAL_STATEMENTS_PROBLEMS,
    
    // Derivatives problems (25)  
    {
        id: "deriv-1",
        topic: "Derivatives",
        difficulty: 0,
        question: "European call option, strike $100, stock price at expiration $120. What's the payoff?",
        answer: 20,
        solution: "Step 1: Call payoff = max(S - K, 0)\nStep 2: Payoff = max(120 - 100, 0)\nStep 3: Payoff = max(20, 0) = $20",
        concepts: ["Options", "Call Payoff", "Exercise Value"]
    },
    {
        id: "deriv-2",
        topic: "Derivatives",
        difficulty: 1,
        question: "Forward price for non-dividend stock, S0=$50, r=4%, T=2 years?",
        answer: 54.08,
        solution: "Step 1: Forward price F = S0 × e^(rT)\nStep 2: F = 50 × e^(0.04×2)\nStep 3: F = 50 × e^0.08 = 50 × 1.0833 = $54.08",
        concepts: ["Forward Pricing", "Arbitrage", "Cost of Carry"]
    }
];

// Core functionality
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Update progress when showing dashboard
    if (tabName === 'dashboard') {
        updateDashboard();
    }
}

function updateDashboard() {
    let totalCompleted = 0;
    let totalProblems = 0;
    
    // Update each topic progress
    Object.keys(AppState.progress).forEach(topic => {
        const progress = AppState.progress[topic];
        const completed = progress.completed.length;
        
        // Get total problems for this topic
        const topicProblems = ALL_PROBLEMS.filter(p => p.topic === topic);
        const total = topicProblems.length;
        
        totalCompleted += completed;
        totalProblems += total;
        
        // Update progress bars
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        
        switch(topic) {
            case 'Time Value of Money':
                document.getElementById('tvmProgress').style.width = percentage + '%';
                document.getElementById('tvmScore').textContent = completed;
                break;
            case 'Portfolio Theory':
                document.getElementById('portfolioProgress').style.width = percentage + '%';
                document.getElementById('portfolioScore').textContent = completed;
                break;
            case 'Bond Valuation':
                document.getElementById('bondProgress').style.width = percentage + '%';
                document.getElementById('bondScore').textContent = completed;
                break;
            case 'Financial Statements':
                document.getElementById('financialProgress').style.width = percentage + '%';
                document.getElementById('financialScore').textContent = completed;
                break;
        }
    });
    
    // Update overall stats
    const overallPercentage = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;
    document.getElementById('overallScore').textContent = overallPercentage + '%';
    document.getElementById('problemsSolved').textContent = totalCompleted;
    
    // Update streak (simplified)
    const streak = localStorage.getItem('acf_streak') || '0';
    document.getElementById('studyStreak').textContent = streak;
}

function startDiagnostic() {
    // Generate diagnostic test (5 problems per topic)
    const diagnosticProblems = [];
    
    ['Time Value of Money', 'Portfolio Theory', 'Bond Valuation', 'Financial Statements', 'Derivatives'].forEach(topic => {
        const topicProblems = ALL_PROBLEMS.filter(p => p.topic === topic);
        const selected = shuffleArray(topicProblems).slice(0, 5);
        diagnosticProblems.push(...selected);
    });
    
    AppState.currentSession = {
        type: 'diagnostic',
        problems: shuffleArray(diagnosticProblems),
        results: []
    };
    
    AppState.problemIndex = 0;
    AppState.sessionScore = 0;
    AppState.startTime = Date.now();
    
    // Hide intro, show test
    document.getElementById('diagnosticIntro').style.display = 'none';
    document.getElementById('diagnosticTest').style.display = 'block';
    
    displayCurrentProblem();
}

function startPractice(topic) {
    const topicProblems = ALL_PROBLEMS.filter(p => p.topic === topic);
    const adaptiveProblems = selectAdaptiveProblems(topic, topicProblems, 10);
    
    AppState.currentSession = {
        type: 'practice',
        topic: topic,
        problems: adaptiveProblems,
        results: []
    };
    
    AppState.problemIndex = 0;
    AppState.sessionScore = 0;
    AppState.startTime = Date.now();
    
    // Show practice tab and session
    showTab('practice');
    document.getElementById('practiceHome').style.display = 'none';
    document.getElementById('practiceSession').style.display = 'block';
    
    displayCurrentProblem();
}

function selectAdaptiveProblems(topic, problems, count) {
    const progress = AppState.progress[topic];
    const completed = progress.completed || [];
    
    // Prioritize unseen problems
    const unseen = problems.filter(p => !completed.includes(p.id));
    const review = problems.filter(p => completed.includes(p.id));
    
    // Mix: 70% unseen, 30% review
    const targetUnseen = Math.ceil(count * 0.7);
    const targetReview = count - targetUnseen;
    
    const selected = [
        ...shuffleArray(unseen).slice(0, Math.min(targetUnseen, unseen.length)),
        ...shuffleArray(review).slice(0, Math.min(targetReview, review.length))
    ];
    
    return shuffleArray(selected).slice(0, count);
}

function displayCurrentProblem() {
    const session = AppState.currentSession;
    if (!session || AppState.problemIndex >= session.problems.length) {
        endSession();
        return;
    }
    
    const problem = session.problems[AppState.problemIndex];
    AppState.currentProblem = problem;
    
    const container = session.type === 'diagnostic' ? 
        document.getElementById('diagnosticTest') : 
        document.getElementById('practiceSession');
        
    container.innerHTML = `
        <div class="problem-container">
            <div class="problem-header">
                <div class="problem-counter">
                    Problem ${AppState.problemIndex + 1} of ${session.problems.length}
                </div>
                <div class="timer" id="problemTimer">--:--</div>
            </div>
            
            <div class="question-box">
                <div class="question-text">${problem.question}</div>
                <input type="text" class="answer-input" id="userAnswer" placeholder="Enter your answer..." autocomplete="off">
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="checkAnswer()">Submit Answer</button>
                <button class="btn btn-warning" onclick="showHint(1)">Hint</button>
                ${session.type === 'practice' ? '<button class="btn btn-secondary" onclick="skipProblem()">Skip</button>' : ''}
            </div>
            
            <div id="feedback" class="feedback"></div>
            <div id="hints" class="hints-container"></div>
        </div>
    `;
    
    // Start timer
    startProblemTimer();
    
    // Focus on input
    document.getElementById('userAnswer').focus();
    
    // Enter key to submit
    document.getElementById('userAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}

function startProblemTimer() {
    const startTime = Date.now();
    const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timerElement = document.getElementById('problemTimer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            clearInterval(timer);
        }
    }, 1000);
}

function checkAnswer() {
    const userInput = document.getElementById('userAnswer').value.trim();
    const problem = AppState.currentProblem;
    
    if (!userInput) {
        alert('Please enter an answer');
        return;
    }
    
    const isCorrect = validateAnswer(userInput, problem.answer);
    
    // Record result
    AppState.currentSession.results.push({
        problemId: problem.id,
        correct: isCorrect,
        userAnswer: userInput,
        timeSpent: Date.now() - AppState.startTime
    });
    
    if (isCorrect) {
        AppState.sessionScore++;
    }
    
    showFeedback(isCorrect, problem);
}

function validateAnswer(userAnswer, correctAnswer) {
    // Handle numeric answers with tolerance
    if (typeof correctAnswer === 'number') {
        const userNum = parseFloat(userAnswer.replace(/[,$%]/g, ''));
        if (isNaN(userNum)) return false;
        const tolerance = Math.abs(correctAnswer) * 0.02; // 2% tolerance
        return Math.abs(userNum - correctAnswer) <= tolerance;
    }
    
    // Handle text answers (case insensitive)
    return userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) ||
           correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());
}

function showFeedback(isCorrect, problem) {
    const feedback = document.getElementById('feedback');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isCorrect) {
        feedback.innerHTML = `
            <h4>✅ Correct!</h4>
            <p>Great work! You got it right.</p>
            <div class="solution-box">
                <strong>Solution:</strong>
                <div class="solution-steps">${problem.solution.replace(/\n/g, '<br>')}</div>
            </div>
            <div style="margin-top: 15px;">
                <button class="btn btn-primary" onclick="nextProblem()">Next Problem</button>
            </div>
        `;
    } else {
        feedback.innerHTML = `
            <h4>❌ Incorrect</h4>
            <p>The correct answer is: <strong>${problem.answer}</strong></p>
            <div class="solution-box">
                <strong>Solution:</strong>
                <div class="solution-steps">${problem.solution.replace(/\n/g, '<br>')}</div>
            </div>
            <div style="margin-top: 15px;">
                <button class="btn btn-primary" onclick="nextProblem()">Next Problem</button>
            </div>
        `;
    }
    
    // Disable input and submit button
    document.getElementById('userAnswer').disabled = true;
    document.querySelector('.btn-primary').style.display = 'none';
}

function showHint(level) {
    const problem = AppState.currentProblem;
    const hintsContainer = document.getElementById('hints');
    
    // Generate progressive hints based on solution
    const solutionSteps = problem.solution.split('\n');
    const hints = [
        `💡 Hint 1: This problem involves ${problem.concepts.join(', ')}`,
        `💡 Hint 2: ${solutionSteps[0] || 'Start with the basic formula'}`,
        `💡 Hint 3: ${solutionSteps[1] || 'Substitute the given values'}`
    ];
    
    if (level <= hints.length) {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'hint visible';
        hintDiv.innerHTML = hints[level - 1];
        hintsContainer.appendChild(hintDiv);
    }
}

function nextProblem() {
    AppState.problemIndex++;
    displayCurrentProblem();
}

function skipProblem() {
    // Record as skipped
    AppState.currentSession.results.push({
        problemId: AppState.currentProblem.id,
        correct: false,
        userAnswer: 'skipped',
        timeSpent: Date.now() - AppState.startTime
    });
    
    nextProblem();
}

function endSession() {
    const session = AppState.currentSession;
    const score = AppState.sessionScore;
    const total = session.problems.length;
    const percentage = Math.round((score / total) * 100);
    
    // Update progress
    if (session.type === 'practice') {
        updateProgress(session.topic, session.results);
    } else if (session.type === 'diagnostic') {
        saveDiagnosticResults(session.results);
    }
    
    // Show results
    const container = session.type === 'diagnostic' ? 
        document.getElementById('diagnosticTest') : 
        document.getElementById('practiceSession');
        
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2>🎉 Session Complete!</h2>
            <div class="stats-summary" style="margin: 30px 0;">
                <div class="stat-number">${score}/${total}</div>
                <div class="stat-label">Problems Correct (${percentage}%)</div>
            </div>
            
            <div style="margin: 30px 0;">
                ${percentage >= 80 ? '🌟 Excellent work!' : 
                  percentage >= 60 ? '👍 Good progress!' : 
                  '💪 Keep practicing!'}
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="backToHome()">Back to Dashboard</button>
                ${session.type === 'practice' ? 
                  `<button class="btn btn-secondary" onclick="startPractice('${session.topic}')">Practice Again</button>` : 
                  ''}
            </div>
        </div>
    `;
}

function updateProgress(topic, results) {
    const progress = AppState.progress[topic];
    
    results.forEach(result => {
        if (result.correct && !progress.completed.includes(result.problemId)) {
            progress.completed.push(result.problemId);
        }
    });
    
    // Calculate accuracy
    const totalAttempts = results.length;
    const correctAttempts = results.filter(r => r.correct).length;
    progress.accuracy = correctAttempts / totalAttempts;
    
    // Save to localStorage
    localStorage.setItem('acf_progress', JSON.stringify(AppState.progress));
}

function saveDiagnosticResults(results) {
    localStorage.setItem('acf_diagnostic', 'true');
    localStorage.setItem('acf_diagnostic_results', JSON.stringify(results));
    AppState.diagnosticCompleted = true;
    
    // Update progress for all topics
    const topicResults = {};
    results.forEach(result => {
        const problem = ALL_PROBLEMS.find(p => p.id === result.problemId);
        if (problem) {
            if (!topicResults[problem.topic]) {
                topicResults[problem.topic] = [];
            }
            topicResults[problem.topic].push(result);
        }
    });
    
    Object.keys(topicResults).forEach(topic => {
        updateProgress(topic, topicResults[topic]);
    });
}

function backToHome() {
    // Reset session
    AppState.currentSession = null;
    AppState.problemIndex = 0;
    AppState.sessionScore = 0;
    
    // Show appropriate home view
    showTab('dashboard');
    
    // Reset practice/diagnostic views
    document.getElementById('practiceHome').style.display = 'block';
    document.getElementById('practiceSession').style.display = 'none';
    document.getElementById('diagnosticIntro').style.display = 'block';
    document.getElementById('diagnosticTest').style.display = 'none';
}

// Utility functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    
    // Show diagnostic recommendation if not completed
    if (!AppState.diagnosticCompleted) {
        setTimeout(() => {
            if (confirm('Would you like to take the diagnostic test to get personalized recommendations?')) {
                showTab('diagnostic');
            }
        }, 2000);
    }
});
