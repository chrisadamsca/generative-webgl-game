import { Shader } from "../gl/Shader";
import { Sprite } from "../graphics/Sprite";
import { Vector3 } from "../math/Vector3";
import { BaseComponent } from "./BaseComponent";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class SpriteComponentData implements IComponentData {

    public name: string;
    public materialName: string;
    public origin: Vector3 = Vector3.zero;
    public width: number;
    public height: number;
    public type: string;

    public setFromJSON(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.type !== undefined) {
            this.type = String(json.type);
        }

        if (json.width !== undefined) {
            this.width = Number(json.width);
        }

        if (json.height !== undefined) {
            this.height = Number(json.height);
        }

        if (json.materialName !== undefined) {
            this.materialName = String(json.materialName);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJSON(json.origin);
        }
    }
    
}

export class SpriteComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return 'sprite';
    };

    public buildFromJSON(json: any): IComponent {
        const data = new SpriteComponentData();
        data.setFromJSON(json);
        return new SpriteComponent(data);
    }

}


ComponentManager.registerBuilder(new SpriteComponentBuilder());

export class SpriteComponent extends BaseComponent {
    
    private _sprite: Sprite;
    private _width: number;
    private _height: number;

    public constructor(data: SpriteComponentData) {
        super(data);

        this._width = data.width;
        this._height = data.height;

        this._sprite = new Sprite(data.name, data.materialName, this._width, this._height);
        if (!data.origin.equals(Vector3.zero)) {
            this._sprite.origin.copyFrom(data.origin);
        }
    }

    public load(): void {
        this._sprite.load();
    }

    public render(shader: Shader): void {
        this._sprite.draw(shader, this.owner.worldMatrix);
        super.render(shader);
    }

}