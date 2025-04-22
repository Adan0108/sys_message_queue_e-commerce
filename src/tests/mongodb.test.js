'use strict'

const mongoose = require('mongoose')
const connectionString = 'mongodb://localhost:27017/E-CommerceDev'

const TestSchema = new mongoose.Schema({ name: String })

const Test = mongoose.model('Test', TestSchema)

describe('MongoDB Connection', () => {
  let connection;
  
  beforeAll( async() => {
    connection = await mongoose.connect(connectionString)
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should connect to MongoDB successfully', async () => {
    expect(mongoose.connection.readyState).toBe(1)
  })  

  it('shoould a save document to the database', async () => {
    const user = new Test({ name: 'Adan' })
    await user.save()
    expect(user.isNew).toBe(false)
  })

  it('find a document to the database', async () => {
    const user = await Test.findOne({ name: 'Adan' })
    expect(user).toBeDefined()
    expect(user.name).toBe('Adan')
  })
  
})


