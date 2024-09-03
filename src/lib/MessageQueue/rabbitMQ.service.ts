import * as ampqlib from 'amqplib';
import { Channel, Message } from 'amqplib';

export interface IRabbitMQService{
    createChannel: () => Promise<Channel>
    consumeFromQueue: (cb: Function) => Promise<any>
    publishToQueue: (data: string) => Promise<any>
    basic_ack: () => void
}

interface RabbitMQInput{
    host: string,
    queue: string,
    auto_ack?: boolean
}

export class RabbitMQService implements IRabbitMQService{
    private channel: Channel = {} as Channel;
    private message: Message ={} as Message;
    
    host: string;
    queue: string;
    auto_ack: boolean;

    constructor(args: RabbitMQInput){
        this.host = args.host;
        this.queue = args.queue
        this.auto_ack = args.auto_ack ?? true;

        console.log("Host", this.host);
        console.log("Queue", this.queue);
    }

    async createChannel(): Promise<Channel>{
        const connection = await ampqlib.connect(this.host);
        const channel = await connection.createChannel();

        //Create a queue.
        channel.assertQueue(this.queue);
        return channel;
    }

    //Consume from Queue.
    async consumeFromQueue(cb: Function){
        if(Object.keys(this.channel).length === 0){
            this.channel = await this.createChannel();
        }

        await this.channel.assertQueue(this.queue);
        this.channel.consume(this.queue, (msg: Message | null) => {
           
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                this.message = msg;
               
                // ack if auto_ack is enabled by default
                if(this.auto_ack) {
                    this.channel.ack(msg);
                }

                // if callback provided we execute callback
                if(typeof cb === "function") {
                    cb(data);
                }

                if(!this.auto_ack)
                    this.channel.ack(msg);
            } 
        })
    }

    //Publish to Queue.
    async publishToQueue (data: string) {
        if (Object.keys(this.channel).length == 0) {
            this.channel = await this.createChannel();
        }

        await this.channel.assertQueue(this.queue, { durable: true });
        const res = this.channel.sendToQueue(this.queue, Buffer.from(data));
        return res;

    }

    async basic_ack() {
        if( Object.keys(this.message).length > 0 ) {
            this.channel.ack(this.message);
        }
    }
}