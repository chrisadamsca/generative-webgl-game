import { Vector3 } from "../math/Vector3";
import {Noise} from "noisejs";

export class LevelMap {

    private _difficulty: number;
    private _width: number;
    private _depth: number;

    private _tiles: MapTile[] = [];

    public constructor(difficulty: number = 1, width: number = 15, depth: number = 10) {
        this._difficulty = difficulty;
        this._width = width;
        this._depth = depth;
        this.generateMap();
    }


    public get width(): number {
        return this._width;
    }

    public get depth(): number {
        return this._depth;
    }

    public get tiles(): MapTile[] {
        return this._tiles;
    }

    private generateMap(): void {
        const seed = Math.random();
        console.warn('[SEED] ', seed)
        const noise = new Noise(seed);
        // const noise = new Noise('ALENAHEITZ');
        for (let x = -(this._width / 2); x < (this._width / 2); x++) {
            for (let z = -(this._depth / 2); z < (this._depth / 2); z++) {
                const value = noise.simplex2(x, z);
                let type = value > -0.3 ? MapTileType.DEFAULT : MapTileType.HOLE;
                if (type === MapTileType.DEFAULT) {
                    type = (Math.random() > 0.8) ? MapTileType.POINT : MapTileType.DEFAULT;  
                }
                const tile = new MapTile(new Vector3(x + x/5, 2, z + z/5), type, new Vector3(1, 0.2 + Math.abs(value * 8), 1), Math.abs(value / 1.5));
                this._tiles.push(tile);
            }
        }
    }

}

export enum MapTileType {
    DEFAULT,
    HOLE,
    START,
    END,
    DOOR,
    POINT,
    KEY
}

export class MapTile {

    public type: number;
    public position: Vector3;
    public scale: Vector3;
    public lighten: number;

    public constructor(position: Vector3, type: MapTileType = MapTileType.DEFAULT, scale: Vector3, lighten: number) {
        this.position = position;
        this.scale = scale;
        this.type = type;
        this.lighten = lighten;
    }

}