import { CollisionManager } from "../collision/CollisionManager";
import { Shader } from "../gl/Shader";
import { AABB } from "../graphics/shapes/AABB";
import { Circle2D } from "../graphics/shapes/Circle2D";
import { IShape } from "../graphics/shapes/IShape";
import { Rectangle2D } from "../graphics/shapes/Rectangle2d";
import { BaseComponent } from "./BaseComponent";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class CollisionComponentData implements IComponentData {

    public name: string;
    public type: string;
    public shape: IShape;
    public static: boolean = true;

    public setFromJSON(json: any): void {
        if (json.name === undefined) {
            throw new Error(`CollisionComponentData requires 'name' to be defined.`)
        }
        this.name = String(json.name);

        if (json.type === undefined) {
            throw new Error(`CollisionComponentData requires 'type' to be defined.`)
        }
        this.type = String(json.type);


        if (json.static !== undefined) {
            this.static = Boolean(json.static);
        }

        if (json.shape === undefined) {
            throw new Error(`CollisionComponentData requires 'shape' to be defined.`)
        } else {
            if (json.shape.type === undefined) {
                throw new Error(`CollisionComponentData requires 'shape.type' to be defined.`)
            }
            
            const shapeType = String(json.shape.type).toLowerCase();
            switch (shapeType) {
                case 'rectangle':
                    this.shape = new Rectangle2D();
                    break;
                case 'circle':
                    this.shape = new Circle2D();
                    break;
                case 'aabb':
                    this.shape = new AABB();
                    break;
                default:
                    throw new Error(`Unsupported shape type: ${shapeType}`);
            }

            this.shape.setFromJson(json.shape);
        }

    }
    
}

export class CollisionComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return 'collision';
    };

    public buildFromJSON(json: any): IComponent {
        const data = new CollisionComponentData();
        data.setFromJSON(json);
        return new CollisionComponent(data);
    }

}


ComponentManager.registerBuilder(new CollisionComponentBuilder());

export class CollisionComponent extends BaseComponent {
    
    private _shape: IShape;
    private _static: boolean;

    public constructor(data: CollisionComponentData) {
        super(data);

        this._shape = data.shape;
        this._static = data.static;
    }

    public get shape(): IShape {
        return this._shape;
    }

    public get isStatic(): boolean {
        return this._static;
    }

    public load(): void {
        super.load();

        this._shape.position.copyFrom(this.owner.getWorldPosition());

        // Tell the collision manager that we exist
        CollisionManager.registerCollisionComponent(this);
    }

    update(time: number): void {
        // TODO: need to get world position for nested objects
        this._shape.position.copyFrom(this.owner.getWorldPosition());

        super.update(time);
    }

    public render(shader: Shader): void {
        super.render(shader);
    }

    public unload(): void {
        super.unload();
        CollisionManager.unRegisterCollisionComponent(this);
    }

    public activate(): void {
        super.activate();
        CollisionManager.registerCollisionComponent(this);
    }

    public onCollisionEntry(other: CollisionComponent): void {

    }
    
    public onCollisionUpdate(other: CollisionComponent): void {

    }
    
    public onCollisionExit(other: CollisionComponent): void {

    }

}