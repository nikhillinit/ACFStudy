  // Render Analytics
  const renderAnalytics = () => {
    const metrics = calculatePerformanceMetrics();
    const { topicMastery, questionHistory, streakData } = userProfile.performanceData;

    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <button
            onClick={() => setActiveSection('home')}
            className="text-gray-600 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics View Tabs */}
        <div className="flex gap-2 mb-4">
          {(['overview', 'detailed', 'predictions'] as const).map(view => (
            <button
              key={view}
              onClick={() => setAnalyticsView(view)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                analyticsView === view
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        {analyticsView === 'overview' && (
          <>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Accuracy</span>
                  <Target className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-600">{Math.round(metrics.accuracy)}%</div>
                <div className="text-xs text-gray-500 mt-1">
                  {questionHistory.filter(q => q.correct).length}/{questionHistory.length} correct
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Learning Velocity</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className={`text-3xl font-bold ${metrics.velocity > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {metrics.velocity > 0 ? '+' : ''}{Math.round(metrics.velocity)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {metrics.velocity > 0 ? 'Improving' : 'Needs attention'}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Retention Rate</span>
                  <Brain className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-600">{Math.round(metrics.retention)}%</div>
                <div className="text-xs text-gray-500 mt-1">Knowledge retained</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Study Time</span>
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {Math.floor(metrics.totalStudyTime / 3600)}h
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(metrics.averageSessionLength / 60)} min avg session
                </div>
              </div>
            </div>

            {/* Topic Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Topic Mastery</h3>
              <div className="space-y-3">
                {topics.map(topic => {
                  const mastery = topicMastery[topic.id];
                  if (!mastery) return null;

                  return (
                    <div key={topic.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{topic.emoji}</span>
                          <span className="text-sm font-medium">{topic.name}</span>
                        </span>
                        <span className="text-sm font-bold">{Math.round(mastery.masteryLevel)}%</span>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            mastery.masteryLevel >= 80 ? 'bg-green-500' :
                            mastery.masteryLevel >= 60 ? 'bg-yellow-500' :
                            mastery.masteryLevel >= 40 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${mastery.masteryLevel}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{mastery.questionsAttempted} questions</span>
                        <span>Last: {new Date(mastery.lastPracticed).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Streak Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Study Streak</h3>
              <div className="grid grid-cols-7 gap-1">
                {/* Calendar visualization would go here */}
                <div className="text-center text-xs text-gray-500">S</div>
                <div className="text-center text-xs text-gray-500">M</div>
                <div className="text-center text-xs text-gray-500">T</div>
                <div className="text-center text-xs text-gray-500">W</div>
                <div className="text-center text-xs text-gray-500">T</div>
                <div className="text-center text-xs text-gray-500">F</div>
                <div className="text-center text-xs text-gray-500">S</div>
                {/* Actual calendar days */}
                {[...Array(28)].map((_, i) => (
                  <div 
                    key={i}
                    className={`aspect-square rounded flex items-center justify-center text-xs ${
                      Math.random() > 0.3 ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold">{userProfile.streak} Day Streak! 🔥</p>
                <p className="text-sm text-gray-600">Best: {userProfile.longestStreak} days</p>
              </div>
            </div>
          </>
        )}

        {analyticsView === 'detailed' && (
          <>
            {/* Difficulty Progression */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Difficulty Progression</h3>
              {Object.entries(topicMastery).map(([topicId, mastery]) => {
                const topic = topics.find(t => t.id === topicId);
                if (!topic) return null;

                return (
                  <div key={topicId} className="mb-4">
                    <p className="font-medium mb-2">{topic.name}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {(['easy', 'medium', 'hard', 'expert'] as const).map(diff => (
                        <div key={diff} className="text-center">
                          <div className="mb-1">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700">
                              <span className="text-sm font-bold">
                                {Math.round(mastery.difficultyProgress[diff])}%
                              </span>
                            </div>
                          </div>
                          <p className="text-xs capitalize">{diff}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Response Time Analysis</h3>
              <div className="space-y-3">
                {topics.map(topic => {
                  const mastery = topicMastery[topic.id];
                  if (!mastery) return null;

                  const avgTime = Math.round(mastery.averageTime);
                  const targetTime = 120; // 2 minutes
                  const efficiency = Math.min(100, (targetTime / avgTime) * 100);

                  return (
                    <div key={topic.id} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>{topic.emoji}</span>
                        <span className="text-sm">{topic.name}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{avgTime}s avg</span>
                        <div className={`text-sm px-2 py-1 rounded ${
                          efficiency >= 80 ? 'bg-green-100 text-green-700' :
                          efficiency >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {Math.round(efficiency)}% efficient
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Concept Weaknesses */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Areas for Improvement</h3>
              <div className="space-y-2">
                {userProfile.performanceData.weakConcepts.slice(0, 5).map(concept => (
                  <div key={concept} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium">{concept}</span>
                    <button className="text-sm text-red-600 hover:underline">
                      Practice →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {analyticsView === 'predictions' && (
          <>
            {/* Exam Score Prediction */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-2">Predicted Exam Score</h3>
              <div className="text-5xl font-bold mb-2">{metrics.predictedExamScore}%</div>
              <p className="text-sm opacity-90">Based on your current performance</p>
              <div className="mt-4 bg-white/20 rounded-lg p-3">
                <p className="text-sm">Confidence interval: {metrics.predictedExamScore - 5}% - {metrics.predictedExamScore + 5}%</p>
              </div>
            </div>

            {/* Readiness by Topic */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Exam Readiness by Topic</h3>
              <div className="space-y-3">
                {topics.map(topic => {
                  const mastery = topicMastery[topic.id];
                  if (!mastery) return null;

                  const readiness = mastery.masteryLevel >= 80 ? 'Ready' :
                                   mastery.masteryLevel >= 60 ? 'Almost Ready' :
                                   mastery.masteryLevel >= 40 ? 'Needs Work' :
                                   'Not Ready';

                  return (
                    <div key={topic.id} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>{topic.emoji}</span>
                        <span className="text-sm font-medium">{topic.name}</span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        readiness === 'Ready' ? 'bg-green-100 text-green-700' :
                        readiness === 'Almost Ready' ? 'bg-yellow-100 text-yellow-700' :
                        readiness === 'Needs Work' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {readiness}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Study Plan Recommendation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Recommended Study Plan</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium text-sm mb-1">Next 7 Days Focus:</p>
                  <ul className="space-y-1 text-sm">
                    {metrics.weakTopics.slice(0, 3).map(topic => topic && (
                      <li key={topic.id} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" />
                        {topic.name} - {topic.estimatedTime} min/day
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                    Generate Detailed Study Plan
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Render Formula Sheet
  const renderFormulaSheet = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredFormulas = formulaSheet.filter(formula => {
      const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formula.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || formula.tags.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Formula Reference</h2>
          <button
            onClick={() => setActiveSection('home')}
            className="text-gray-600 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search formulas..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <button
              onClick={() => exportToAnki()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'tvm', 'portfolio', 'bonds', 'ratios', 'capital'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Formula Cards */}
        <div className="space-y-4">
          {filteredFormulas.map(formula => (
            <div key={formula.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{formula.name}</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <BookMarked className="w-5 h-5" />
                </button>
              </div>
              
              {/* Formula Display */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3 font-mono text-lg">
                {formula.formula}
              </div>
              
              {/* Variables */}
              <div className="mb-3">
                <p className="font-medium text-sm mb-1">Where:</p>
                <div className="space-y-1">
                  {formula.variables.map(variable => (
                    <p key={variable.symbol} className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-mono font-bold">{variable.symbol}</span> = {variable.meaning}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Usage */}
              <div className="mb-3">
                <p className="font-medium text-sm mb-1">Usage:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formula.usage}</p>
              </div>
              
              {/* Examples */}
              <details className="cursor-pointer">
                <summary className="font-medium text-sm mb-2">Examples ({formula.examples.length})</summary>
                <div className="space-y-2 mt-2">
                  {formula.examples.map((example, i) => (
                    <div key={i} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="text-sm font-medium">{example.description}</p>
                      <p className="text-sm font-mono mt-1">{example.calculation}</p>
                    </div>
                  ))}
                </div>
              </details>
              
              {/* Tags */}
              <div className="flex gap-2 mt-3">
                {formula.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Enhanced Profile
  const renderEnhancedProfile = () => {
    const metrics = calculatePerformanceMetrics();

    return (
      <div className="space-y-6 pb-20">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{userProfile.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="opacity-90">Level {userProfile.level} Finance Master</p>
              <p className="text-sm opacity-75">Predicted Score: {metrics.predictedExamScore}%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-sm opacity-90">Total XP</p>
              <p className="text-xl font-bold">{userProfile.totalXP}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-sm opacity-90">Best Streak</p>
              <p className="text-xl font-bold">{userProfile.longestStreak} days</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl font-bold text-green-600">{Math.round(metrics.accuracy)}%</p>
            <p className="text-xs text-gray-600">Accuracy</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl font-bold text-blue-600">{quizHistory.length}</p>
            <p className="text-xs text-gray-600">Quizzes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl font-bold text-purple-600">{Math.floor(metrics.totalStudyTime / 3600)}h</p>
            <p className="text-xs text-gray-600">Study Time</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Sound Effects
              </span>
              <input 
                type="checkbox" 
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Haptic Feedback
              </span>
              <input 
                type="checkbox" 
                checked={hapticEnabled}
                onChange={(e) => setHapticEnabled(e.target.checked)}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Dark Mode
              </span>
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <WifiOff className="w-5 h-5" />
                Offline Mode
              </span>
              <input 
                type="checkbox" 
                checked={offlineMode}
                onChange={(e) => {
                  setOfflineMode(e.target.checked);
                  if (e.target.checked) saveOfflineData();
                }}
                className="toggle"
              />
            </label>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Export & Backup</h3>
          <div className="space-y-2">
            <button
              onClick={() => exportToAnki()}
              className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              Export All to Anki
            </button>
            <button className="w-full p-3 bg-gray-600 text-white rounded-lg font-medium">
              Backup Progress
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Continue in next part...