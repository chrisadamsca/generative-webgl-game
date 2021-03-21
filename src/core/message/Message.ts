import { IMessageHandler } from "./IMessageHandler";
import { MessageBus } from "./MessageBus";

export const PLAYER_DIED = 'PLAYER_DIED';
export const KEY_DOWN = 'KEY_DOWN';
export const COLLISION_ENTRY = 'COLLISION_ENTRY::';
export const COLLISION_EXIT = 'COLLISION_EXIT::';
export const POINT = 'POINT::';
export const GAME_RESET = 'GAME_RESET';
export const GAME_START = 'GAME_START';
export const MESSAGE_ASSET_LOADER_ASSET_LOADED = 'MESSAGE_ASSET_LOADER_ASSET_LOADED::';

export enum MessagePrio {
    NORMAL,
    HIGH
}

export class Message {
    
    public code: string;
    public context: any;
    public sender: any;
    public priority: MessagePrio;

    public constructor(code: string, sender: any, context?: any, priority: MessagePrio = MessagePrio.NORMAL) {
        this.code = code;
        this.sender = sender;
        this.context = context;
        this.priority = priority;
    }

    public static send(code: string, sender: any, context?: any): void {
        MessageBus.post(new Message(code, sender, context, MessagePrio.NORMAL));
    }

    public static sendPrio(code: string, sender: any, context?: any): void {
        MessageBus.post(new Message(code, sender, context, MessagePrio.HIGH));
    }

    public static subscribe(code: string, handler: IMessageHandler): void {
        MessageBus.addSubscription(code, handler);
    }

    public static unsubscribe(code: string, handler: IMessageHandler): void {
        MessageBus.removeSubscription(code, handler);
    }

}