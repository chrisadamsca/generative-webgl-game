import { Shader } from "../gl/Shader";
import { Cube } from "../graphics/Cube";
import { Vector3 } from "../math/Vector3";
import { BaseComponent } from "./BaseComponent";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class CubeComponentData implements IComponentData {

    public name: string;
    public materialName: string;
    public origin: Vector3 = Vector3.zero;
    public width: number;
    public height: number;
    public depth: number;

    public setFromJSON(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.width !== undefined) {
            this.width = Number(json.width);
        }

        if (json.height !== undefined) {
            this.height = Number(json.height);
        }

        if (json.depth !== undefined) {
            this.depth = Number(json.depth);
        }

        if (json.materialName !== undefined) {
            this.materialName = String(json.materialName);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJSON(json.origin);
        }
    }
    
}

export class CubeComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return 'cube';
    };

    public buildFromJSON(json: any): IComponent {
        const data = new CubeComponentData();
        data.setFromJSON(json);
        return new CubeComponent(data);
    }

}


ComponentManager.registerBuilder(new CubeComponentBuilder());

export class CubeComponent extends BaseComponent {
    
    private _cube: Cube;
    private _width: number;
    private _height: number;

    public constructor(data: CubeComponentData) {
        super(data);

        this._width = data.width;
        this._height = data.height;

        this._cube = new Cube(data.name, data.materialName, this._width, this._height, this._height);
        if (!data.origin.equals(Vector3.zero)) {
            this._cube.origin.copyFrom(data.origin);
        }
    }

    public load(): void {
        this._cube.load();
    }

    public render(shader: Shader): void {
        this._cube.draw(shader, this.owner.worldMatrix);
        super.render(shader);
    }

}