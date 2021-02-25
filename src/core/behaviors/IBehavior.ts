import { GameObject } from "../world/GameObject";

export interface IBehavior {

    name: string;

    setOwner(owner: GameObject): void;

    update(time: number): void;
    apply(userData: any): void;

}