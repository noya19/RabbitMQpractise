import { RabbitMQService } from "../lib/MessageQueue/rabbitMQ.service";
import { intoResultAsync } from "../lib/Resuts";

import * as dotenv from 'dotenv';

dotenv.config();


class Producer {
    private rmqs: RabbitMQService;
    constructor(){
        this.rmqs = new RabbitMQService({
            host: `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
            queue: process.env.RABBIT_MQ_PIPES_RESPONSE_QUEUE_NAME!,
            auto_ack: true
        });
    }

    async sendMessge(data: string){
        const [sendRes, sendError] = await intoResultAsync(this.rmqs.publishToQueue.bind(this.rmqs), data);
        if(sendError){
            console.log("Send Error", sendError);
        }

        console.log("Is Message Send -->", sendRes);
    }
}

export const producer = new Producer();