import { questions, type Question } from "../data/questions"

export type Framework = "React" | "Vue"

// Array elementlarini random tartibda aralashtirish funksiyasi
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomQuestions(framework: Framework): Question[] {
  const stateManagementCategory = framework === "React" ? "ReactStateManagement" : "VueStateManagement"
  const categories = ["HTML", "CSS", "JavaScript", framework, stateManagementCategory]
  const result: Question[] = []

  for (const cat of categories) {
    const catQuestions = questions.filter((q) => q.category === cat)
    const shuffled = shuffleArray(catQuestions)
    const selectedFromCategory = shuffled.slice(0, 5)

    // Har bir savolning javoblarini ham random qilish
    const questionsWithShuffledOptions = selectedFromCategory.map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }))

    result.push(...questionsWithShuffledOptions)
  }

  // Oxirida barcha savollarni ham aralashtirish
  return shuffleArray(result)
}
