const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { v4: uuidv4 } = require('uuid');
const { makeQuestionRepository } = require('./question')


describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  describe('getQuestions', () => {
    test('should return a list of 0 questions', async () => {
      expect(await questionRepo.getQuestions()).toHaveLength(0)
    })

    test('should return a list of 2 questions', async () => {
      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getQuestions()).toHaveLength(2)
    })
  })

  describe('getQuestionById', () => {
    test('should return undefined when does not exist', async () => {
      expect(await questionRepo.getQuestionById(faker.datatype.uuid())).toBeUndefined()

      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getQuestionById(faker.datatype.uuid())).toBeUndefined()
    })

    test('should return question by id', async () => {
      const uuid1 = uuidv4()
      const uuid2 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: uuid2,
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getQuestionById(uuid1)).toEqual(testQuestions[0])
      expect(await questionRepo.getQuestionById(uuid2)).toEqual(testQuestions[1])
    })

  })

  describe('addQuestion', () => {
    test('should return new questions array lenght', async () => {
      const testQuestions = await questionRepo.getQuestions()
      const testQuestion1 = {
        summary: 'Who are you?',
        author: 'Tim Doods'
      }
      await questionRepo.addQuestion(testQuestion1)

      expect((await questionRepo.getQuestions()).length).toBeGreaterThan(testQuestions.length)


      const testQuestion2 = {
        summary: 'What is my name?',
        author: 'Jack London'
      }
      await questionRepo.addQuestion(testQuestion2)

      expect((await questionRepo.getQuestions()).length).toBeGreaterThan(testQuestions.length + 1)

    })

    test('added data should be equal to that which was added', async () => {
      const testQuestion1 = {
        summary: 'Who are you?',
        author: 'Tim Doods'
      }
      await questionRepo.addQuestion(testQuestion1)

      expect((await questionRepo.getQuestions()).at(-1).summary).toEqual(testQuestion1.summary)
      expect((await questionRepo.getQuestions()).at(-1).author).toEqual(testQuestion1.author)

      const testQuestion2 = {
        summary: 'What is my name?',
        author: 'Jack London'
      }
      await questionRepo.addQuestion(testQuestion2)

      expect((await questionRepo.getQuestions()).at(-1).summary).toEqual(testQuestion2.summary)
      expect((await questionRepo.getQuestions()).at(-1).author).toEqual(testQuestion2.author)
    })

    test('should throw and error when given author or summary is not typeof string', async () => {
      const testQuestion1 = {
        summary: 'Who are you?',
        author: 123
      }

      await expect(questionRepo.addQuestion(testQuestion1)).rejects.toThrow()

      const testQuestion2 = {
        summary: 321,
        author: 'Jim Smith'
      }

      await expect(questionRepo.addQuestion(testQuestion2)).rejects.toThrow()

      const testQuestion3 = {
        summary: 321,
        author: 123
      }

      await expect(questionRepo.addQuestion(testQuestion3)).rejects.toThrow()
    })

    test('should throw and error when author or summary is undefined', async () => {
      const testQuestion1 = {
        summary: 'Who are you?'
      }

      await  expect(questionRepo.addQuestion(testQuestion1)).rejects.toThrow()

      const testQuestion2 = {
        author: 'Jim Smith'
      }

      await expect(questionRepo.addQuestion(testQuestion2)).rejects.toThrow()

      const testQuestion3 = {
      }

      await expect(questionRepo.addQuestion(testQuestion3)).rejects.toThrow()
    })
  })

  describe('getAnswers', () => {
    test('should return empty array when answers to specified question do not exist', async () => {
      const uuid1 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getAnswers(uuid1)).toHaveLength(0)
    })

    test('should return undefined when question do not exist', async () => {
      expect(await questionRepo.getAnswers(faker.datatype.uuid())).toBeUndefined()

      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getAnswers(faker.datatype.uuid())).toBeUndefined()
    })

    test('should return array of answers with lenght of 2', async () => {
      const uuid1 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: [
            {
              'id': faker.datatype.uuid(),
              'author': 'Brian McKenzie',
              'summary': 'The Earth is flat.'
            },
            {
              'id': faker.datatype.uuid(),
              'author': 'Dr Strange',
              'summary': 'It is egg-shaped.'
            }
          ]
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getAnswers(uuid1)).toHaveLength(2)
      expect(await questionRepo.getAnswers(uuid1)).toEqual(testQuestions[0].answers)
    })
  })

  describe('getAnswer', () => {
    test('should return undefined if question does not exist', async () => {
      expect(await questionRepo.getAnswer(faker.datatype.uuid(), faker.datatype.uuid())).toBeUndefined()

      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getAnswer(faker.datatype.uuid(), faker.datatype.uuid())).toBeUndefined()
    })

    test('should return undefined if answer does not exist', async () => {
      const uuid1 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getAnswer(uuid1, faker.datatype.uuid())).toBeUndefined()
    })

    test('should return answer by id', async () => {
      const uuid1 = uuidv4()
      const uuid2 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: [
            {
              'id': uuid2,
              'author': 'Brian McKenzie',
              'summary': 'The Earth is flat.'
            },
            {
              'id': faker.datatype.uuid(),
              'author': 'Dr Strange',
              'summary': 'It is egg-shaped.'
            }
          ]
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getAnswer(uuid1, uuid2)).toEqual(testQuestions[0].answers[0])
    })
  })

  describe('addAnswer', () => {
    test('should throw error if question does not exist', async () => {
      const testAnswer1 = {
        summary: 'Who are you?',
        author: 'Tim Doods'
      }
      await expect(questionRepo.addAnswer(faker.datatype.uuid(), testAnswer1)).rejects.toThrow()
    })

    test('should return new answer array lenght', async () => {
      const uuid1 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      const testAnswer1 = {
        summary: 'Tim',
        author: 'Tim Doods'
      }
      await questionRepo.addAnswer(uuid1, testAnswer1)

      expect((await questionRepo.getAnswers(uuid1)).length).toBeGreaterThan(testQuestions[0].answers.length)


      const testAnswer2 = {
        summary: 'Jack',
        author: 'Jack London'
      }
      await questionRepo.addAnswer(uuid1, testAnswer2)

      expect((await questionRepo.getAnswers(uuid1)).length).toBeGreaterThan(testQuestions[0].answers.length + 1)

    })

    test('added data should be equal to that which was added', async () => {
      const uuid1 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      const testAnswer1 = {
        summary: 'Tim',
        author: 'Tim Doods'
      }
      await questionRepo.addAnswer(uuid1, testAnswer1)

      expect((await questionRepo.getAnswers(uuid1)).at(-1).summary).toEqual(testAnswer1.summary)
      expect((await questionRepo.getAnswers(uuid1)).at(-1).author).toEqual(testAnswer1.author)
    })

    test('should throw and error when given author or summary is not typeof string', async () => {
      const uuid1 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      const testQuestion1 = {
        summary: '2',
        author: 123
      }

      await expect(questionRepo.addAnswer(uuid1, testQuestion1)).rejects.toThrow()

      const testQuestion2 = {
        summary: 321,
        author: 'Jim Smith'
      }

      await expect(questionRepo.addAnswer(uuid1, testQuestion2)).rejects.toThrow()

      const testQuestion3 = {
        summary: 321,
        author: 123
      }

      await expect(questionRepo.addAnswer(uuid1, testQuestion3)).rejects.toThrow()
    })

    test('should throw and error when author or summary is undefined', async () => {
      const uuid1 = uuidv4()
      const testQuestions = [
        {
          id: uuid1,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))


      const testQuestion1 = {
        summary: 'Who are you?',
        author: undefined
      }

      await expect(questionRepo.addAnswer(uuid1, testQuestion1)).rejects.toThrow()

      const testQuestion2 = {
        author: 'Jim Smith'
      }

      await expect(questionRepo.addAnswer(uuid1, testQuestion2)).rejects.toThrow()

      const testQuestion3 = {
      }

      await expect(questionRepo.addAnswer(uuid1, testQuestion3)).rejects.toThrow()
    })
  })
})
