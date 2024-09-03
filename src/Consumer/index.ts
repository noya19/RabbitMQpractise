import { RabbitMQService } from "../lib/MessageQueue/rabbitMQ.service";
import { intoResultAsync } from "../lib/Resuts";
import * as dotenv from 'dotenv';

dotenv.config();

export class Consumer{
    private rmqs: RabbitMQService;
    constructor(){
        this.rmqs = new RabbitMQService({
            host: `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
            queue: process.env.RABBIT_MQ_PIPES_RESPONSE_QUEUE_NAME!,
            auto_ack: true
        });
    }

    async consume(){
        const [res, err] = await intoResultAsync(this.rmqs.consumeFromQueue.bind(this.rmqs), (data: any) => {
            console.log("Data Received From Producer", data);
        })
        if(err){
            console.log("Error Consuming Message", err);
        }
    }
}

const c = new Consumer();
c.consume();