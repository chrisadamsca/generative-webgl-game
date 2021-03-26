import { AudioManager } from "../audio/AudioManager";
import { CollisionData, CollisionManager } from "../collision/CollisionManager";
import { Shader } from "../gl/Shader";
import { AABB } from "../graphics/shapes/AABB";
import { Circle2D } from "../graphics/shapes/Circle2D";
import { IShape } from "../graphics/shapes/IShape";
import { Rectangle2D } from "../graphics/shapes/Rectangle2d";
import { IMessageHandler } from "../message/IMessageHandler";
import { COLLISION_ENTRY, Message, POINT } from "../message/Message";
import { LevelManager } from "../world/LevelManager";
import { BaseComponent } from "./BaseComponent";
import { CollisionComponent } from "./CollisionComponent";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class PointComponentData implements IComponentData {

    public name: string;
    public type: string;
    public collisionName: string

    public setFromJSON(json: any): void {
        if (json.name === undefined) {
            throw new Error(`PointComponentData requires 'name' to be defined.`)
        }
        this.name = String(json.name);

        if (json.type === undefined) {
            throw new Error(`PointComponentData requires 'type' to be defined.`)
        }
        this.type = String(json.type);

        if (json.collisionName === undefined) {
            throw new Error(`PointComponentData requires 'collisionName' to be defined.`)
        }
        this.collisionName = String(json.collisionName);
    }
    
}

export class PointComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return 'point';
    };

    public buildFromJSON(json: any): IComponent {
        const data = new PointComponentData();
        data.setFromJSON(json);
        return new PointComponent(data);
    }

}


ComponentManager.registerBuilder(new PointComponentBuilder());

export class PointComponent extends BaseComponent implements IMessageHandler {
    
    private _name: string;
    private _associatedCollisionComponent: string;
    
    public constructor(data: PointComponentData) {
        super(data);
        this._associatedCollisionComponent = data.collisionName;
        Message.subscribe(COLLISION_ENTRY + this._associatedCollisionComponent, this);
    }

    public onMessage(message: Message): void {
        switch (message.code) {
            case COLLISION_ENTRY + this._associatedCollisionComponent:
                
                const data: CollisionData = message.context as CollisionData;
                if (data.a.name === 'playerCollision' || data.b.name === 'playerCollision') {
                    AudioManager.playSound('ding');
                    this.owner.unload();
                    Message.send(POINT + LevelManager.activeLevel.id, this);
                }
                break;
            default:
                break;
        }
    }

    public load(): void {
        super.load();
    }

    public unload(): void {
        super.unload();
        Message.unsubscribe(COLLISION_ENTRY + this._associatedCollisionComponent, this);
    }


    update(time: number): void {
        super.update(time);
    }

    public render(shader: Shader): void {
        super.render(shader);
    }

}