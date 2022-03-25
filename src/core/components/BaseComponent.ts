import { Shader } from "../gl/Shader";
import { GameObject } from "../world/GameObject";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentData } from "./IComponentData";

export abstract class BaseComponent implements IComponent {
    
    protected _owner: GameObject;
    protected _data: IComponentData;
    
    public uuid;
    public name: string;
    public type: string;
    public active: boolean = true;
    
    public constructor(data: IComponentData) {
        this._data = data;
        this.name = data.name;
        this.type = data.type;
        this.uuid = ComponentManager.registerComponent();
    }

    public get owner(): GameObject {
        return this._owner;
    }

    public setOwner(owner: GameObject): void {
        this._owner = owner;
    }

    public activate(): void {
        this.active = true;
    }

    public unload(): void {
        this.active = false;
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