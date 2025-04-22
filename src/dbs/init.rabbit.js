'use strict';

const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    if (!connection) {
      throw new Error('Failed to connect to RabbitMQ');
    }

    const channel = await connection.createChannel()

    return { channel, connection };

  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

const connectToRabbitMQForTest = async () => {
  try {
    const {channel, connection} = await connectToRabbitMQ();

    //publish message to a queue
    const queue = 'test_queue';
    const message = 'Hello, shopDev by Adan!';
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from(message))

    //Close the connection
    await connection.close()

  } catch (error) {
    console.error('Error connecting to RabbitMQ for test:', error);
    
  }
}

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest
};