'use strict'

const { consumerToQueue,consumerToQueueFail,consumerToQueueNormal } = require('./src/services/consumerQueue.service')
const queueName = 'test-topic'

// consumerToQueue(queueName).then(() => {
//   console.log(`Consumer started for queue: ${queueName}`)
// }).catch( err => {
//   console.error('Error starting consumer:', err)
// })

consumerToQueueNormal(queueName).then(() => {
  console.log(`Consumer started for consumerToQueueNormal`)
}).catch( err => {
  console.error('Error starting consumer:', err)
})

consumerToQueueFail(queueName).then(() => {
  console.log(`Consumer started for consumerToQueueFail`)
}).catch( err => {
  console.error('Error starting consumer:', err)
})