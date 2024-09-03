"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const ampqlib = __importStar(require("amqplib"));
class RabbitMQService {
    channel = {};
    message = {};
    host;
    queue;
    auto_ack;
    constructor(args) {
        this.host = args.host;
        this.queue = args.queue;
        this.auto_ack = args.auto_ack ?? true;
        console.log("Host", this.host);
        console.log("Queue", this.queue);
    }
    async createChannel() {
        const connection = await ampqlib.connect(this.host);
        const channel = await connection.createChannel();
        //Create a queue.
        channel.assertQueue(this.queue);
        return channel;
    }
    //Consume from Queue.
    async consumeFromQueue(cb) {
        if (Object.keys(this.channel).length === 0) {
            this.channel = await this.createChannel();
        }
        await this.channel.assertQueue(this.queue);
        this.channel.consume(this.queue, (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                this.message = msg;
                // ack if auto_ack is enabled by default
                if (this.auto_ack) {
                    this.channel.ack(msg);
                }
                // if callback provided we execute callback
                if (typeof cb === "function") {
                    cb(data);
                }
                if (!this.auto_ack)
                    this.channel.ack(msg);
            }
        });
    }
    //Publish to Queue.
    async publishToQueue(data) {
        if (Object.keys(this.channel).length == 0) {
            this.channel = await this.createChannel();
        }
        await this.channel.assertQueue(this.queue, { durable: true });
        const res = this.channel.sendToQueue(this.queue, Buffer.from(data));
        return res;
    }
    async basic_ack() {
        if (Object.keys(this.message).length > 0) {
            this.channel.ack(this.message);
        }
    }
}
exports.RabbitMQService = RabbitMQService;
