  // Render Adaptive Practice
  const renderAdaptivePractice = () => {
    if (!adaptiveSession || !adaptiveSession.questionsPool.length) {
      return <div>Loading adaptive practice...</div>;
    }

    const currentQuestion = adaptiveSession.questionsPool[adaptiveSession.currentIndex];
    const progress = ((adaptiveSession.currentIndex + 1) / adaptiveSession.questionsPool.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Adaptive Practice</h3>
            <button
              onClick={() => {
                if (confirm('Exit practice? Progress will be saved.')) {
                  completeAdaptiveSession();
                }
              }}
              className="text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress and Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(studyTime)}
              </span>
              <span className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                Adaptive Score: {adaptiveSession.adaptiveScore}
              </span>
            </div>
            <span>{adaptiveSession.currentIndex + 1}/{adaptiveSession.questionsPool.length}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-4 max-w-4xl mx-auto">
          {showResults ? (
            renderAdaptiveResults()
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              {/* Difficulty Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  currentQuestion.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                </span>
                <div className="flex items-center gap-2">
                  {currentQuestion.concepts.map(concept => (
                    <span key={concept} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded text-xs">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <p className="text-lg font-medium">{currentQuestion.question}</p>
                {currentQuestion.visualAids && currentQuestion.visualAids.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {/* Render visual aids */}
                    <p className="text-sm text-gray-600">Visual aid: {currentQuestion.visualAids[0].caption}</p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const startTime = Date.now();
                      setQuizAnswers({ ...quizAnswers, [currentQuestion.id]: index });
                      const timeSpent = (Date.now() - startTime) / 1000;
                      handleAdaptiveAnswer(currentQuestion.id, index, timeSpent);
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-[1.02] ${
                      quizAnswers[currentQuestion.id] === index
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        quizAnswers[currentQuestion.id] === index
                          ? 'border-white bg-white'
                          : 'border-gray-400'
                      }`}>
                        {quizAnswers[currentQuestion.id] === index && (
                          <div className="w-3 h-3 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Hints Section */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {currentQuestion.hints.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const hintsUsed = currentHints[currentQuestion.id] || 0;
                        if (hintsUsed <= index) {
                          setCurrentHints({
                            ...currentHints,
                            [currentQuestion.id]: index + 1
                          });
                          setCurrentHint(currentQuestion.hints[index]);
                          // Deduct coins for hint
                          setUserProfile(prev => ({
                            ...prev,
                            coins: Math.max(0, prev.coins - 5)
                          }));
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        (currentHints[currentQuestion.id] || 0) > index
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4 inline mr-1" />
                      Hint {index + 1}
                    </button>
                  ))}
                </div>
                
                {/* AI Tutor Help */}
                <button
                  onClick={() => {
                    const response = askAITutor(
                      `Help me understand this question: ${currentQuestion.question}`,
                      { isStruggling: (currentHints[currentQuestion.id] || 0) > 0 }
                    );
                    setCurrentHint(response.hints[0]);
                  }}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  <Bot className="w-4 h-4" />
                  Ask AI Tutor
                </button>
              </div>

              {/* Show current hint */}
              {currentHint && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <Lightbulb className="w-4 h-4 inline mr-1" />
                    {currentHint}
                  </p>
                </div>
              )}

              {/* Show Solution Steps (if requested) */}
              {showSolutionSteps[currentQuestion.id] && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Solution Steps:</h4>
                  {currentQuestion.detailedSolution.map(step => (
                    <div key={step.step} className="mb-3">
                      <p className="font-medium text-sm">Step {step.step}: {step.description}</p>
                      {step.formula && (
                        <p className="font-mono text-sm mt-1 text-gray-600">{step.formula}</p>
                      )}
                      {step.calculation && (
                        <p className="text-sm mt-1 text-gray-600">{step.calculation}</p>
                      )}
                      <p className="text-sm mt-1 text-gray-700">{step.explanation}</p>
                      {step.tip && (
                        <p className="text-sm mt-1 text-green-600">💡 Tip: {step.tip}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Adaptive Results
  const renderAdaptiveResults = () => {
    const results = calculateSessionResults();
    const metrics = calculatePerformanceMetrics();

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Score Card */}
        <div className={`
          bg-gradient-to-br text-white rounded-2xl p-8 text-center shadow-2xl
          ${results.accuracy >= 0.9 ? 'from-yellow-400 to-yellow-600' :
            results.accuracy >= 0.7 ? 'from-green-400 to-green-600' :
            'from-orange-400 to-red-600'}
        `}>
          <div className="text-6xl font-bold mb-2">{Math.round(results.accuracy * 100)}%</div>
          <div className="text-2xl mb-4">{results.correct}/{results.total} Correct</div>
          <div className="text-lg">
            Adaptive Score: {adaptiveSession?.adaptiveScore || 0}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Performance Insights</h3>
          
          {/* Concept Analysis */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Concept Mastery:</h4>
            <div className="space-y-2">
              {Object.entries(
                adaptiveSession?.questionsPool.reduce((acc, q) => {
                  q.concepts.forEach(concept => {
                    if (!acc[concept]) acc[concept] = { total: 0, correct: 0 };
                    acc[concept].total++;
                    const attempt = userProfile.performanceData.questionHistory
                      .find(h => h.questionId === q.id);
                    if (attempt?.correct) acc[concept].correct++;
                  });
                  return acc;
                }, {} as { [key: string]: { total: number; correct: number } }) || {}
              ).map(([concept, stats]) => (
                <div key={concept} className="flex items-center justify-between">
                  <span className="text-sm">{concept}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((stats.correct / stats.total) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Recommendations */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium mb-2">AI Recommendations:</h4>
            <ul className="space-y-1 text-sm">
              {metrics.weakTopics.slice(0, 3).map(topic => topic && (
                <li key={topic.id} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                  Focus on {topic.name} - currently at {
                    Math.round(userProfile.performanceData.topicMastery[topic.id]?.masteryLevel || 0)
                  }% mastery
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setActiveSection('practice');
              setAdaptiveSession(null);
              setShowResults(false);
            }}
            className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-medium"
          >
            Back to Practice
          </button>
          <button
            onClick={() => startAdaptivePractice()}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium"
          >
            Continue Practicing
          </button>
        </div>
      </div>
    );
  };

  // Render Video Lesson
  const renderVideoLesson = () => {
    if (!currentVideo) {
      const allVideos = videoLessonsData;
      
      return (
        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Video Lessons</h2>
            <button
              onClick={() => setActiveSection('home')}
              className="text-gray-600 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Categories */}
          {topics.map(topic => {
            const topicVideos = allVideos.filter(v => v.topicId === topic.id);
            if (topicVideos.length === 0) return null;

            return (
              <div key={topic.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">{topic.emoji}</span>
                  {topic.name}
                </h3>
                <div className="space-y-3">
                  {topicVideos.map(video => (
                    <button
                      key={video.id}
                      onClick={() => setCurrentVideo(video)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.floor(video.duration / 60)} min • {video.embeddedQuizzes.length} quizzes
                          </p>
                        </div>
                        {video.watchedPercentage > 0 && (
                          <div className="text-green-600 font-medium">
                            {video.watchedPercentage}%
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Video Player
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Video Player */}
          <div className="relative aspect-video bg-gray-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white opacity-50" />
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-4 text-white">
                <button className="p-2">
                  <Play className="w-6 h-6" />
                </button>
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div className="bg-white h-full rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-sm">5:23 / 12:45</span>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-white dark:bg-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{currentVideo.title}</h2>
              <button
                onClick={() => setCurrentVideo(null)}
                className="text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Key Points */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Key Points:</h3>
              <ul className="space-y-1">
                {currentVideo.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Quiz Markers */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Interactive Quizzes:</h3>
              <div className="flex gap-2 flex-wrap">
                {currentVideo.embeddedQuizzes.map((quiz, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full text-sm"
                  >
                    Quiz at {Math.floor(quiz.timestamp / 60)}:{(quiz.timestamp % 60).toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="font-semibold mb-2">Your Notes:</h3>
              <textarea
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                placeholder="Take notes while watching..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render AI Tutor
  const renderAITutor = () => {
    const [tutorInput, setTutorInput] = useState('');
    const [currentTopic, setCurrentTopic] = useState('');

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-bold">AI Finance Tutor</h2>
                    <p className="text-sm opacity-90">Ask me anything about finance!</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSection('home')}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conversation */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                    <p className="text-sm">
                      Hi! I'm your AI Finance Tutor. I can help you understand concepts, 
                      solve problems, and prepare for your ACF exam. What would you like to learn about today?
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">AI Tutor • Just now</p>
                </div>
              </div>

              {/* Quick Topics */}
              <div className="flex gap-2 flex-wrap">
                {['Time Value of Money', 'Portfolio Theory', 'Bond Valuation', 'Financial Ratios'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => {
                      setTutorInput(`Explain ${topic}`);
                      // Trigger AI response
                    }}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full text-sm"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Chat History */}
              {aiTutorHistory.map((response, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                      <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                      
                      {response.hints.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-sm font-medium mb-1">💡 Hints:</p>
                          <ul className="space-y-1">
                            {response.hints.map((hint, i) => (
                              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                                • {hint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {response.suggestedResources.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">📚 Suggested Resources:</p>
                          <div className="space-y-1">
                            {response.suggestedResources.map((resource, i) => (
                              <button
                                key={i}
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {resource.type === 'video' && <Video className="w-4 h-4" />}
                                {resource.type === 'practice' && <Target className="w-4 h-4" />}
                                {resource.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tutorInput.trim()) {
                      askAITutor(tutorInput);
                      setTutorInput('');
                    }
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={() => {
                    if (tutorInput.trim()) {
                      askAITutor(tutorInput);
                      setTutorInput('');
                    }
                  }}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Continue in next part...