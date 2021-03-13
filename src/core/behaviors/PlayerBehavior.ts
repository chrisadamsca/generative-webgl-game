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
    public speed: number;
    // public acceleration: Vector2 = new Vector2(0, 920);
    public playerCollisionComponent: string;
    public groundCollisionComponent: string;

    public setFromJSON(json: any): void {
        if (json.name === undefined) {
            throw new Error(`Name must be defined in BehaviorData.`)
        }

        this.name = String(json.name);

        // if (json.acceleration !== undefined) {
        //     this.acceleration.setFromJSON(json.acceleration);
        // }

        if (json.speed !== undefined) {
            this.speed = Number(json.speed);
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

    // private _acceleration: Vector2;
    private _velocity: Vector3 = Vector3.zero;
    private _started: boolean = false;
    private _speed: number = 0.1;
    private _isAlive: boolean = true;
    private _playerCollisionComponent: string;
    private _groundCollisionComponent: string;
    private _initialPosition: Vector3 = Vector3.zero;

    private _collidingGround: number[] = [];

    private _prevPosition: Vector3 = Vector3.zero;

    private _blockedDirections: {[direction: string]: boolean} = {
        left: false,
        top: false,
        right: false,
        bottom: false
    }
    

    public constructor(data: PlayerBehaviorData) {
        super(data);
        
        // this._acceleration = data.acceleration;
        this._groundCollisionComponent = data.groundCollisionComponent;
        this._playerCollisionComponent = data.playerCollisionComponent;

        Message.subscribe('KEY_DOWN', this);
        Message.subscribe('COLLISION_ENTRY::' + this._playerCollisionComponent, this);
        Message.subscribe('COLLISION_EXIT::' + this._playerCollisionComponent, this);
        Message.subscribe('GAME_RESET', this);
        Message.subscribe('GAME_START', this);
    }

    public onMessage(message: Message): void {
        let data: CollisionData;
        switch (message.code) {
            case 'MOUSE_DOWN':
            case 'KEY_DOWN':
                // this.onFlap();
                this.start();
                break;
            case 'COLLISION_ENTRY::' + this._playerCollisionComponent:
                data = message.context as CollisionData;
                if (data.a.name === this._groundCollisionComponent || data.b.name === this._groundCollisionComponent) {
                    const otherId = data.a.owner.id === this._owner.id ? data.b.owner.id : data.a.owner.id;
                    this._collidingGround.push(otherId);
                    console.warn('touching ground ENTER', this._collidingGround);
                }

                if (data.a.isImpenetrable) {
                    if (this._owner.getWorldPosition().x < data.a.owner.getWorldPosition().x) {
                        this._blockedDirections['right'] = true;
                    } 
                    if (this._owner.getWorldPosition().x > data.a.owner.getWorldPosition().x) {
                        this._blockedDirections['left'] = true;
                    }  
                    if (this._owner.getWorldPosition().z < data.a.owner.getWorldPosition().z) {
                        this._blockedDirections['top'] = true;
                    }
                    if (this._owner.getWorldPosition().z > data.a.owner.getWorldPosition().z) {
                        this._blockedDirections['bottom'] = true;
                    }
                }
                break;
            case 'COLLISION_EXIT::' + this._playerCollisionComponent:
                data = message.context as CollisionData;

                if (data.a.name === this._groundCollisionComponent || data.b.name === this._groundCollisionComponent) {
                    const otherId = data.a.owner.id === this._owner.id ? data.b.owner.id : data.a.owner.id;
                    this._collidingGround = this._collidingGround.filter(p => p !== otherId);
                    console.warn('touching ground EXIT', this._collidingGround);
                }

                if (data.a.isImpenetrable) {
                    if (this._owner.getWorldPosition().x < data.a.owner.getWorldPosition().x) {
                        this._blockedDirections['right'] = false;
                    }
                    if (this._owner.getWorldPosition().x > data.a.owner.getWorldPosition().x) {
                        this._blockedDirections['left'] = false;
                    }
                    if (this._owner.getWorldPosition().z < data.a.owner.getWorldPosition().z) {
                        this._blockedDirections['top'] = false;
                    }
                    if (this._owner.getWorldPosition().z > data.a.owner.getWorldPosition().z) {
                        this._blockedDirections['bottom'] = false;
                    }
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

        this._initialPosition.copyFrom(this._owner.transform.position);

    }

    public update(time: number): void {
        const seconds = time / 1000;

        // if (this._started && this.isFalling()) {
        //     this.die();
        //     this._owner.transform.position.y -= this._speed;
        // }

        if (this._isAlive) {
            if (InputManager.isKeyDown(Keys.LEFT) || InputManager.isKeyDown(Keys.A)) {
                if (!this._blockedDirections['bottom']) {
                    this._owner.transform.position.z -= this._speed;
                }
            }
            
            if (InputManager.isKeyDown(Keys.RIGHT) || InputManager.isKeyDown(Keys.D)) {
                if (!this._blockedDirections['top']) {
                    this._owner.transform.position.z += this._speed;
                }
            }
            
            if (InputManager.isKeyDown(Keys.UP) || InputManager.isKeyDown(Keys.W)) {
                // console.warn('#### asd', this._blockedDirections);
                
                if (!this._blockedDirections['right']) {
                    this._owner.transform.position.x += this._speed;
                }
            }
    
            if (InputManager.isKeyDown(Keys.DOWN) || InputManager.isKeyDown(Keys.S)) {
                if (!this._blockedDirections['left']) {
                    this._owner.transform.position.x -= this._speed;
                }
            }

        }

        if (this._owner.transform.position.y < -10) {
            this.reset();
        }


        // // Limit max speed
        // if (this._velocity.y > 400) {
        //     this._velocity.y = 400;
        // }

        // Prevent flying to high
        // if (this._owner.transform.position.y < -13) {
        //     this._owner.transform.position.y = -13;
        //     this._velocity.y = 0;
        // }
        
        // this._owner.transform.position.add(this._velocity.clone().scale(seconds).toVector3());
        // this._owner.transform.position.add(new Vector3(0, 1, 0));

        // if (this._velocity.y < 0) {
        //     this._owner.transform.rotation.z -= (Math as any).degToRad(600.0) * seconds;
        //     if (this._owner.transform.rotation.z < (Math as any).degToRad(-20)) {
        //         this._owner.transform.rotation.z = (Math as any).degToRad(-20);
        //     }
        // }

        // if (this.isFalling || !this._isAlive) {
        //     this._owner.transform.rotation.z += (Math as any).degToRad(480.0) * seconds;
        //     if (this._owner.transform.rotation.z > (Math as any).degToRad(90)) {
        //         this._owner.transform.rotation.z = (Math as any).degToRad(90);
        //     }
        // }

        super.update(time);
    }

    private isFalling(): boolean {
        return this._collidingGround.length === 0;
    }

    private die(): void {
        if (this._isAlive) {
            this._isAlive = false;
            // AudioManager.playSound('dead');
            Message.send('PLAYER_DIED', this);
        }
    }

    private reset(): void {
        this._owner.transform.position.x = 0;
        this._owner.transform.position.y = 3.1;
        this._owner.transform.position.z = 0;
        // this._isPlaying = false;
        // this._sprite.owner.transform.position.copyFrom(this._initialPosition);
        // this._sprite.owner.transform.rotation.z = 0;
        // this.owner.transform.rotation.z = 0;

        // this._velocity.set(0, 0);
        // this._acceleration.set(0, 920);
        // this._sprite.play();
    }

    private start(): void {
        console.warn('#### STARTING');
        this._isAlive = true;
        this._started = true;
        Message.send('PLAYER_RESET', this);
    }

    private decelerate(): void {
        // this._acceleration.y = 0;
        // this._velocity.y = 0;
    }


    private onRestart(y: number): void {
        this._owner.transform.rotation.z = 0;
        this._owner.transform.position.set(33, y);
        // this._velocity.set(0, 0);
        // this._acceleration.set(0, 920);
        this._isAlive = true;
        // this._sprite.play();
    }

}

BehaviorManager.registerBuilder(new PlayerBehaviorBuilder());