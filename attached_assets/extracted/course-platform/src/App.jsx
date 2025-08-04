import { useState } from 'react'
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
  TrendingUp
} from 'lucide-react'
import { courseData } from './data/courseData.js'
import QuizComponent from './components/QuizComponent.jsx'
import ProgressTracker from './components/ProgressTracker.jsx'
import NoteTaking from './components/NoteTaking.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('about')
  const [expandedModules, setExpandedModules] = useState({})
  const [completedLessons, setCompletedLessons] = useState({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)

  const { course } = courseData

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

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />
      case 'reading': return <BookOpen className="w-4 h-4" />
      case 'assignment': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-blue-600">CourseLearn</div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">Browse</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Business</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Finance</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Log In</Button>
              <Button>Join for Free</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700">Home</a>
            <span className="mx-2">/</span>
            <a href="#" className="hover:text-gray-700">Browse</a>
            <span className="mx-2">/</span>
            <a href="#" className="hover:text-gray-700">Business</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Finance</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{course.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">{renderStars(course.overview.rating)}</div>
                  <span className="ml-2 text-sm text-gray-600">
                    {course.overview.rating} ({course.overview.totalReviews.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {course.overview.enrolled.toLocaleString()} already enrolled
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {course.skills.slice(0, 6).map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
                {course.skills.length > 6 && (
                  <Badge variant="outline">+{course.skills.length - 6} more</Badge>
                )}
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">{course.overview.duration}</div>
                  <div className="text-xs text-gray-500">to complete</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">Flexible</div>
                  <div className="text-xs text-gray-500">schedule</div>
                </div>
                <div className="text-center">
                  <Globe className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">{course.overview.language}</div>
                  <div className="text-xs text-gray-500">language</div>
                </div>
                <div className="text-center">
                  <Award className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">Certificate</div>
                  <div className="text-xs text-gray-500">included</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">{course.description}</p>
                    
                    <h3 className="text-lg font-semibold mb-3">What you'll learn</h3>
                    <ul className="space-y-2">
                      {course.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Outcomes Tab */}
              <TabsContent value="outcomes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Outcomes</CardTitle>
                    <CardDescription>Skills and knowledge you'll gain from this course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                          <Target className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Modules Tab */}
              <TabsContent value="modules" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>There are {course.modules.length} modules in this course</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.modules.map((module) => (
                        <Collapsible 
                          key={module.id}
                          open={expandedModules[module.id]}
                          onOpenChange={() => toggleModule(module.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full justify-between p-4 h-auto"
                            >
                              <div className="text-left">
                                <div className="font-semibold">
                                  {module.week}: {module.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Module {module.id} • {module.duration} to complete
                                </div>
                              </div>
                              {expandedModules[module.id] ? 
                                <ChevronUp className="w-4 h-4" /> : 
                                <ChevronDown className="w-4 h-4" />
                              }
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-gray-700 mb-4">{module.description}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-white rounded">
                                <div className="text-center">
                                  <Play className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                                  <div className="text-sm font-medium">{module.content.videos}</div>
                                  <div className="text-xs text-gray-500">videos</div>
                                </div>
                                <div className="text-center">
                                  <BookOpen className="w-4 h-4 mx-auto mb-1 text-green-600" />
                                  <div className="text-sm font-medium">{module.content.readings}</div>
                                  <div className="text-xs text-gray-500">readings</div>
                                </div>
                                <div className="text-center">
                                  <FileText className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                                  <div className="text-sm font-medium">{module.content.assignments}</div>
                                  <div className="text-xs text-gray-500">assignments</div>
                                </div>
                                <div className="text-center">
                                  <CheckCircle className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                                  <div className="text-sm font-medium">{module.content.quizzes}</div>
                                  <div className="text-xs text-gray-500">quizzes</div>
                                </div>
                              </div>

                              {module.lessons && (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900">Lessons</h4>
                                  {module.lessons.map((lesson) => (
                                    <div 
                                      key={lesson.id} 
                                      className="p-3 bg-white rounded border hover:bg-gray-50"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                          {getContentIcon(lesson.type)}
                                          <div>
                                            <div className="font-medium text-sm">{lesson.title}</div>
                                            <div className="text-xs text-gray-500">{lesson.description}</div>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                                          <CheckCircle 
                                            className={`w-4 h-4 cursor-pointer ${
                                              completedLessons[lesson.id] 
                                                ? 'text-green-500 fill-green-500' 
                                                : 'text-gray-300'
                                            }`}
                                            onClick={() => toggleLesson(lesson.id)}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => {
                                            setSelectedLesson(lesson)
                                            setShowNotes(true)
                                          }}
                                        >
                                          <NotebookPen className="w-3 h-3 mr-1" />
                                          Notes
                                        </Button>
                                        {lesson.type === 'video' && (
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => setShowQuiz(true)}
                                          >
                                            <Brain className="w-3 h-3 mr-1" />
                                            Quiz
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learner Reviews</CardTitle>
                    <CardDescription>What students are saying about this course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {testimonial.name.charAt(0)}
                              </div>
                              <span className="font-medium">{testimonial.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">{renderStars(testimonial.rating)}</div>
                              <span className="text-sm text-gray-500">{testimonial.date}</span>
                            </div>
                          </div>
                          <p className="text-gray-700">{testimonial.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other tabs with placeholder content */}
              <TabsContent value="recommendations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Explore more courses in Finance and Business.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Detailed review section coming soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Enrollment & Instructor */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <Card className="mb-6 sticky top-24">
              <CardContent className="p-6">
                <Button className="w-full mb-4" size="lg">
                  Enroll for Free
                  <span className="ml-2 text-sm">Starts Aug 3</span>
                </Button>
                
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900">{course.overview.rating}</div>
                  <div className="flex justify-center mb-1">{renderStars(course.overview.rating)}</div>
                  <div className="text-sm text-gray-600">
                    ({course.overview.totalReviews.toLocaleString()} reviews)
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{course.overview.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium">{course.overview.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{course.overview.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certificate:</span>
                    <span className="font-medium">Included</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <div className="mb-6">
              <ProgressTracker 
                completedLessons={completedLessons}
                totalLessons={course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)}
                courseData={courseData}
              />
            </div>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {course.instructor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold">{course.instructor.name}</div>
                    <div className="text-sm text-gray-600">{course.instructor.title}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{course.instructor.rating}</span>
                  </div>
                  <div>{course.instructor.courses} Courses</div>
                  <div>{course.instructor.learners.toLocaleString()} learners</div>
                </div>
                
                <p className="text-sm text-gray-700">{course.instructor.bio}</p>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">University of Pennsylvania</div>
                  <div className="text-xs text-blue-700">Learn more about this institution</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interactive Quiz</DialogTitle>
            <DialogDescription>
              Test your understanding of the concepts you've learned
            </DialogDescription>
          </DialogHeader>
          <QuizComponent onComplete={(score) => {
            console.log('Quiz completed with score:', score)
            // You could save the score or update progress here
          }} />
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>My Notes</DialogTitle>
            <DialogDescription>
              Take notes for {selectedLesson?.title || 'this lesson'}
            </DialogDescription>
          </DialogHeader>
          {selectedLesson && (
            <NoteTaking 
              lessonId={selectedLesson.id}
              lessonTitle={selectedLesson.title}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App

