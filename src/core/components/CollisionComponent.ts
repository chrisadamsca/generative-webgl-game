import { Shader } from "../gl/Shader";
import { Circle2D } from "../graphics/shapes2D/Circle2D";
import { IShape2D } from "../graphics/shapes2D/IShape2d";
import { Rectangle2D } from "../graphics/shapes2D/Rectangle2d";
import { Sprite } from "../graphics/Sprite";
import { Vector3 } from "../math/Vector3";
import { BaseComponent } from "./BaseComponent";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class CollisionComponentData implements IComponentData {

    public name: string;
    public shape: IShape2D;

    public setFromJSON(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
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
    
    private _shape: IShape2D;

    public constructor(data: CollisionComponentData) {
        super(data);

        this._shape = data.shape;
    }

    public get shape(): IShape2D {
        return this._shape;
    }

    public render(shader: Shader): void {
        // this._sprite.draw(shader, this.owner.worldMatrix);
        super.render(shader);
    }

}