  // Render Enhanced Quiz
  const renderEnhancedQuiz = () => {
    if (!currentQuiz) return null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Quiz Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">{currentQuiz.title}</h3>
            <button
              onClick={() => {
                if (confirm('Exit quiz? Progress will be lost!')) {
                  setActiveSection('practice');
                  setCurrentQuiz(null);
                }
              }}
              className="text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Timer and Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className={`font-mono ${timerSeconds < 60 ? 'text-red-600' : ''}`}>
                {formatTime(timerSeconds)}
              </span>
            </div>
            
            {/* Combo Indicator */}
            {comboMultiplier > 1 && (
              <div className="flex items-center gap-1 text-orange-600 animate-pulse">
                <Flame className="w-4 h-4" />
                <span className="font-bold">{comboMultiplier}x Combo!</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {Object.keys(quizAnswers).length}/{currentQuiz.questions.length}
              </span>
            </div>
          </div>
          
          {/* Question Progress Dots */}
          <div className="flex gap-1 mt-3 overflow-x-auto">
            {currentQuiz.questions.map((q: any, idx: number) => (
              <div
                key={q.id}
                className={`w-2 h-2 rounded-full ${
                  quizAnswers[q.id] !== undefined 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quiz Content */}
        <div className="p-4 pb-24 max-w-4xl mx-auto">
          {!showResults ? (
            // Questions
            <div className="space-y-6">
              {currentQuiz.questions.map((question: EnhancedQuestion, qIndex: number) => (
                <div 
                  key={question.id} 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-fade-in"
                >
                  {/* Question */}
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {qIndex + 1}
                      </span>
                      <p className="font-medium text-lg flex-1">{question.question}</p>
                    </div>
                    
                    {/* Difficulty Badge & Concepts */}
                    <div className="flex items-center gap-2 ml-11">
                      {question.difficulty && (
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          question.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {question.difficulty}
                        </span>
                      )}
                      {question.concepts && question.concepts.map(concept => (
                        <span key={concept} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded text-xs">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => {
                          handleAnswerSelect(question.id, oIndex);
                          playSound('click');
                          triggerHaptic('light');
                        }}
                        className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-[1.02] ${
                          quizAnswers[question.id] === oIndex
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            quizAnswers[question.id] === oIndex
                              ? 'border-white bg-white'
                              : 'border-gray-400'
                          }`}>
                            {quizAnswers[question.id] === oIndex && (
                              <div className="w-3 h-3 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Hint & Solution Buttons */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      {question.hints && question.hints.length > 0 && (
                        <button
                          onClick={() => {
                            const hintsUsed = currentHints[question.id] || 0;
                            if (hintsUsed < question.hints.length) {
                              setCurrentHints({
                                ...currentHints,
                                [question.id]: hintsUsed + 1
                              });
                              setCurrentHint(question.hints[hintsUsed]);
                              // Deduct coins
                              setUserProfile(prev => ({
                                ...prev,
                                coins: Math.max(0, prev.coins - 5)
                              }));
                            }
                          }}
                          className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"
                        >
                          <Lightbulb className="w-4 h-4" />
                          Hint ({(currentHints[question.id] || 0)}/{question.hints.length})
                        </button>
                      )}
                      
                      {question.detailedSolution && (
                        <button
                          onClick={() => {
                            setShowSolutionSteps({
                              ...showSolutionSteps,
                              [question.id]: !showSolutionSteps[question.id]
                            });
                            // Deduct coins for solution
                            if (!showSolutionSteps[question.id]) {
                              setUserProfile(prev => ({
                                ...prev,
                                coins: Math.max(0, prev.coins - 10)
                              }));
                            }
                          }}
                          className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1"
                        >
                          <PenTool className="w-4 h-4" />
                          {showSolutionSteps[question.id] ? 'Hide' : 'Show'} Solution
                        </button>
                      )}
                    </div>
                    
                    {/* AI Tutor button */}
                    <button
                      onClick={() => {
                        setAiTutorActive(true);
                        askAITutor(`Help me with: ${question.question}`);
                      }}
                      className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1"
                    >
                      <Bot className="w-4 h-4" />
                      Ask AI
                    </button>
                  </div>
                  
                  {/* Show current hint */}
                  {currentHint && currentHints[question.id] && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
                      <p className="text-yellow-700 dark:text-yellow-300">💡 {currentHint}</p>
                    </div>
                  )}
                  
                  {/* Show solution steps */}
                  {showSolutionSteps[question.id] && question.detailedSolution && (
                    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-medium mb-3">Step-by-Step Solution:</h4>
                      {question.detailedSolution.map(step => (
                        <div key={step.step} className="mb-3 pl-4 border-l-2 border-purple-300">
                          <p className="font-medium text-sm mb-1">Step {step.step}: {step.description}</p>
                          {step.formula && (
                            <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded mb-1">
                              {step.formula}
                            </p>
                          )}
                          {step.calculation && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {step.calculation}
                            </p>
                          )}
                          <p className="text-sm text-gray-700 dark:text-gray-300">{step.explanation}</p>
                          {step.tip && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              💡 Pro tip: {step.tip}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Submit Button */}
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < currentQuiz.questions.length}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                  Object.keys(quizAnswers).length < currentQuiz.questions.length
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-[1.02]'
                }`}
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            // Results with detailed feedback
            renderEnhancedQuizResults()
          )}
        </div>
      </div>
    );
  };

  // Render Enhanced Quiz Results
  const renderEnhancedQuizResults = () => {
    const score = calculateScore();
    const total = currentQuiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    const isPerfect = score === total;
    const passed = percentage >= 80;
    
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Score Card */}
        <div className={`
          bg-gradient-to-br text-white rounded-2xl p-8 text-center shadow-2xl
          ${isPerfect ? 'from-yellow-400 to-yellow-600' :
            passed ? 'from-green-400 to-green-600' :
            'from-orange-400 to-red-600'}
        `}>
          <div className="text-6xl font-bold mb-2">{percentage}%</div>
          <div className="text-2xl mb-4">{score}/{total} Correct</div>
          <div className="text-lg">
            {isPerfect ? '🌟 PERFECT SCORE! 🌟' :
             passed ? '✅ Great job! You passed!' :
             '📚 Keep practicing!'}
          </div>
        </div>
        
        {/* XP and Rewards */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Rewards Earned</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Experience Points
              </span>
              <span className="font-bold text-lg">+{quizHistory[quizHistory.length - 1]?.xpEarned || 0} XP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                Coins
              </span>
              <span className="font-bold text-lg">+{quizHistory[quizHistory.length - 1]?.coinsEarned || 0}</span>
            </div>
            {comboMultiplier > 1 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Combo Bonus
                </span>
                <span className="font-bold text-lg">{comboMultiplier}x</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Detailed Review */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Review Answers</h3>
          <div className="space-y-4">
            {currentQuiz.questions.map((question: EnhancedQuestion, idx: number) => {
              const userAnswer = quizAnswers[question.id];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div 
                  key={question.id}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                    'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? 
                      <Check className="w-5 h-5 text-green-600 mt-1" /> :
                      <X className="w-5 h-5 text-red-600 mt-1" />
                    }
                    <div className="flex-1">
                      <p className="font-medium mb-2">{idx + 1}. {question.question}</p>
                      
                      {/* Show correct/incorrect answers */}
                      {!isCorrect && (
                        <>
                          <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                            Your answer: {question.options[userAnswer]}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                            Correct answer: {question.options[question.correct]}
                          </p>
                        </>
                      )}
                      
                      {/* Explanation */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                      
                      {/* Common Mistakes */}
                      {!isCorrect && question.commonMistakes && question.commonMistakes.length > 0 && (
                        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-sm font-medium mb-1">Common Mistakes to Avoid:</p>
                          <ul className="list-disc list-inside text-sm">
                            {question.commonMistakes.map((mistake, i) => (
                              <li key={i}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Related Topics */}
                      {question.concepts && (
                        <div className="mt-2 flex gap-2">
                          {question.concepts.map(concept => (
                            <span key={concept} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Recommended Next Steps</h3>
          <div className="space-y-3">
            {/* Weak concepts */}
            {userProfile.performanceData.weakConcepts.length > 0 && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="font-medium text-sm mb-2">Focus on these concepts:</p>
                <div className="flex gap-2 flex-wrap">
                  {userProfile.performanceData.weakConcepts.slice(0, 3).map(concept => (
                    <button key={concept} className="px-3 py-1 bg-orange-200 dark:bg-orange-800 rounded-full text-sm">
                      {concept}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* AI Recommendations */}
            <div className="flex gap-3">
              <button
                onClick={() => startAdaptivePractice()}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium"
              >
                <Brain className="w-5 h-5 inline mr-2" />
                Adaptive Practice
              </button>
              <button
                onClick={() => setActiveSection('video-lesson')}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium"
              >
                <Video className="w-5 h-5 inline mr-2" />
                Watch Lessons
              </button>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setActiveSection('practice');
              setCurrentQuiz(null);
            }}
            className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-medium"
          >
            Back to Practice
          </button>
          <button
            onClick={() => startQuiz(currentQuiz.topicId)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  // Helper functions
  const calculateScore = () => {
    if (!currentQuiz) return 0;
    return currentQuiz.questions.reduce((score: number, question: any) => {
      return score + (quizAnswers[question.id] === question.correct ? 1 : 0);
    }, 0);
  };

  const handleTopicClick = (topic: any) => {
    setSelectedTopic(topic.id);
    setActiveSection('learn');
    triggerHaptic('light');
    playSound('click');
  };

  const startQuiz = (topicId: string, mode = 'practice') => {
    const questions = expandedQuestionBank[topicId] || [];
    if (questions.length > 0) {
      const selectedQuestions = questions.slice(0, 10); // Select 10 questions
      setCurrentQuiz({ 
        title: `${topics.find(t => t.id === topicId)?.name} Quiz`,
        questions: selectedQuestions,
        topicId, 
        mode 
      });
      setQuizAnswers({});
      setShowResults(false);
      setTimerSeconds(mode === 'exam' ? 900 : 300);
      setIsTimerRunning(true);
      setActiveSection('quiz');
      setComboMultiplier(1);
      setCurrentHints({});
      setShowSolutionSteps({});
      playSound('click');
      triggerHaptic('medium');
    }
  };

  const startComprehensiveExam = () => {
    // Create comprehensive exam
    const examQuestions: EnhancedQuestion[] = [];
    Object.entries(expandedQuestionBank).forEach(([topicId, questions]) => {
      const selectedQs = questions.slice(0, 5).map(q => ({
        ...q,
        topicId,
        id: `${topicId}-${q.id}`
      }));
      examQuestions.push(...selectedQs);
    });
    
    const shuffled = examQuestions.sort(() => Math.random() - 0.5);
    
    setCurrentQuiz({
      title: "Comprehensive ACF Exam",
      questions: shuffled.slice(0, 30), // 30 question exam
      topicId: 'comprehensive',
      mode: 'exam'
    });
    setQuizAnswers({});
    setShowResults(false);
    setTimerSeconds(1800); // 30 minutes
    setIsTimerRunning(true);
    setActiveSection('quiz');
    playSound('click');
    triggerHaptic('medium');
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
    
    // Update combo if answering in sequence
    const now = Date.now();
    if (lastCorrectTime && now - lastCorrectTime < 10000) { // Within 10 seconds
      setComboMultiplier(prev => Math.min(prev + 0.5, 5)); // Max 5x combo
    }
    setLastCorrectTime(now);
  };

  const handleQuizSubmit = () => {
    setIsTimerRunning(false);
    setShowResults(true);
    
    const score = calculateScore();
    const totalQuestions = currentQuiz.questions.length;
    const accuracy = score / totalQuestions;
    
    // Calculate XP rewards
    let xpEarned = 10; // Base XP
    xpEarned += score * 5; // 5 XP per correct answer
    
    if (accuracy >= 0.8) xpEarned += 20; // Bonus for high accuracy
    if (accuracy === 1) xpEarned += 30; // Perfect score bonus
    
    // Time bonus
    const timeBonus = Math.max(0, Math.floor((300 - (300 - timerSeconds)) / 10));
    xpEarned += timeBonus;
    
    // Add XP and coins
    addXP(xpEarned);
    const coinsEarned = Math.floor(xpEarned / 3);
    setUserProfile(prev => ({
      ...prev,
      coins: prev.coins + coinsEarned
    }));
    
    // Update quiz history
    const history = {
      topicId: currentQuiz.topicId,
      score,
      total: totalQuestions,
      date: new Date().toISOString(),
      timeSpent: (currentQuiz.mode === 'exam' ? 900 : 300) - timerSeconds,
      mode: currentQuiz.mode,
      xpEarned,
      coinsEarned,
      accuracy
    };
    
    setQuizHistory([...quizHistory, history]);
    
    // Update completed topics if passed
    if (accuracy >= 0.8) {
      setCompletedTopics(prev => ({
        ...prev,
        [currentQuiz.topicId]: true
      }));
    }
    
    // Update performance data
    currentQuiz.questions.forEach((question: EnhancedQuestion, index: number) => {
      const isCorrect = quizAnswers[question.id] === question.correct;
      const attempt: QuestionAttempt = {
        questionId: question.id,
        topicId: currentQuiz.topicId,
        correct: isCorrect,
        timeSpent: 30, // Approximate
        hintsUsed: currentHints[question.id] || 0,
        attemptNumber: 1,
        timestamp: new Date().toISOString(),
        difficultyLevel: question.difficulty,
        concepts: question.concepts
      };
      
      setUserProfile(prev => ({
        ...prev,
        performanceData: {
          ...prev.performanceData,
          questionHistory: [...prev.performanceData.questionHistory, attempt]
        }
      }));
    });
    
    // Save offline data
    saveOfflineData();
  };

  // Mobile navigation
  const renderMobileNav = () => {
    const navItems = [
      { id: 'home', icon: Brain, label: 'Learn' },
      { id: 'practice', icon: Target, label: 'Practice' },
      { id: 'analytics', icon: BarChart3, label: 'Stats' },
      { id: 'formulas', icon: Calculator, label: 'Formulas' },
      { id: 'profile', icon: User, label: 'Profile' }
    ];
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  triggerHaptic('light');
                  playSound('click');
                }}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div 
      className={`min-h-screen ${darkMode ? 'dark' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        {/* Header */}
        {activeSection !== 'quiz' && activeSection !== 'adaptive-practice' && activeSection !== 'video-lesson' && (
          <div className="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">ACF Exam Master</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveSection('ai-tutor')}
                  className="p-2"
                >
                  <Bot className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    const isOnline = !offlineMode;
                    setOfflineMode(!offlineMode);
                    if (!isOnline) saveOfflineData();
                  }}
                  className="p-2"
                >
                  {offlineMode ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2"
                >
                  {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="max-w-md mx-auto p-4">
          {renderContent()}
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && activeSection !== 'quiz' && activeSection !== 'adaptive-practice' && renderMobileNav()}
        
        {/* Celebrations */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="transform scale-0 animate-bounce bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">🎉</div>
                <h2 className="text-2xl font-bold mb-2">Level Up!</h2>
                <p className="text-gray-600 dark:text-gray-300">You're now level {userProfile.level}!</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Notifications */}
        <div className="fixed top-20 right-4 space-y-2 z-40">
          {notifications.slice(-3).map(notif => (
            <div 
              key={notif.id}
              className={`p-3 rounded-lg shadow-lg animate-slide-in ${
                notif.type === 'success' ? 'bg-green-500' :
                notif.type === 'error' ? 'bg-red-500' :
                notif.type === 'info' ? 'bg-blue-500' :
                'bg-gray-500'
              } text-white`}
            >
              <p className="text-sm">{notif.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced topic structure with concepts
const topics = [
  { 
    id: 'tvm', 
    name: 'Time Value of Money', 
    icon: Clock, 
    color: 'blue',
    emoji: '⏰',
    description: 'Present value, future value, and discounting',
    difficulty: 2,
    estimatedTime: 45,
    unlockLevel: 1,
    concepts: ['Present Value', 'Future Value', 'Discount Rate', 'Compounding', 'Time Periods']
  },
  { 
    id: 'portfolio', 
    name: 'Portfolio Theory', 
    icon: TrendingUp, 
    color: 'green',
    emoji: '📈',
    description: 'Expected returns, risk, and diversification',
    difficulty: 3,
    estimatedTime: 60,
    unlockLevel: 2,
    concepts: ['Expected Return', 'Risk', 'Diversification', 'Correlation', 'Efficient Frontier']
  },
  { 
    id: 'bonds', 
    name: 'Investment Returns & Bonds', 
    icon: Calculator, 
    color: 'purple',
    emoji: '💰',
    description: 'Bond valuation, YTM, and holding period returns',
    difficulty: 3,
    estimatedTime: 55,
    unlockLevel: 3,
    concepts: ['Bond Pricing', 'Yield to Maturity', 'Duration', 'Current Yield', 'Holding Period Return']
  },
  { 
    id: 'balance', 
    name: 'Balance Sheet', 
    icon: FileText, 
    color: 'orange',
    emoji: '📊',
    description: 'Assets, liabilities, equity classification',
    difficulty: 2,
    estimatedTime: 40,
    unlockLevel: 1,
    concepts: ['Current Assets', 'Long-term Assets', 'Liabilities', 'Equity', 'Working Capital']
  },
  { 
    id: 'statements', 
    name: 'Financial Statement Links', 
    icon: BookOpen, 
    color: 'red',
    emoji: '📚',
    description: 'Income statement to balance sheet connections',
    difficulty: 3,
    estimatedTime: 50,
    unlockLevel: 4,
    concepts: ['Net Income', 'Retained Earnings', 'Cash Flow', 'Accruals', 'Depreciation']
  },
  { 
    id: 'excel', 
    name: 'Excel for Finance', 
    icon: BarChart, 
    color: 'cyan',
    emoji: '📊',
    description: 'Financial functions and modeling',
    difficulty: 2,
    estimatedTime: 35,
    unlockLevel: 2,
    concepts: ['PV Function', 'FV Function', 'PMT Function', 'NPV Function', 'SUMPRODUCT']
  },
  { 
    id: 'annuities', 
    name: 'Annuities & Perpetuities', 
    icon: RefreshCw, 
    color: 'pink',
    emoji: '🔄',
    description: 'Regular payment streams and valuation',
    difficulty: 3,
    estimatedTime: 45,
    unlockLevel: 5,
    concepts: ['Ordinary Annuity', 'Annuity Due', 'Perpetuity', 'Growing Annuity', 'Payment Streams']
  },
  { 
    id: 'ratios', 
    name: 'Ratio Analysis', 
    icon: Target, 
    color: 'yellow',
    emoji: '🎯',
    description: 'Liquidity and leverage ratios',
    difficulty: 2,
    estimatedTime: 40,
    unlockLevel: 3,
    concepts: ['Current Ratio', 'Quick Ratio', 'Debt-to-Equity', 'Interest Coverage', 'Working Capital']
  },
  { 
    id: 'capital', 
    name: 'Capital Budgeting', 
    icon: Award, 
    color: 'indigo',
    emoji: '🏆',
    description: 'NPV, IRR, and project evaluation',
    difficulty: 4,
    estimatedTime: 65,
    unlockLevel: 6,
    concepts: ['Net Present Value', 'Internal Rate of Return', 'Payback Period', 'Profitability Index', 'MIRR']
  }
];

export default ACFExamMasterEnhanced;