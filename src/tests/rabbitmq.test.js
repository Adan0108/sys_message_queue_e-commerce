'use strict'

const { connectToRabbitMQForTest} = require('../dbs/init.rabbit')

describe('RabbitMQ Connection', () => {
  it('should connect to successfully RabbitMQ', async () => {
    const result = await connectToRabbitMQForTest()
    expect(result).toBeUndefined() 
  })
})