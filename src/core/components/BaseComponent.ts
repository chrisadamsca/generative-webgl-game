import { Shader } from "../gl/Shader";
import { GameObject } from "../world/GameObject";

export abstract class BaseComponent {
    
    protected _owner: GameObject;
    
    public name: string;
    
    public constructor(name: string) {}

    public get owner(): GameObject {
        return this._owner;
    }

    public setOwner(owner: GameObject): void {
        this._owner = owner;
    }

    public load(): void {

    }

    public update(time: number): void {
        
    }

    public render(shader: Shader): void {

    }

}