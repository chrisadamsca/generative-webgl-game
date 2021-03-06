import { IBehavior } from "../behaviors/IBehavior";
import { IComponent } from "../components/IComponent";
import { Shader } from "../gl/Shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Transform } from "../math/Transform";
import { Vector3 } from "../math/Vector3";
import { Scene } from "./Scene";

export class GameObjectManager {

    private static _count: number = 0;


    public static registerGameObject(): number {
        return ++GameObjectManager._count;
    }

}

export class GameObject {

    private _id: number;
    private _children: GameObject[] = [];
    private _parent: GameObject;
    private _isLoaded: boolean = false;
    private _scene: Scene;

    private _components: IComponent[] = [];
    private _behaviors: IBehavior[] = [];

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

    public getComponentByName(name: string): IComponent {
        for (const component of this._components) {
            if (component.name === name) {
                return component;
            }
        }

        for (const child of this._children) {
            const component = child.getComponentByName(name);
            if (component !== undefined) {
                return component;
            }
        }

        return undefined;
    }

    public getBehaviorByName(name: string): IBehavior {
        for (const behavior of this._behaviors) {
            if (behavior.name === name) {
                return behavior;
            }
        }

        for (const child of this._children) {
            const behavior = child.getBehaviorByName(name);
            if (behavior !== undefined) {
                return behavior;
            }
        }

        return undefined;
    }

    public getObjectByName(name: string): GameObject {
        if (this.name = name) return this;

        for (const child of this._children) {
            const result = child.getObjectByName(name);
            if (result !== undefined) return result;
        }

        return undefined;
    }

    public addComponent(component: IComponent): void {
        this._components.push(component);
        component.setOwner(this);
    }

    public addBehavior(behavior: IBehavior): void {
        this._behaviors.push(behavior);
        behavior.setOwner(this);
    }

    public load(): void {
        this._isLoaded = true;

        for (const component of this._components) {
            component.load();
        }

        for (const child of this._children) {
            child.load();
        }
    }

    public unload(): void {
        this._isLoaded = false;

        for (const component of this._components) {
            component.unload();
        }

        for (const child of this._children) {
            child.unload();
        }
    }

    public updateReady(): void {
        for (const component of this._components) {
            component.updateReady();
        }

        for (const behavior of this._behaviors) {
            behavior.updateReady();
        }

        for (const child of this._children) {
            child.updateReady();
        }
    };

    public update(time: number): void {

        this._localMatrix = this.transform.getTransformationMatrix(); // TODO: recalc only on change, otherwise performance issue
        this.updateWorldMatrix((this._parent !== undefined ? this._parent.worldMatrix : undefined));

        for (const component of this._components) {
            component.update(time);
        }

        for (const behavior of this._behaviors) {
            behavior.update(time);
        }

        for (const child of this._children) {
            child.update(time);
        }
    }

    public render(shader: Shader): void {
        for (const component of this._components) {
            component.render(shader);
        }

        for (const child of this._children) {
            child.render(shader);
        }
    }

    protected onAdded(scene: Scene): void {
        this._scene = scene;
    }

    private updateWorldMatrix(parentWorldMatrix: Matrix4x4): void {
        if (parentWorldMatrix !== undefined) {
            this._worldMatrix = Matrix4x4.multiply(parentWorldMatrix, this._localMatrix);
        } else {
            this._worldMatrix.copyFrom(this._localMatrix);
        }
    }

    public getWorldPosition(): Vector3 {
        return new Vector3(this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14]);
    }

}