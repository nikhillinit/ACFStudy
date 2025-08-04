import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { 
  Star, 
  Clock, 
  Users, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  BookOpen, 
  FileText, 
  CheckCircle,
  Globe,
  Calendar,
  Target,
  Brain,
  NotebookPen,
  TrendingUp,
  Calculator,
  PieChart,
  DollarSign,
  FileSpreadsheet,
  Timer
} from 'lucide-react'
import { expandedCourseData } from './data/expandedCourseData.js'
import QuizComponent from './components/QuizComponent.jsx'
import ProgressTracker from './components/ProgressTracker.jsx'
import NoteTaking from './components/NoteTaking.jsx'
import PortfolioCalculator from './components/PortfolioCalculator.jsx'
import BondCalculator from './components/BondCalculator.jsx'
import FinancialStatementGame from './components/FinancialStatementGame.jsx'
import ACFExamSimulator from './components/ACFExamSimulator.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('about')
  const [expandedModules, setExpandedModules] = useState({})
  const [completedLessons, setCompletedLessons] = useState({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showPortfolioCalc, setShowPortfolioCalc] = useState(false)
  const [showBondCalc, setShowBondCalc] = useState(false)
  const [showStatementGame, setShowStatementGame] = useState(false)
  const [showExamSim, setShowExamSim] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [currentDay, setCurrentDay] = useState(1)

  const { course } = expandedCourseData

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const toggleLesson = (lessonId) => {
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }))
  }

  const openInteractiveComponent = (type, lesson) => {
    setSelectedLesson(lesson)
    switch(type) {
      case 'quiz':
        setShowQuiz(true)
        break
      case 'notes':
        setShowNotes(true)
        break
      case 'portfolio':
        setShowPortfolioCalc(true)
        break
      case 'bond':
        setShowBondCalc(true)
        break
      case 'statement':
        setShowStatementGame(true)
        break
      case 'exam':
        setShowExamSim(true)
        break
    }
  }

  const getCompletedLessonsCount = () => {
    return Object.values(completedLessons).filter(Boolean).length
  }

  const getTotalLessonsCount = () => {
    return course.modules.reduce((total, module) => total + module.lessons.length, 0)
  }

  const getModuleIcon = (moduleId) => {
    const icons = {
      1: Calculator,
      2: PieChart,
      3: DollarSign,
      4: FileSpreadsheet,
      5: FileText,
      6: Brain,
      7: Timer
    }
    return icons[moduleId] || BookOpen
  }

  const getDayProgress = (day) => {
    const moduleForDay = course.modules.find(m => m.id === day)
    if (!moduleForDay) return 0
    
    const completedInModule = moduleForDay.lessons.filter(lesson => 
      completedLessons[lesson.id]
    ).length
    
    return (completedInModule / moduleForDay.lessons.length) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-blue-600">CourseLearn</div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">Browse</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Business</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Finance</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Log In</Button>
              <Button>Join for Free</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Badge variant="secondary">Home</Badge>
            <span>/</span>
            <Badge variant="secondary">Browse</Badge>
            <span>/</span>
            <Badge variant="secondary">Business</Badge>
            <span>/</span>
            <span className="text-gray-600">Finance</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {course.subtitle}
              </p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(course.overview.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {course.overview.rating} ({course.overview.totalReviews.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {course.overview.studentsEnrolled.toLocaleString()} already enrolled
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {course.overview.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">{course.overview.duration}</span>
                  <span className="text-xs text-gray-500">to complete</span>
                </div>
                <div className="flex flex-col items-center">
                  <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Flexible</span>
                  <span className="text-xs text-gray-500">schedule</span>
                </div>
                <div className="flex flex-col items-center">
                  <Globe className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">{course.overview.language}</span>
                  <span className="text-xs text-gray-500">language</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Certificate</span>
                  <span className="text-xs text-gray-500">included</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="exam">Exam Sim</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      {course.description}
                    </p>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">What you'll learn</h3>
                      <ul className="space-y-2">
                        {course.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="outcomes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Outcomes</CardTitle>
                    <CardDescription>
                      Master these competencies to pass the Kellogg ACF placement exam
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start p-4 border rounded-lg">
                          <Target className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules" className="mt-6">
                <div className="space-y-4">
                  {course.modules.map((module) => {
                    const ModuleIcon = getModuleIcon(module.id)
                    const isExpanded = expandedModules[module.id]
                    const dayProgress = getDayProgress(module.id)
                    
                    return (
                      <Card key={module.id}>
                        <Collapsible>
                          <CollapsibleTrigger 
                            className="w-full"
                            onClick={() => toggleModule(module.id)}
                          >
                            <CardHeader className="hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                                    <ModuleIcon className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div className="text-left">
                                    <CardTitle className="text-lg">{module.week}: {module.title}</CardTitle>
                                    <CardDescription className="flex items-center space-x-4">
                                      <span>{module.duration}</span>
                                      <span>•</span>
                                      <span>{module.lessons.length} lessons</span>
                                    </CardDescription>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <div className="text-sm font-medium">{Math.round(dayProgress)}% complete</div>
                                    <Progress value={dayProgress} className="w-20" />
                                  </div>
                                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <p className="text-gray-600 mb-4">{module.description}</p>
                              
                              <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
                                <div className="text-center">
                                  <Play className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                  <div className="font-medium">{module.contentBreakdown.videos}</div>
                                  <div className="text-gray-500">videos</div>
                                </div>
                                <div className="text-center">
                                  <BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                  <div className="font-medium">{module.contentBreakdown.readings}</div>
                                  <div className="text-gray-500">readings</div>
                                </div>
                                <div className="text-center">
                                  <FileText className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                  <div className="font-medium">{module.contentBreakdown.assignments}</div>
                                  <div className="text-gray-500">assignments</div>
                                </div>
                                <div className="text-center">
                                  <Brain className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                  <div className="font-medium">{module.contentBreakdown.quizzes}</div>
                                  <div className="text-gray-500">quizzes</div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-semibold">Lessons</h4>
                                {module.lessons.map((lesson) => (
                                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        completedLessons[lesson.id] 
                                          ? 'bg-green-500 text-white' 
                                          : 'bg-gray-200 text-gray-600'
                                      }`}>
                                        {completedLessons[lesson.id] ? (
                                          <CheckCircle className="w-4 h-4" />
                                        ) : (
                                          <Play className="w-3 h-3" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium">{lesson.title}</div>
                                        <div className="text-sm text-gray-500">
                                          {lesson.type} • {lesson.duration}
                                        </div>
                                        <div className="text-xs text-gray-400">{lesson.description}</div>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      {lesson.type === 'interactive' && lesson.title.includes('Portfolio') && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => openInteractiveComponent('portfolio', lesson)}
                                        >
                                          Portfolio Calc
                                        </Button>
                                      )}
                                      {lesson.type === 'interactive' && lesson.title.includes('Bond') && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => openInteractiveComponent('bond', lesson)}
                                        >
                                          Bond Calc
                                        </Button>
                                      )}
                                      {lesson.type === 'interactive' && lesson.title.includes('Classification') && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => openInteractiveComponent('statement', lesson)}
                                        >
                                          Classification Game
                                        </Button>
                                      )}
                                      {lesson.type === 'exam' && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => openInteractiveComponent('exam', lesson)}
                                        >
                                          Take Exam
                                        </Button>
                                      )}
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => openInteractiveComponent('notes', lesson)}
                                      >
                                        Notes
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => openInteractiveComponent('quiz', lesson)}
                                      >
                                        Quiz
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="testimonials" className="mt-6">
                <div className="space-y-6">
                  {course.testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold">{testimonial.name}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-sm text-gray-500">{testimonial.program}</span>
                              <div className="flex text-yellow-400">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{testimonial.text}</p>
                            <div className="text-xs text-gray-500 mt-2">{testimonial.date}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>
                      See what students say about this ACF preparation course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {course.overview.rating}
                      </div>
                      <div className="flex justify-center text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-6 h-6 ${i < Math.floor(course.overview.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <div className="text-gray-600">
                        ({course.overview.totalReviews.toLocaleString()} reviews)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exam" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ACF Exam Simulator</CardTitle>
                    <CardDescription>
                      Take a full practice exam under real test conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => openInteractiveComponent('exam', null)}
                      className="w-full"
                      size="lg"
                    >
                      <Timer className="w-5 h-5 mr-2" />
                      Start 2-Hour Practice Exam
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="p-6">
                <Button className="w-full mb-4" size="lg">
                  Enroll for Free<span className="ml-2 text-sm">Starts Aug 3</span>
                </Button>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{course.overview.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Level:</span>
                    <span className="text-sm font-medium">{course.overview.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Language:</span>
                    <span className="text-sm font-medium">{course.overview.language}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Certificate:</span>
                    <span className="text-sm font-medium">Included</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <ProgressTracker 
              completedLessons={getCompletedLessonsCount()}
              totalLessons={getTotalLessonsCount()}
              currentModule={currentDay}
              modules={course.modules}
            />

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {course.instructor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.instructor.name}</h3>
                    <p className="text-gray-600 text-sm">{course.instructor.title}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{course.instructor.rating}</span>
                      </div>
                      <span>{course.instructor.courses} Courses</span>
                      <span>{course.instructor.students.toLocaleString()} learners</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Interactive Component Dialogs */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interactive Quiz</DialogTitle>
            <DialogDescription>
              {selectedLesson ? `Quiz for: ${selectedLesson.title}` : 'Practice Quiz'}
            </DialogDescription>
          </DialogHeader>
          <QuizComponent onComplete={() => setShowQuiz(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
            <DialogDescription>
              {selectedLesson ? `Notes for: ${selectedLesson.title}` : 'Course Notes'}
            </DialogDescription>
          </DialogHeader>
          <NoteTaking onComplete={() => setShowNotes(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showPortfolioCalc} onOpenChange={setShowPortfolioCalc}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Portfolio Calculator</DialogTitle>
            <DialogDescription>
              Interactive portfolio return and risk calculator
            </DialogDescription>
          </DialogHeader>
          <PortfolioCalculator onComplete={() => setShowPortfolioCalc(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showBondCalc} onOpenChange={setShowBondCalc}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bond & Equity Calculator</DialogTitle>
            <DialogDescription>
              Calculate bond YTM and equity returns
            </DialogDescription>
          </DialogHeader>
          <BondCalculator onComplete={() => setShowBondCalc(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showStatementGame} onOpenChange={setShowStatementGame}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Financial Statement Classification</DialogTitle>
            <DialogDescription>
              Speed classification challenge for financial statement items
            </DialogDescription>
          </DialogHeader>
          <FinancialStatementGame onComplete={() => setShowStatementGame(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showExamSim} onOpenChange={setShowExamSim}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ACF Placement Exam Simulator</DialogTitle>
            <DialogDescription>
              Full 2-hour practice exam covering all competency areas
            </DialogDescription>
          </DialogHeader>
          <ACFExamSimulator onComplete={() => setShowExamSim(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App

