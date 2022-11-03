const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const { questionId } = req.params
  const question = await req.repositories.questionRepo.getQuestionById(questionId)
  if(question === undefined) {
    res.code(404).json({ error: {message: 'Item with specified Id doesn\'t exist'}})
  }
  res.json(question)
})

app.post('/questions', async (req, res) => {
  const question = req.body
  await req.repositories.questionRepo.addQuestion(question)
  res.json({success: true, question})
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  const answers = await req.repositories.questionRepo.getAnswers(questionId)
  if(answers === undefined) {
    res.code(404).json({ success: false, error: {message: 'Question with specified Id doesn\'t exist'}})
  }
  res.json(answers)
})

app.post('/questions/:questionId/answers',async (req, res) => {
  const { questionId } = req.params
  const answer = req.body
  await req.repositories.questionRepo.addAnswer(questionId, answer)
  res.json({ success: true, answer })
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const { questionId, answerId } = req.params
  const answer = await req.repositories.questionRepo.getAnswer(questionId, answerId)
  if(answer === undefined) {
    res.code(404).json({ success: false, error: {message: 'Question or Answer with specified Id doesn\'t exist'}})
  }
  res.json(answer)
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
