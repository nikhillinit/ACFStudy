  // Render Enhanced Home
  const renderEnhancedHome = () => {
    const metrics = calculatePerformanceMetrics();
    const dueReviews = spacedRepetitionItems.filter(item => 
      new Date(item.nextReview) <= new Date()
    ).length;

    return (
      <div className="space-y-6 pb-20">
        {/* Enhanced User Stats Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 text-white shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{userProfile.avatar}</div>
              <div>
                <h2 className="font-bold text-lg">{userProfile.name}</h2>
                <p className="text-sm opacity-90">Level {userProfile.level} • {userProfile.totalXP} XP</p>
                <p className="text-xs opacity-75">Predicted Score: {metrics.predictedExamScore}%</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Flame className="w-5 h-5" />
                <span className="font-bold">{userProfile.streak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-5 h-5 text-yellow-300" />
                <span className="font-bold">{userProfile.coins}</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-5 h-5 text-pink-300" />
                <span className="font-bold">{Math.round(metrics.accuracy)}%</span>
              </div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500 ease-out"
              style={{ width: `${(userProfile.xp / userProfile.xpToNextLevel) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-right opacity-90">
            {userProfile.xp}/{userProfile.xpToNextLevel} XP to Level {userProfile.level + 1}
          </p>
        </div>

        {/* Smart Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Recommendations
          </h3>
          
          {/* Due Reviews Alert */}
          {dueReviews > 0 && (
            <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">{dueReviews} Concepts Due for Review</p>
                    <p className="text-sm text-gray-600">Maintain your knowledge!</p>
                  </div>
                </div>
                <button
                  onClick={() => startSpacedRepetitionSession(
                    spacedRepetitionItems.filter(item => new Date(item.nextReview) <= new Date())
                  )}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium"
                >
                  Review Now
                </button>
              </div>
            </div>
          )}

          {/* Adaptive Practice Recommendation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => startAdaptivePractice()}
              className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-bold">Adaptive Practice</p>
                  <p className="text-sm opacity-90">AI-selected questions</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('video-lesson')}
              className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3">
                <Video className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-bold">Video Lessons</p>
                  <p className="text-sm opacity-90">Interactive learning</p>
                </div>
              </div>
            </button>
          </div>

          {/* Weak Areas */}
          {metrics.weakTopics.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Focus Areas:</p>
              <div className="flex flex-wrap gap-2">
                {metrics.weakTopics.map(topic => topic && (
                  <button
                    key={topic.id}
                    onClick={() => startAdaptivePractice(topic.id)}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm"
                  >
                    {topic.emoji} {topic.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Performance Snapshot */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Performance Snapshot
            </span>
            <button
              onClick={() => setActiveSection('analytics')}
              className="text-sm text-blue-600 dark:text-blue-400"
            >
              View Details →
            </button>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(metrics.accuracy)}%
              </div>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(metrics.retention)}%
              </div>
              <p className="text-sm text-gray-600">Retention</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${metrics.velocity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.velocity > 0 ? '+' : ''}{Math.round(metrics.velocity)}%
              </div>
              <p className="text-sm text-gray-600">Improvement</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.floor(metrics.totalStudyTime / 3600)}h
              </div>
              <p className="text-sm text-gray-600">Study Time</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveSection('ai-tutor')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <Bot className="w-8 h-8 mb-2" />
            <p className="font-bold">AI Tutor</p>
            <p className="text-sm opacity-90">Get help</p>
          </button>
          
          <button
            onClick={() => setActiveSection('formulas')}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <Calculator className="w-8 h-8 mb-2" />
            <p className="font-bold">Formulas</p>
            <p className="text-sm opacity-90">Quick reference</p>
          </button>
        </div>

        {/* Study Path Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Your Learning Journey</h3>
          <div className="relative">
            {/* Progress Path */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-600" />
            
            {topics.map((topic, index) => {
              const mastery = userProfile.performanceData.topicMastery[topic.id];
              const isUnlocked = userProfile.level >= topic.unlockLevel;
              const isCompleted = mastery?.masteryLevel >= 80;
              
              return (
                <div key={topic.id} className="relative flex items-center mb-6 last:mb-0">
                  {/* Node */}
                  <div className={`
                    relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-green-500' : isUnlocked ? 'bg-blue-500' : 'bg-gray-300'}
                    shadow-lg transform transition-all
                    ${isUnlocked ? 'hover:scale-110 cursor-pointer' : ''}
                  `}
                  onClick={() => isUnlocked && handleTopicClick(topic)}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : isUnlocked ? (
                      <span className="text-2xl">{topic.emoji}</span>
                    ) : (
                      <Lock className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className={`ml-4 flex-1 p-4 rounded-xl ${
                    isUnlocked ? 'bg-gray-50 dark:bg-gray-700' : 'opacity-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{topic.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                        {!isUnlocked && (
                          <p className="text-xs text-gray-500 mt-1">
                            Unlocks at Level {topic.unlockLevel}
                          </p>
                        )}
                      </div>
                      {isUnlocked && mastery && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{Math.round(mastery.masteryLevel)}%</p>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(mastery.masteryLevel / 20) 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render Enhanced Learn
  const renderEnhancedLearn = () => {
    if (!selectedTopic) {
      return (
        <div className="space-y-4 pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Choose a Topic to Learn</h2>
            <button
              onClick={() => setActiveSection('home')}
              className="text-gray-600 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {topics.filter(topic => userProfile.level >= topic.unlockLevel).map(topic => {
              const mastery = userProfile.performanceData.topicMastery[topic.id];
              
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{topic.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{topic.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {topic.estimatedTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart className="w-3 h-3" />
                          Difficulty: {topic.difficulty}/5
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {mastery ? `${Math.round(mastery.masteryLevel)}%` : '0%'} complete
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    const topic = topics.find(t => t.id === selectedTopic);
    const topicVideos = videoLessonsData.filter(v => v.topicId === selectedTopic);

    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-xl font-bold">{topic?.name}</h2>
          <button
            onClick={() => exportToAnki(selectedTopic)}
            className="text-gray-600 dark:text-gray-400"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Learning Modules */}
        <div className="space-y-4">
          {/* Video Lessons */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" />
              Video Lessons
            </h3>
            <div className="space-y-3">
              {topicVideos.map(video => (
                <button
                  key={video.id}
                  onClick={() => loadVideoLesson(video.id)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.floor(video.duration / 60)} min • {video.embeddedQuizzes.length} quizzes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {video.watchedPercentage > 0 && (
                        <div className="w-12 h-12 relative">
                          <svg className="transform -rotate-90 w-12 h-12">
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              className="text-gray-300"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={`${video.watchedPercentage * 1.26} 126`}
                              className="text-green-500"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                            {video.watchedPercentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-500" />
              Interactive Learning
            </h3>
            {renderInteractiveLearningContent(selectedTopic)}
          </div>

          {/* Practice Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => startAdaptivePractice(selectedTopic)}
              className="p-4 bg-blue-600 text-white rounded-xl font-medium shadow-lg"
            >
              <Brain className="w-6 h-6 mb-1" />
              Adaptive Practice
            </button>
            <button
              onClick={() => startQuiz(selectedTopic)}
              className="p-4 bg-green-600 text-white rounded-xl font-medium shadow-lg"
            >
              <Target className="w-6 h-6 mb-1" />
              Quick Quiz
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Interactive Learning Content
  const renderInteractiveLearningContent = (topicId: string) => {
    const content: { [key: string]: JSX.Element } = {
      tvm: (
        <div className="space-y-6">
          {/* Interactive TVM Calculator */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Interactive TVM Calculator</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Present Value</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter PV"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Interest Rate (%)</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter rate"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Time Periods</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter periods"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">
                Calculate FV
              </button>
              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Future Value:</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </div>
          </div>

          {/* Key Concepts with Animations */}
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
              <h4 className="font-medium mb-2">💡 Key Insight</h4>
              <p className="text-sm">Money today is worth more than money tomorrow due to opportunity cost!</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-xl">
              <h4 className="font-medium mb-2">📐 Core Formula</h4>
              <p className="font-mono text-sm">FV = PV × (1 + r)^n</p>
              <p className="text-xs mt-1 text-gray-600">Where r = interest rate, n = number of periods</p>
            </div>
          </div>
        </div>
      ),
      portfolio: (
        <div className="space-y-6">
          {/* Portfolio Visualizer */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Portfolio Risk-Return Visualizer</h3>
            <div className="h-48 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Interactive efficient frontier chart</p>
            </div>
          </div>

          {/* Diversification Demo */}
          <div className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 p-4 rounded-xl">
            <h4 className="font-medium mb-2">🎯 Diversification Effect</h4>
            <p className="text-sm mb-2">See how correlation affects portfolio risk:</p>
            <div className="space-y-2">
              <label className="text-xs">Correlation: <span className="font-mono">0.5</span></label>
              <input type="range" min="-100" max="100" className="w-full" />
              <p className="text-xs">Portfolio Risk: <span className="font-bold">12.5%</span></p>
            </div>
          </div>
        </div>
      ),
      bonds: (
        <div className="space-y-6">
          {/* Bond Price Calculator */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Bond Price Calculator</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs">Face Value</label>
                <input type="number" className="w-full p-2 rounded border text-sm" placeholder="1000" />
              </div>
              <div>
                <label className="text-xs">Coupon Rate (%)</label>
                <input type="number" className="w-full p-2 rounded border text-sm" placeholder="5" />
              </div>
              <div>
                <label className="text-xs">Years to Maturity</label>
                <input type="number" className="w-full p-2 rounded border text-sm" placeholder="10" />
              </div>
              <div>
                <label className="text-xs">YTM (%)</label>
                <input type="number" className="w-full p-2 rounded border text-sm" placeholder="6" />
              </div>
            </div>
            <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg text-sm font-medium">
              Calculate Bond Price
            </button>
          </div>

          {/* Duration Visualizer */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
            <h4 className="font-medium mb-2">⏱️ Duration Concept</h4>
            <p className="text-sm">Duration measures bond price sensitivity to interest rate changes</p>
          </div>
        </div>
      )
    };

    return content[topicId] || <div className="text-center text-gray-400">Content coming soon...</div>;
  };

  // Render Enhanced Practice
  const renderEnhancedPractice = () => {
    return (
      <div className="space-y-6 pb-20">
        <h2 className="text-2xl font-bold mb-4">Practice Arena</h2>
        
        {/* Practice Modes */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => startAdaptivePractice()}
            className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <Brain className="w-8 h-8 mb-2" />
            <p className="font-bold">Adaptive Practice</p>
            <p className="text-xs opacity-90">AI-powered</p>
          </button>
          
          <button
            onClick={() => {
              const items = spacedRepetitionItems.filter(item => 
                new Date(item.nextReview) <= new Date()
              );
              if (items.length > 0) {
                startSpacedRepetitionSession(items);
              } else {
                setNotifications(prev => [...prev, {
                  id: Date.now(),
                  type: 'info',
                  message: 'No items due for review!'
                }]);
              }
            }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <RotateCcw className="w-8 h-8 mb-2" />
            <p className="font-bold">Spaced Review</p>
            <p className="text-xs opacity-90">Retain knowledge</p>
          </button>
          
          <button
            onClick={() => startComprehensiveExam()}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <FileText className="w-8 h-8 mb-2" />
            <p className="font-bold">Mock Exam</p>
            <p className="text-xs opacity-90">Full test</p>
          </button>
          
          <button
            onClick={() => {/* Speed round */}}
            className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <Zap className="w-8 h-8 mb-2" />
            <p className="font-bold">Speed Round</p>
            <p className="text-xs opacity-90">60 second blitz</p>
          </button>
        </div>

        {/* Topic Selection with Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Practice by Topic</h3>
          <div className="space-y-2">
            {topics.filter(t => userProfile.level >= t.unlockLevel).map(topic => {
              const mastery = userProfile.performanceData.topicMastery[topic.id];
              const isCompleted = mastery?.masteryLevel >= 80;
              
              return (
                <button
                  key={topic.id}
                  onClick={() => startAdaptivePractice(topic.id)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.emoji}</span>
                      <div className="text-left">
                        <p className="font-medium">{topic.name}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>{mastery ? `${Math.round(mastery.masteryLevel)}%` : '0%'} mastered</span>
                          {mastery && (
                            <>
                              <span>•</span>
                              <span>{mastery.questionsAttempted} questions</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <Check className="w-5 h-5 text-green-500" />}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Difficulty Progress */}
                  {mastery && (
                    <div className="mt-2 grid grid-cols-4 gap-1">
                      {(['easy', 'medium', 'hard', 'expert'] as const).map(diff => (
                        <div key={diff} className="text-center">
                          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                diff === 'easy' ? 'bg-green-500' :
                                diff === 'medium' ? 'bg-yellow-500' :
                                diff === 'hard' ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${mastery.difficultyProgress[diff]}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1 capitalize">{diff}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Continue in next part...