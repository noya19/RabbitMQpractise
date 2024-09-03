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
exports.Consumer = void 0;
const rabbitMQ_service_1 = require("../lib/MessageQueue/rabbitMQ.service");
const Resuts_1 = require("../lib/Resuts");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class Consumer {
    rmqs;
    constructor() {
        this.rmqs = new rabbitMQ_service_1.RabbitMQService({
            host: `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
            queue: process.env.RABBIT_MQ_PIPES_RESPONSE_QUEUE_NAME,
            auto_ack: true
        });
    }
    async consume() {
        const [res, err] = await (0, Resuts_1.intoResultAsync)(this.rmqs.consumeFromQueue.bind(this.rmqs), (data) => {
            console.log("Data Received From Producer", data);
        });
        if (err) {
            console.log("Error Consuming Message", err);
        }
    }
}
exports.Consumer = Consumer;
const c = new Consumer();
c.consume();
