import { Vector3 } from "../../math/Vector3";

export class EntityConfigs {

    private constructor() {}

    public static getGroundEntityConfig(name: string, partOfMainland: boolean, initialPosition: Vector3, initialScale: Vector3, colorAlpha: number) {
        return {
            name: name,
            transform: {
                position: {
                    x: initialPosition.x,
                    y: initialPosition.y - (initialScale.y / 2) + 0.5,
                    z: initialPosition.z
                },
                scale: {
                    x: 0.8,
                    y: initialScale.y,
                    z: 0.8
                }
            },
            components: [
                {
                    name: `${name}_cube`,
                    type: 'cube',
                    materialName: 'ground',
                    // materialName: partOfMainland ? 'ground' : 'player',
                    alpha: colorAlpha
                    // alpha: partOfMainland ? colorAlpha : 1
                },
                {
                    name: 'groundCollision',
                    type: 'collision',
                    shape: {
                        type: 'aabb',
                        width: 0.8,
                        height: initialScale.y + 0.2,
                        depth: 0.8
                    }
                }
            ]
        };
    }

    public static getPlayerEntityConfig(initialPosition: Vector3, speed: number) {
        return {
            name: 'player',
            transform: {
                position: {
                    x: initialPosition.x,
                    y: initialPosition.y + 1.1,
                    z: initialPosition.z
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
                    materialName: 'player'
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
                    speed: speed,
                    resetPosition: {
                        x: initialPosition.x,
                        y: initialPosition.y + 1.1,
                        z: initialPosition.z
                    }
                }
            ]
        }
    }

    public static getPointEntityConfig(name: string, initialPosition: Vector3) {
        return {
            name: name,
            transform: {
                position: {
                    x: initialPosition.x,
                    y: initialPosition.y + 1,
                    z: initialPosition.z
                },
                scale: {
                    x: 0.25,
                    y: 0.25,
                    z: 0.25
                },
                rotation: {
                    y: -Math.PI / 4
                }
            },
            components: [
                {
                    name: `${name}_cube`,
                    type: 'cube',
                    materialName: 'point'
                },
                {
                    name: `${name}_collision`,
                    type: 'collision',
                    shape: {
                        type: 'aabb',
                        width: 0.5,
                        height: 1,
                        depth: 0.5
                    }
                },
                {
                    name: `${name}_point`,
                    type: 'point',
                    collisionName: `${name}_collision`
                }
            ]
        }
    }

}

