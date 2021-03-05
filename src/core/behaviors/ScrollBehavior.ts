import { Vector2 } from "../math/Vector2";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/Message";
import { BaseBehavior } from "./BaseBehavior";
import { BehaviorManager } from "./BehaviorManager";
import { IBehavior } from "./IBehavior";
import { IBehaviorBuilder } from "./IBehaviorBuilder";
import { IBehaviorData } from "./IBehaviorData";

export class ScrollBehaviorData implements IBehaviorData {

    public name: string;
    public velocity: Vector2 = Vector2.zero;
    public minPosition: Vector2 = Vector2.zero;
    public resetPosition: Vector2 = Vector2.zero;
    public startMessage: string;
    public stopMessage: string;
    public resetMessage: string;

    public setFromJSON(json: any): void {
        if (json.name === undefined ) {
            throw new Error('Name must be defined in behavior data.');
        }
        this.name = String(json.name);

        if (json.velocity === undefined ) {
            throw new Error('ScrollBehaviorData requires property "velocity" to be defined.');
        }
        this.velocity.setFromJSON(json.velocity);

        if (json.minPosition === undefined ) {
            throw new Error('ScrollBehaviorData requires property "minPosition" to be defined.');
        }
        this.minPosition.setFromJSON(json.minPosition);
        
        if (json.resetPosition === undefined ) {
            throw new Error('ScrollBehaviorData requires property "resetPosition" to be defined.');
        }
        this.resetPosition.setFromJSON(json.resetPosition);

        if (json.resetMessage !== undefined) {
            this.resetMessage = String(json.resetMessage);
        }

        if (json.startMessage !== undefined) {
            this.startMessage = String(json.startMessage);
        }
        
        if (json.stopMessage !== undefined) {
            this.stopMessage = String(json.stopMessage);
        }
    }

}

export class ScrollBehaviorBuilder implements IBehaviorBuilder {

    public get type(): string {
        return 'scroll';
    };

    public buildFromJSON(json: any): IBehavior {
        const data = new ScrollBehaviorData();
        data.setFromJSON(json);
        return new ScrollBehavior(data);
    }

}

export class ScrollBehavior  extends BaseBehavior implements IMessageHandler {

    private _velocity: Vector2 = Vector2.zero;
    private _minPosition: Vector2 = Vector2.zero;
    private _resetPosition: Vector2 = Vector2.zero;
    private _startMessage: string;
    private _stopMessage: string;
    private _resetMessage: string;

    private _isScrolling: boolean = false;
    private _initalPosition: Vector2 = Vector2.zero;


    public constructor(data: ScrollBehaviorData) {
        super(data);
        this._velocity.copyFrom(data.velocity);
        this._minPosition.copyFrom(data.minPosition);
        this._resetPosition.copyFrom(data.resetPosition);
        this._startMessage = data.startMessage;
        this._resetMessage = data.resetMessage;
        this._stopMessage = data.stopMessage;
    }
    
    public updateReady(): void {
        super.updateReady();

        if (this._startMessage !== undefined) {
            Message.subscribe(this._startMessage, this);
        }
        
        if (this._stopMessage !== undefined) {
            Message.subscribe(this._stopMessage, this);
        }

        if (this._resetMessage !== undefined) {
            Message.subscribe(this._resetMessage, this);
        }

        this._initalPosition.copyFrom(this._owner.transform.position.toVector2());
    }

    public update(time: number): void {
        if (this._isScrolling) {
            this._owner.transform.position.add(this._velocity.clone().scale(time/1000).toVector3());

            if (this._owner.transform.position.x <= this._minPosition.x &&
                this._owner.transform.position.y <= this._minPosition.y) {
                    this.reset();
                }
        }
    }

    public onMessage(message: Message): void {
        if (message.code === this._startMessage) {
            this._isScrolling = true;
        } else if (message.code === this._stopMessage) {
            this._isScrolling = false;
        } else if (message.code === this._resetMessage) {
            this.initial();
        }
    }

    private reset(): void {
        this._owner.transform.position.copyFrom(this._resetPosition.toVector3());
    }

    private initial(): void {
        this._owner.transform.position.copyFrom(this._initalPosition.toVector3());
    }

}

BehaviorManager.registerBuilder(new ScrollBehaviorBuilder());