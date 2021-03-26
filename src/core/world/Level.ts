import { vec3 } from "gl-matrix";
import { BehaviorManager } from "../behaviors/BehaviorManager";
import { ComponentManager } from "../components/ComponentManager";
import { Shader } from "../gl/Shader";
import { Vector3 } from "../math/Vector3";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message, PLAYER_DIED, POINT } from "../message/Message";
import { GameObject, GameObjectManager } from "./GameObject";
import { EntityConfigs } from "./helpers/EntityConfigs";
import { ILevelDifficulty } from "./ILevelDifficulty";
import { LevelManager } from "./LevelManager";
import { LevelMap, MapTileType } from "./Map";
import { Scene } from "./Scene";

export enum LevelState {
    UNINITIALIZED,
    LOADING,
    UPDATING
}

export class Level implements IMessageHandler {
    
    private _id: number;
    private _scene: Scene;
    private _state: LevelState = LevelState.UNINITIALIZED;
    private _globalId: number = -1;
    private _difficulty: ILevelDifficulty;

    private _collectedPoints: number = 0;
    private _playerLifes: number = 3;
    private _map: LevelMap;

    public constructor(id: number, difficulty: ILevelDifficulty) {
        this._id = id;
        this._difficulty = difficulty;
        this._scene = new Scene();
    }

    public get id(): number {
        return this._id;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public onMessage(message: Message): void {
        if (message.code === POINT + this._id) {
            this._collectedPoints++;
            console.warn(`[POINT] ${this._collectedPoints} / ${this._difficulty.pointsToCollect}`)
            if (this._collectedPoints === this._difficulty.pointsToCollect) {
                Message.send('LEVEL_WON::' + this._id, this);
                LevelManager.changeLevel();
            }
        } else if (message.code === PLAYER_DIED) {
            this._playerLifes--;
            if (this._playerLifes > 0) {
                console.warn(`[PLAYER] Lost life. Lifes left: ${this._playerLifes} / 3`)
            } else {
                console.warn(`[PLAYER] Lost LEVEL!!`)
                Message.send('LEVEL_LOST::' + this._id, this);
                LevelManager.reset();
            }
        }
    }

    public initialize(): void {
        Message.subscribe(PLAYER_DIED, this);
        Message.subscribe(POINT + this._id, this);

        this._map = new LevelMap(this._difficulty);

        this._map.tiles.forEach((tile, index) => {
            if (tile.type !== MapTileType.HOLE) {
                // Load ground
                this.loadGameObject(EntityConfigs.getGroundEntityConfig(`ground_${index}`, tile.partOfMainland, tile.position, tile.scale, tile.alpha), this._scene.root);

                if (tile.type === MapTileType.START) {
                    // Load player
                    this.loadGameObject(EntityConfigs.getPlayerEntityConfig(tile.position, this._difficulty.speed), this._scene.root);
                } else if (tile.type === MapTileType.POINT) {
                    // Load points
                    this.loadGameObject(EntityConfigs.getPointEntityConfig(`point_${index}`, tile.position), this._scene.root);
                }
            }
        });
        // setTimeout(() => {
        //     LevelManager.changeLevel();
        // }, 500);
    }

    public load(): void {
        this._state = LevelState.LOADING;

        this._scene.load();

        this._scene.root.updateReady();

        this._state = LevelState.UPDATING;
    }

    public unload(): void {
        Message.unsubscribe('PLAYER_DIED', this);
        Message.unsubscribe('POINT::' + this._id, this);
        this._scene.root.unload();
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
        if (parent === undefined) parent = this._scene.root;
        
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