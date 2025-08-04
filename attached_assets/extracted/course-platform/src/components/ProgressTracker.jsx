import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle, Clock, Trophy, Target } from 'lucide-react'

export function ProgressTracker({ completedLessons, totalLessons, courseData }) {
  const [overallProgress, setOverallProgress] = useState(0)
  const [moduleProgress, setModuleProgress] = useState({})
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    calculateProgress()
    checkAchievements()
  }, [completedLessons])

  const calculateProgress = () => {
    const completed = Object.keys(completedLessons).filter(key => completedLessons[key]).length
    const total = totalLessons || 0
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    setOverallProgress(progress)

    // Calculate progress per module
    const moduleProgressData = {}
    courseData?.course?.modules?.forEach(module => {
      const moduleLessons = module.lessons || []
      const completedInModule = moduleLessons.filter(lesson => completedLessons[lesson.id]).length
      const progressPercent = moduleLessons.length > 0 ? Math.round((completedInModule / moduleLessons.length) * 100) : 0
      moduleProgressData[module.id] = {
        completed: completedInModule,
        total: moduleLessons.length,
        progress: progressPercent
      }
    })
    setModuleProgress(moduleProgressData)
  }

  const checkAchievements = () => {
    const newAchievements = []
    const completedCount = Object.keys(completedLessons).filter(key => completedLessons[key]).length

    if (completedCount >= 1 && !achievements.find(a => a.id === 'first_lesson')) {
      newAchievements.push({
        id: 'first_lesson',
        title: 'Getting Started',
        description: 'Completed your first lesson',
        icon: <Target className="w-4 h-4" />,
        color: 'bg-blue-500'
      })
    }

    if (completedCount >= 5 && !achievements.find(a => a.id === 'five_lessons')) {
      newAchievements.push({
        id: 'five_lessons',
        title: 'Making Progress',
        description: 'Completed 5 lessons',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-green-500'
      })
    }

    if (overallProgress >= 50 && !achievements.find(a => a.id === 'halfway')) {
      newAchievements.push({
        id: 'halfway',
        title: 'Halfway There',
        description: 'Completed 50% of the course',
        icon: <Trophy className="w-4 h-4" />,
        color: 'bg-yellow-500'
      })
    }

    if (overallProgress >= 100 && !achievements.find(a => a.id === 'completed')) {
      newAchievements.push({
        id: 'completed',
        title: 'Course Complete',
        description: 'Completed the entire course',
        icon: <Trophy className="w-4 h-4" />,
        color: 'bg-purple-500'
      })
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements])
    }
  }

  const getTimeEstimate = () => {
    const completedCount = Object.keys(completedLessons).filter(key => completedLessons[key]).length
    const remainingLessons = (totalLessons || 0) - completedCount
    const avgTimePerLesson = 15 // minutes
    const remainingTime = remainingLessons * avgTimePerLesson
    
    if (remainingTime < 60) {
      return `${remainingTime} minutes remaining`
    } else {
      const hours = Math.floor(remainingTime / 60)
      const minutes = remainingTime % 60
      return `${hours}h ${minutes}m remaining`
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Your Progress</span>
          </CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{Object.keys(completedLessons).filter(key => completedLessons[key]).length} lessons completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{getTimeEstimate()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Module Progress</CardTitle>
          <CardDescription>Your progress in each module</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseData?.course?.modules?.map(module => {
              const progress = moduleProgress[module.id] || { completed: 0, total: 0, progress: 0 }
              return (
                <div key={module.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{module.title}</span>
                    <span className="text-sm text-gray-500">
                      {progress.completed}/{progress.total} lessons
                    </span>
                  </div>
                  <Progress value={progress.progress} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Milestones you've unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {achievements.map(achievement => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full text-white ${achievement.color}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-500">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Streak */}
      <Card>
        <CardHeader>
          <CardTitle>Study Streak</CardTitle>
          <CardDescription>Keep up the momentum</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">3</div>
            <div className="text-sm text-gray-600">days in a row</div>
            <Badge variant="secondary" className="mt-2">
              🔥 On Fire!
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProgressTracker

