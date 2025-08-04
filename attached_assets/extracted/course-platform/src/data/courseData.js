export const courseData = {
  course: {
    id: "wharton-finance",
    title: "Introduction to Corporate Finance",
    subtitle: "Learn the fundamentals of corporate finance from Wharton",
    institution: {
      name: "University of Pennsylvania",
      logo: "/assets/upenn-logo.png"
    },
    instructor: {
      name: "Michael R Roberts",
      title: "Professor of Finance",
      rating: 4.7,
      totalRatings: 838,
      courses: 4,
      learners: 289251,
      bio: "Professor Roberts is a leading expert in corporate finance with extensive research in capital structure and financial markets.",
      image: "/assets/instructor-placeholder.jpg"
    },
    overview: {
      duration: "7 hours",
      rating: 4.6,
      totalReviews: 6248,
      enrolled: 253304,
      certificate: true,
      level: "Beginner",
      language: "English",
      subtitles: ["English", "Spanish", "French", "German", "Chinese"],
      flexible: true
    },
    description: "This course provides a brief introduction to the fundamentals of finance, emphasizing their application to a wide variety of real-world situations spanning personal finance, corporate decision-making, and financial intermediation. Key concepts and applications include: time value of money, risk-return tradeoff, cost of capital, interest rates, retirement savings, mortgage financing, auto leasing, capital budgeting, asset valuation, discounted cash flow (DCF) analysis, net present value, internal rate of return, hurdle rate, payback period.",
    learningOutcomes: [
      "Understand the time value of money and its applications",
      "Calculate present and future values of cash flows",
      "Analyze investment opportunities using NPV and IRR",
      "Evaluate different financing options",
      "Apply financial concepts to real-world scenarios"
    ],
    skills: [
      "Financial Modeling",
      "Business Valuation", 
      "Financial Analysis",
      "Finance",
      "Risk Analysis",
      "Capital Budgeting",
      "Financial Management",
      "Cash Flows",
      "Return On Investment",
      "Corporate Finance",
      "Financial Planning"
    ],
    modules: [
      {
        id: 1,
        title: "Time Value of Money",
        week: "Week 1",
        duration: "2 hours",
        description: "Learn the fundamental concept that money available today is worth more than the same amount in the future due to its potential earning capacity.",
        content: {
          videos: 4,
          readings: 6,
          assignments: 1,
          quizzes: 2
        },
        lessons: [
          {
            id: "1-1",
            title: "Introduction to Time Value of Money",
            type: "video",
            duration: "15 min",
            description: "Understanding why a dollar today is worth more than a dollar tomorrow"
          },
          {
            id: "1-2", 
            title: "Present Value Calculations",
            type: "video",
            duration: "20 min",
            description: "Learn how to calculate the present value of future cash flows"
          },
          {
            id: "1-3",
            title: "Future Value and Compounding",
            type: "video", 
            duration: "18 min",
            description: "Understanding compound interest and future value calculations"
          },
          {
            id: "1-4",
            title: "Annuities and Perpetuities",
            type: "video",
            duration: "22 min", 
            description: "Valuing streams of cash flows over time"
          },
          {
            id: "1-5",
            title: "Time Value of Money Fundamentals",
            type: "reading",
            duration: "30 min",
            description: "Comprehensive reading on TVM concepts and applications"
          },
          {
            id: "1-6",
            title: "Practice Problems Set 1",
            type: "assignment",
            duration: "45 min",
            description: "Apply TVM concepts to solve real-world problems"
          }
        ]
      },
      {
        id: 2,
        title: "Interest Rates",
        week: "Week 2", 
        duration: "1 hour",
        description: "Explore different types of interest rates and their impact on financial decisions.",
        content: {
          videos: 3,
          readings: 4,
          assignments: 1,
          quizzes: 1
        },
        lessons: [
          {
            id: "2-1",
            title: "Types of Interest Rates",
            type: "video",
            duration: "12 min",
            description: "Nominal vs real rates, simple vs compound interest"
          },
          {
            id: "2-2",
            title: "Interest Rate Risk",
            type: "video", 
            duration: "15 min",
            description: "How interest rate changes affect investments"
          },
          {
            id: "2-3",
            title: "Term Structure of Interest Rates",
            type: "video",
            duration: "18 min",
            description: "Understanding yield curves and their implications"
          }
        ]
      },
      {
        id: 3,
        title: "Discounted Cash Flow Analysis", 
        week: "Week 3",
        duration: "1 hour",
        description: "Master the DCF method for valuing investments and business opportunities.",
        content: {
          videos: 3,
          readings: 3,
          assignments: 1,
          quizzes: 1
        },
        lessons: [
          {
            id: "3-1",
            title: "DCF Fundamentals",
            type: "video",
            duration: "16 min",
            description: "Introduction to discounted cash flow analysis"
          },
          {
            id: "3-2",
            title: "Building DCF Models",
            type: "video",
            duration: "20 min", 
            description: "Step-by-step DCF model construction"
          },
          {
            id: "3-3",
            title: "DCF Applications",
            type: "video",
            duration: "14 min",
            description: "Real-world applications of DCF analysis"
          }
        ]
      },
      {
        id: 4,
        title: "Return on Investment",
        week: "Week 4",
        duration: "1 hour", 
        description: "Learn to evaluate investment performance using various return metrics.",
        content: {
          videos: 3,
          readings: 3,
          assignments: 1,
          quizzes: 1
        },
        lessons: [
          {
            id: "4-1",
            title: "ROI Fundamentals",
            type: "video",
            duration: "14 min",
            description: "Understanding return on investment calculations"
          },
          {
            id: "4-2",
            title: "Risk-Adjusted Returns",
            type: "video",
            duration: "17 min",
            description: "Incorporating risk into return calculations"
          },
          {
            id: "4-3",
            title: "Portfolio Returns",
            type: "video", 
            duration: "19 min",
            description: "Calculating returns for investment portfolios"
          }
        ]
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Jennifer G.",
        rating: 5,
        date: "Dec 15, 2018",
        text: "I REALLY LOVED THIS COURSE. IN FACT I ASK THE MANAGEMENT TO PLEASE COME UP WITH MORE ADVANCED COURSES IN THIS AREA. ALSO, I REALLY LIKED THE WAY THE FACULTY HAS EXPLAINED THE CONCEPT. CHEERS!"
      },
      {
        id: 2,
        name: "Archana A.",
        rating: 5,
        date: "Aug 26, 2017", 
        text: "Great course lectures and pacing! I'd just really like to know the right solutions for the questions i got wrong. That will help sharpen concepts. Great if there's a way to share that. Thanks!"
      },
      {
        id: 3,
        name: "Linda L.",
        rating: 5,
        date: "Oct 21, 2016",
        text: "The professor is very patient, he spends a lot of time making sense of the equations and the calculation process, which helps me comprehend the concepts and their application really a lot. Thank you!"
      }
    ],
    faq: [
      {
        question: "When will I have access to the lectures and assignments?",
        answer: "Access to lectures and assignments depends on your type of enrollment. If you take a course in audit mode, you will be able to see most course materials for free."
      },
      {
        question: "What will I get if I subscribe to this course?",
        answer: "When you subscribe to a course that is part of a Specialization, you're automatically subscribed to the full Specialization."
      },
      {
        question: "What is the refund policy?",
        answer: "You can cancel your subscription at any time. If you cancel within 7 days and haven't earned a Course Certificate, you'll receive a full refund."
      }
    ]
  }
};

