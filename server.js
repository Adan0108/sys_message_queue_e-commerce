'use strict'

const { consumerToQueue } = require('./src/services/consumerQueue.service')
const queueName = 'test-topic'

consumerToQueue(queueName).then(() => {
  console.log(`Consumer started for queue: ${queueName}`)
}).catch( err => {
  console.error('Error starting consumer:', err)
})