import { Shader } from "../gl/Shader";
import { GameObject } from "../world/GameObject";

export interface IComponent {

    name: string;
    readonly owner: GameObject;

    setOwner(owner: GameObject): void;
    load(): void;
    update(time: number): void;
    render(shader: Shader): void;

}