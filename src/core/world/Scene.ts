import { Shader } from "../gl/Shader";
import { GameObject } from "./GameObject";

export class Scene {

    private _root: GameObject;

    public constructor() {
        this._root = new GameObject(0, '__ROOT__', this);
    }

    public get root(): GameObject {
        return this._root;
    }

    public get isLoaded(): boolean {
        return this._root.isLoaded;
    }

    public addObject(object: GameObject): void {
        this._root.addChild(object);
    }

    public getObjectByName(name: string): GameObject {
        return this._root.getObjectByName(name);
    }

    public load(): void {
        this._root.load();
    }

    public update(time: number): void {
        this._root.update(time);
    }

    public render(shader: Shader): void {
        this._root.render(shader);
    }

}