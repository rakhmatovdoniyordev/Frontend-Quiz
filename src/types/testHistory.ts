export interface TestResult {
    id: string
    framework: "React" | "Vue"
    date: string
    totalQuestions: number
    correctAnswers: number
    timeSpent: number 
    percentage: number
  }
