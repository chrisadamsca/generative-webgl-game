import { IMessageHandler } from "./IMessageHandler";
import { Message, MessagePrio } from "./Message";
import { MessageSubscriptionNode } from "./MessageSubscriptionNode";

export class MessageBus {

    private static _subscriptions: {[code: string]: IMessageHandler[]} = {};
    private static _normalQueueMessagePerUpdate: number = 10;
    private static _nomralMessageQueue: MessageSubscriptionNode[] = [];

    private constructor() {}

    public static addSubscription(code: string, handler: IMessageHandler): void {
        if (MessageBus._subscriptions[code] !== undefined) {
            MessageBus._subscriptions[code] = [];
        }

        if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
            console.warn(`Attempting to add a duplicate handler to code ${code}. Subscription not added.`);
        } else {
            MessageBus._subscriptions[code].push(handler);
        }
    }

    public static removeSubscription(code: string, handler: IMessageHandler): void {
        if (MessageBus._subscriptions[code] === undefined) {
            console.warn(`Cannot unsubscribe handler from code ${code}, because that code is not subscribed to.`);
            return; 
        }

        let nodeIndex = MessageBus._subscriptions[code].indexOf(handler);
        if (nodeIndex !== -1) {
            MessageBus._subscriptions[code].splice(nodeIndex, 1);
        }
    }

    public static post(message: Message): void {
        console.log('Message posted: ', message);
        let handlers = MessageBus._subscriptions[message.code];
        if (handlers === undefined) return;

        for (const handler of handlers) {
            if (message.priority === MessagePrio.HIGH) {
                handler.onMessage(message);
            } else {
                MessageBus._nomralMessageQueue.push(new MessageSubscriptionNode(message, handler));
            }
        }
    }

    public static update(time: number): void {
        if (MessageBus._nomralMessageQueue.length === 0) return;
        
        const messageLimit = Math.min(MessageBus._normalQueueMessagePerUpdate, MessageBus._nomralMessageQueue.length);
        for (let i = 0; i < messageLimit; i++) {
            const node = MessageBus._nomralMessageQueue.pop();
            node.handler.onMessage(node.message);
            
        }
    }

}