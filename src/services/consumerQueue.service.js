'use strict'

const {
  consumerQueue,
  connectToRabbitMQ
} = require('../dbs/init.rabbit')

// const log = console.log
// console.log = function () {
//   log.apply(console, [new Date()].concat(arguments))
// }

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ()
      await consumerQueue(channel, queueName)
    } catch (error) {
      console.error('Error in consumerToQueue:', error)

    }
  },
  //case processing
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ()
      const notiQueue = 'notificationQueueProcess' //assrtQueue

      // 1. TLL ------Truong hop 1
      // const timeExpired = 15000
      // setTimeout(() => {
      //   channel.consume(notiQueue, msg =>{
      //     console.log(`Send notificationQUeue Success::` , msg.content.toString())
      //     channel.ack(msg)
      //   })
      // } , timeExpired)
      // 2. Logic  ------Truong hop 2

      channel.consume(notiQueue, msg => {
        try {
          const numberTest = Math.random()
          console.log(`numberTest: `, numberTest)
          if (numberTest < 0.8) {
            throw new Error('Send notificationQUeue Fail HOT FIX')
          }
          console.log('Send notificationQUeue Success::', msg.content.toString())
          channel.ack(msg) // Acknowledge the message (if success then ack)
        } catch (error) {
          // console.error('Error processing message:', error)
          channel.nack(msg, false, false) // Reject the message and do not requeue it and only reject this current msg
          //but here we push to the Fail queue
        }
      })
    } catch (error) {
      console.error('Error in consumerToQueueNormal:', error)
    }
  },
  //case failed processing
  consumerToQueueFail: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ()

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
      await channel.consume(queueResult.queue, msgFail => {
        console.log(`Send notificationQUeue Fail , please hot fix::`, msgFail.content.toString())
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
