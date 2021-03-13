import { Shader } from "../gl/Shader";
import { GameObject } from "../world/GameObject";

export interface IComponent {

    uuid: number;
    name: string;
    type: string;
    active: boolean;
    readonly owner: GameObject;

    setOwner(owner: GameObject): void;
    activate(): void;
    deactivate(): void;
    load(): void;
    updateReady(): void;
    update(time: number): void;
    render(shader: Shader): void;

}