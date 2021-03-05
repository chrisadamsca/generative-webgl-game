import { AudioManager } from "../audio/AudioManager";
import { CollisionData } from "../collision/CollisionManager";
import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { InputManager, Keys } from "../input/InputManager";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/Message";
import { BaseBehavior } from "./BaseBehavior";
import { BehaviorManager } from "./BehaviorManager";
import { IBehavior } from "./IBehavior";
import { IBehaviorBuilder } from "./IBehaviorBuilder";
import { IBehaviorData } from "./IBehaviorData";

export class PlayerBehaviorData implements IBehaviorData {

    public name: string;
    public acceleration: Vector2 = new Vector2(0, 920);
    public playerCollisionComponent: string;
    public groundCollisionComponent: string;
    public animatedSpriteName: string;

    public setFromJSON(json: any): void {
        if (json.name === undefined) {
            throw new Error(`Name must be defined in BehaviorData.`)
        }

        this.name = String(json.name);

        if (json.acceleration !== undefined) {
            this.acceleration.setFromJSON(json.acceleration);
        }

        if (json.animatedSpriteName === undefined) {
            throw new Error(`animatedSpriteName must be defined in BehaviorData.`)
        } else {
            this.animatedSpriteName = String(json.animatedSpriteName);
        }

        if (json.playerCollisionComponent === undefined) {
            throw new Error(`playerCollisionComponent must be defined in BehaviorData.`)
        } else {
            this.playerCollisionComponent = String(json.playerCollisionComponent);
        }
        
        if (json.groundCollisionComponent === undefined) {
            throw new Error(`groundCollisionComponent must be defined in BehaviorData.`)
        } else {
            this.groundCollisionComponent = String(json.groundCollisionComponent);
        }

    }

}

export class PlayerBehaviorBuilder implements IBehaviorBuilder {

    public get type(): string {
        return 'player';
    };

    public buildFromJSON(json: any): IBehavior {
        const data = new PlayerBehaviorData();
        data.setFromJSON(json);
        return new PlayerBehavior(data);
    }

}

export class PlayerBehavior extends BaseBehavior implements IMessageHandler {

    private _acceleration: Vector2;
    private _velocity: Vector2 = Vector2.zero;
    private _isAlive: boolean = true;
    private _playerCollisionComponent: string;
    private _groundCollisionComponent: string;
    private _animatedSpriteName: string;
    private _isPlaying: boolean = false;
    private _initialPosition: Vector3 = Vector3.zero;
    
    private _sprite: AnimatedSpriteComponent;
    private _pipeNames: string[] = ["pipe1Collision_end", "pipe1Collision_middle_top", "pipe1Collision_endneg", "pipe1Collision_middle_bottom"]

    public constructor(data: PlayerBehaviorData) {
        super(data);
        
        this._acceleration = data.acceleration;
        this._groundCollisionComponent = data.groundCollisionComponent;
        this._playerCollisionComponent = data.playerCollisionComponent;
        this._animatedSpriteName = data.animatedSpriteName;

        Message.subscribe('MOUSE_DOWN', this);
        Message.subscribe('KEY_DOWN', this);
        Message.subscribe('COLLISION_ENTRY::' + this._playerCollisionComponent, this);
        Message.subscribe('GAME_RESET', this);
        Message.subscribe('GAME_START', this);
    }

    public onMessage(message: Message): void {
        switch (message.code) {
            case 'MOUSE_DOWN':
            case 'KEY_DOWN':
                console.warn('FLAPP GODAMMIT');
                
                this.onFlap();
                break;
            case 'COLLISION_ENTRY::' + this._playerCollisionComponent:
                const data: CollisionData = message.context as CollisionData;
                if (data.a.name === this._groundCollisionComponent || data.b.name === this._groundCollisionComponent) {
                    this.die();
                    this.decelerate();
                }
                if (this._pipeNames.indexOf(data.a.name) !== -1 || this._pipeNames.indexOf(data.a.name) !== -1 ) {
                    this.die();
                }
                break;
            case 'GAME_RESET':
                this.reset();
                break;
            case 'GAME_START':
                this.start();
                break;
            default:
                break;
        }
    }

    public updateReady(): void {
        super.updateReady();

        this._sprite = this._owner.getComponentByName(this._animatedSpriteName) as AnimatedSpriteComponent;
        if (this._sprite === undefined) {
            throw new Error(`AnimatedSpriteComponent '${this._animatedSpriteName}' is not attached to the owner of this component`);
        }

        this._sprite.setFrame(0);

        this._initialPosition.copyFrom(this._owner.transform.position);

    }

    public update(time: number): void {
        const seconds = time / 1000;

        if (this._isPlaying) {
            this._velocity.add(this._acceleration.clone().scale(seconds));
        }

        // Limit max speed
        if (this._velocity.y > 400) {
            this._velocity.y = 400;
        }

        // Prevent flying to high
        if (this._owner.transform.position.y < -13) {
            this._owner.transform.position.y = -13;
            this._velocity.y = 0;
        }
        
        this._owner.transform.position.add(this._velocity.clone().scale(seconds).toVector3());
        this._owner.transform.position.add(new Vector3(0, 1, 0));

        if (this._velocity.y < 0) {
            this._owner.transform.rotation.z -= (Math as any).degToRad(600.0) * seconds;
            if (this._owner.transform.rotation.z < (Math as any).degToRad(-20)) {
                this._owner.transform.rotation.z = (Math as any).degToRad(-20);
            }
        }

        if (this.isFalling || !this._isAlive) {
            this._owner.transform.rotation.z += (Math as any).degToRad(480.0) * seconds;
            if (this._owner.transform.rotation.z > (Math as any).degToRad(90)) {
                this._owner.transform.rotation.z = (Math as any).degToRad(90);
            }
        }

        if (this.shouldNotFlap()) {
            this._sprite.stop();
        } else {
            if (!this._sprite.isPlaying) {
                this._sprite.play();
            }
        }

        super.update(time);
    }

    private isFalling(): boolean {
        return this._velocity.y > 220.0;
    }

    private shouldNotFlap(): boolean {
        return this._isPlaying || this._velocity.y > 220.0 || !this._isAlive;
    }

    private die(): void {
        if (this._isAlive) {
            this._isAlive = false;
            // AudioManager.playSound('dead');
            Message.send('PLAYER_DIED', this);
        }
    }

    private reset(): void {
        this._isAlive = true;
        this._isPlaying = false;
        this._sprite.owner.transform.position.copyFrom(this._initialPosition);
        this._sprite.owner.transform.rotation.z = 0;

        this._velocity.set(0, 0);
        this._acceleration.set(0, 920);
        this._sprite.play();
    }

    private start(): void {
        console.warn('#### STARTING');
        
        this._isPlaying = true;
        Message.send('PLAYER_RESET', this);
    }

    private decelerate(): void {
        this._acceleration.y = 0;
        this._velocity.y = 0;
    }

    private onFlap(): void {
        if (this._isAlive && this._isPlaying) {
            this._velocity.y = -280;
            AudioManager.playSound('flap');
        }
    }

    private onRestart(y: number): void {
        this._owner.transform.rotation.z = 0;
        this._owner.transform.position.set(33, y);
        this._velocity.set(0, 0);
        this._acceleration.set(0, 920);
        this._isAlive = true;
        this._sprite.play();
    }

}

BehaviorManager.registerBuilder(new PlayerBehaviorBuilder());