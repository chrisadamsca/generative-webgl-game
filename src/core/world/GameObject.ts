import { Shader } from "../gl/Shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Transform } from "../math/Transform";
import { Scene } from "./Scene";

export class GameObject {

    private _id: number;
    private _children: GameObject[] = [];
    private _parent: GameObject;
    private _isLoaded: boolean = false;
    private _scene: Scene;

    private _localMatrix: Matrix4x4 = Matrix4x4.identity();
    private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

    public name: string;
    public transform: Transform = new Transform();

    public constructor(id: number, name: string, scene?: Scene) {
        this._id = id;
        this.name = name;
        this._scene = scene;
    }

    public get id(): number {
        return this._id;
    }

    public get parent(): GameObject {
        return this._parent;
    }

    public get worldMatrix(): Matrix4x4 {
        return this._worldMatrix;
    }

    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    public addChild(child: GameObject): void {
        child._parent = this;
        this._children.push(child);
        child.onAdded(this._scene);
    }

    public removeChild(child: GameObject): void {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            child._parent = undefined;
            this._children.splice(index, 1);
        }
    }

    public getObjectByName(name: string): GameObject {
        if (this.name = name) return this;

        for (const child of this._children) {
            const result = child.getObjectByName(name);
            if (result !== undefined) return result;
        }

        return undefined;
    }

    public load(): void {
        this._isLoaded = true;

        for (const child of this._children) {
            child.load();
        }
    }

    public update(time: number): void {
        for (const child of this._children) {
            child.update(time);
        }
    }

    public render(shader: Shader): void {
        for (const child of this._children) {
            child.render(shader);
        }
    }

    protected onAdded(scene: Scene): void {
        this._scene = scene;
    }

}