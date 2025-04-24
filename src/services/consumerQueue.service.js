'use strict'

const { 
  consumerQueue,
  connectToRabbitMQ
} = require('../dbs/init.rabbit')

const log = console.log
console.log = function(){
  log.apply(console, [new Date()].concat(arguments))
}

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel , connection } = await connectToRabbitMQ()
      await consumerQueue(channel, queueName)
    } catch (error) {
      console.error('Error in consumerToQueue:', error)
      
    }
  },
  //case processing
  consumerToQueueNormal : async(queueName) => {
    try {
      const { channel , connection } = await connectToRabbitMQ()
      const notiQueue = 'notificationQueueProcess' //assrtQueue

      const timeExpired = 15000
      setTimeout(() => {
        channel.consume(notiQueue, msg =>{
          console.log(`Send notificationQUeue Success::` , msg.content.toString())
          channel.ack(msg)
        })
      } , timeExpired)

    } catch (error) {
      console.error('Error in consumerToQueueNormal:', error)
    }
  },
  //case failed processing
  consumerToQueueFail : async(queueName) => {
    try {
      const { channel , connection } = await connectToRabbitMQ()

      const notificationExchangeDLX = 'notificationExDLX' //notificatio direct\
      const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert

      const notiQueueHandler = 'notificationQueueNotFix'
      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true
      })
      

      const queueResult = await channel.assertQueue(notiQueueHandler, { 
        exclusive: false, //cho phep cac ket noi try cap vao cung luc hang doi
      });

      await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
      await channel.consume(queueResult.queue, msgFail =>{
        console.log(`Send notificationQUeue Fail , please hot fix::` , msgFail.content.toString())
      }, {
        noAck: true // Acknowledge the message automatically ( if send then dont resend)
      })
    } catch (error) {
      console.error('Error in consumerToQueueFail:', error)
      throw error
    }
  }
}

module.exports = messageService
