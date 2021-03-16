import { vec3 } from "gl-matrix";
import { BehaviorManager } from "../behaviors/BehaviorManager";
import { ComponentManager } from "../components/ComponentManager";
import { Shader } from "../gl/Shader";
import { Vector3 } from "../math/Vector3";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/Message";
import { GameObject, GameObjectManager } from "./GameObject";
import { LevelMap, MapTileType } from "./Map";
import { Scene } from "./Scene";

export enum LevelState {
    UNINITIALIZED,
    LOADING,
    UPDATING
}

export class Level implements IMessageHandler {
    
    private _id: number;
    private _name: string;
    private _description: string;
    private _scene: Scene;
    private _state: LevelState = LevelState.UNINITIALIZED;
    private _globalId: number = -1;

    private _collectedPoints: number = 0;
    private _map: LevelMap;

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

    public onMessage(message: Message): void {
        if (message.code === 'POINT::' + this._id) {
            this._collectedPoints++;
            console.warn(`[POINT COLLECTED] ${this._collectedPoints} / ${this._map.pointsTotal}`)
            if (this._collectedPoints === this._map.pointsTotal) {
                Message.send('LEVEL_WON::' + this._id, this);
                alert('You WON!');
            }
        }
    }

    public initialize(levelData: any): void {
        Message.subscribe('POINT::' + this._id, this);

        if (levelData.objects === undefined) {
            throw new Error(`Level initialisation error: Objects not present.`);
        }
        // for (const key in levelData.objects) {
        //     const object = levelData.objects[key];
        //     this.loadGameObject(object, this._scene.root);
        // }

        this._map = new LevelMap();
        this._map.tiles.forEach((tile, index) => {
            if (tile.type !== MapTileType.HOLE) {
                    this.loadGameObject({
                        name: `ground_${index}` ,
                        transform: {
                            position: {
                                x: tile.position.x,
                                // y: tile.position.y,
                                y: tile.position.y - (tile.scale.y / 2) + 0.5,
                                z: tile.position.z
                            },
                            scale: {
                                x: 0.8,
                                y: tile.scale.y,
                                z: 0.8
                            }
                        },
                        components: [
                            {
                                name: `groundCube_${index}`,
                                type: 'cube',
                                materialName: tile.partOfMain ? 'red' : 'green',
                                alpha: tile.partOfMain ? 1 : (1 - tile.lighten)
                            },
                            {
                                name: 'groundCollision',
                                type: 'collision',
                                shape: {
                                    type: 'aabb',
                                    width: 0.8,
                                    height: tile.scale.y + 0.2,
                                    depth: 0.8
                                }
                            }
                        ]
                    }, this._scene.root);
                if (tile.type === MapTileType.START) {
                    this.loadGameObject({
                        name: 'player',
                        transform: {
                            position: {
                                x: tile.position.x,
                                y: tile.position.y + 1.1,
                                z: tile.position.z
                            },
                            scale: {
                                x: 0.5,
                                y: 1,
                                z: 0.5
                            }
                        },
                        components: [
                            {
                                name: 'playerBody',
                                type: 'cube',
                                materialName: 'white'
                            },
                            {
                                name: 'playerCollision',
                                type: 'collision',
                                static: false,
                                shape: {
                                    type: 'aabb',
                                    width: 0.5,
                                    height: 1,
                                    depth: 0.5
                                }
                            }
                        ],
                        behaviors: [
                            {
                                name: 'PlayerBehavior',
                                type: 'player',
                                playerCollisionComponent: 'playerCollision',
                                groundCollisionComponent: 'groundCollision',
                                speed: 0.075,
                                resetPosition: {
                                    x: tile.position.x,
                                    y: tile.position.y + 1.1,
                                    z: tile.position.z
                                }
                            }
                        ]
                    }, this._scene.root);
                }
                if (tile.type === MapTileType.POINT) {
                    this.loadGameObject({
                        name: `key`,
                        transform: {
                            position: {
                                x: tile.position.x,
                                y: tile.position.y + 1,
                                z: tile.position.z
                            },
                            scale: {
                                x: 0.25,
                                y: 0.25,
                                z: 0.25
                            },
                            rotation: {
                                // x: Math.PI / 4,
                                y: -Math.PI / 4
                            }
                        },
                        components: [
                            {
                                name: `cubeComponent_${index}`,
                                type: 'cube',
                                materialName: 'green'
                            },
                            {
                                name: `key_${index}_Collision`,
                                type: 'collision',
                                shape: {
                                    type: 'aabb',
                                    width: 0.5,
                                    height: 1,
                                    depth: 0.5
                                }
                            },
                            {
                                name: `keyItem_${index}`,
                                type: 'item',
                                collisionName: `key_${index}_Collision`
                            }
                        ]
                    }, this._scene.root);
                }
            }
        });
    }

    public load(): void {
        this._state = LevelState.LOADING;

        this._scene.load();

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