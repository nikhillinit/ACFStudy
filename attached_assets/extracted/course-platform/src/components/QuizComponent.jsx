import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

const sampleQuiz = {
  id: 'tvm-quiz-1',
  title: 'Time Value of Money Quiz',
  description: 'Test your understanding of basic TVM concepts',
  questions: [
    {
      id: 1,
      question: 'What is the present value of $1,000 received one year from now, assuming a 10% discount rate?',
      options: [
        { id: 'a', text: '$900' },
        { id: 'b', text: '$909.09' },
        { id: 'c', text: '$1,000' },
        { id: 'd', text: '$1,100' }
      ],
      correct: 'b',
      explanation: 'PV = FV / (1 + r) = $1,000 / (1 + 0.10) = $909.09'
    },
    {
      id: 2,
      question: 'If you invest $500 today at 8% annual interest, what will it be worth in 3 years?',
      options: [
        { id: 'a', text: '$620' },
        { id: 'b', text: '$629.86' },
        { id: 'c', text: '$640' },
        { id: 'd', text: '$650' }
      ],
      correct: 'b',
      explanation: 'FV = PV × (1 + r)^n = $500 × (1.08)^3 = $629.86'
    },
    {
      id: 3,
      question: 'Which statement about the time value of money is correct?',
      options: [
        { id: 'a', text: 'Money today is worth less than money in the future' },
        { id: 'b', text: 'Money today is worth the same as money in the future' },
        { id: 'c', text: 'Money today is worth more than money in the future' },
        { id: 'd', text: 'The value of money does not change over time' }
      ],
      correct: 'c',
      explanation: 'Money today is worth more than money in the future due to its earning potential and inflation.'
    }
  ]
}

export function QuizComponent({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleNext = () => {
    if (currentQuestion < sampleQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
      setQuizCompleted(true)
      if (onComplete) {
        const score = calculateScore()
        onComplete(score)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    sampleQuiz.questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / sampleQuiz.questions.length) * 100)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setQuizCompleted(false)
  }

  const currentQ = sampleQuiz.questions[currentQuestion]
  const isAnswered = answers[currentQ?.id]

  if (showResults) {
    const score = calculateScore()
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {score >= 70 ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <span>Quiz Results</span>
          </CardTitle>
          <CardDescription>
            You scored {score}% ({calculateScore() * sampleQuiz.questions.length / 100} out of {sampleQuiz.questions.length} correct)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleQuiz.questions.map((question, index) => {
              const userAnswer = answers[question.id]
              const isCorrect = userAnswer === question.correct
              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">Question {index + 1}: {question.question}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your answer: {question.options.find(opt => opt.id === userAnswer)?.text || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.options.find(opt => opt.id === question.correct)?.text}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center mt-6">
            <Button onClick={resetQuiz} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{sampleQuiz.title}</CardTitle>
        <CardDescription>{sampleQuiz.description}</CardDescription>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Question {currentQuestion + 1} of {sampleQuiz.questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / sampleQuiz.questions.length) * 100)}% Complete</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQ.question}</h3>
          
          <RadioGroup 
            value={answers[currentQ.id] || ''} 
            onValueChange={(value) => handleAnswerSelect(currentQ.id, value)}
          >
            {currentQ.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!isAnswered}
          >
            {currentQuestion === sampleQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuizComponent

