import { Shader } from "../gl/Shader";
import { GameObject } from "../world/GameObject";
import { IComponent } from "./IComponent";
import { IComponentData } from "./IComponentData";

export abstract class BaseComponent implements IComponent {
    
    protected _owner: GameObject;
    protected _data: IComponentData;
    
    public name: string;
    
    public constructor(data: IComponentData) {
        this._data = data;
        this.name = data.name;
    }

    public get owner(): GameObject {
        return this._owner;
    }

    public setOwner(owner: GameObject): void {
        this._owner = owner;
    }

    public load(): void {

    }

    public updateReady(): void {
        
    };
    
    public update(time: number): void {
        
    }

    public render(shader: Shader): void {

    }

}