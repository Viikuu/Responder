const { readFile, writeFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid');

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()

    return questions.find(question => question.id === questionId)
  }

  const addQuestion = async question => {
    let questions = await getQuestions()
    if (question.author === undefined || typeof question.author !== 'string') {
      throw new Error(`Expected question.author to be a string, got ${typeof question.author}`)
    }
    if (question.summary === undefined || typeof question.summary !== 'string') {
      throw new Error(`Expected question.summary to be a string, got ${typeof question.summary}`)
    }

    questions.push({
      id: uuidv4(),
      author: question.author,
      summary: question.summary,
      answers: []
    })
    await writeFile(fileName, JSON.stringify(questions, undefined, '  '), { encoding: 'utf-8' })
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)

    return question === undefined ? undefined : question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)

    return answers === undefined ? undefined : answers.find(answer => answer.id === answerId)
  }

  const addAnswer = async (questionId, answer) => {
    const questions = await getQuestions()
    const question = questions.find(question => question.id === questionId)
    if (question === undefined) {
      throw new Error('Question with specified id does not exist')
    }
    if (typeof answer.author !== 'string') {
      throw new Error(`Expected answer.author to be a string, got ${typeof answer.author}`)
    }
    if (typeof answer.summary !== 'string') {
      throw new Error(`Expected answer.summary to be a string, got ${typeof answer.summary}`)
    }

    question.answers.push({
        id: uuidv4(),
        author: answer.author,
        summary: answer.summary
      }
    )

    await writeFile(fileName, JSON.stringify(questions, undefined, '  '), { encoding: 'utf-8' })
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
