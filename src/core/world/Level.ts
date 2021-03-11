import { vec3 } from "gl-matrix";
import { BehaviorManager } from "../behaviors/BehaviorManager";
import { ComponentManager } from "../components/ComponentManager";
import { Shader } from "../gl/Shader";
import { Vector3 } from "../math/Vector3";
import { GameObject } from "./GameObject";
import { Scene } from "./Scene";

export enum LevelState {
    UNINITIALIZED,
    LOADING,
    UPDATING
}

export class Level {
    
    private _id: number;
    private _name: string;
    private _description: string;
    private _scene: Scene;
    private _state: LevelState = LevelState.UNINITIALIZED;
    private _globalId: number = -1;

    public constructor(id: number, name: string, description: string) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._scene = new Scene();
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public initialize(levelData: any): void {
        if (levelData.objects === undefined) {
            throw new Error(`Level initialisation error: Objects not present.`);
        }

        for (const key in levelData.objects) {
            const object = levelData.objects[key];
            this.loadGameObject(object, this._scene.root);
        }
    }

    public load(): void {
        this._state = LevelState.LOADING;

        this._scene.load();
        // this._scene.root.transform.rotation = new Vector3(-Math.PI / 2, Math.PI / 4, 0)
        this._scene.root.updateReady();

        this._state = LevelState.UPDATING;
    }

    public unload(): void {

    }

    public update(time: number): void {
        if (this._state = LevelState.UPDATING) {
            this._scene.update(time);
        }
    }

    public render(shader: Shader): void {
        if (this._state = LevelState.UPDATING) {
            this._scene.render(shader);
        }
    }

    public onActivated(): void {
        
    }

    public onDeactivated(): void {

    }

    private loadGameObject(dataSection: any, parent: GameObject): void {
        let name: string;
        if (dataSection.name !== undefined) {
            name = String(dataSection.name);
        }
        
        const gameObject = new GameObject(++this._globalId, name, this._scene);

        if (dataSection.transform !== undefined) {
            gameObject.transform.setFromJSON(dataSection.transform);
        }
        
        if (dataSection.components !== undefined) {
            for (const c in dataSection.components) {
                const data = dataSection.components[c];
                const component = ComponentManager.extractComponent(data);
                gameObject.addComponent(component);
            }
        }

        if (dataSection.behaviors !== undefined) {
            for (const b in dataSection.behaviors) {
                const data = dataSection.behaviors[b];
                const behavior = BehaviorManager.extractBehavior(data);
                gameObject.addBehavior(behavior);
            }
        }

        if (dataSection.children !== undefined) {
            for (const key in dataSection.children) {
                const object = dataSection.children[key];
                this.loadGameObject(object, gameObject);
            }
        }

        if (parent !== undefined) {
            parent.addChild(gameObject)
        }

    }

}