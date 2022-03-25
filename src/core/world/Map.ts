import { Vector3 } from "../math/Vector3";
import {Noise} from "noisejs";
import { ILevelDifficulty } from "./ILevelDifficulty";

export class LevelMap {

    private _difficulty: ILevelDifficulty;
    private _width: number;
    private _depth: number;

    private _tiles: MapTile[] = [];
    private _largestGroupSize: number = 0;
    private _largestGroupId: number = 1;
    private _currentGroupId: number = 1;
    private _currentGroupSize: number = 0;

    public constructor(difficulty: ILevelDifficulty) {
        this._difficulty = difficulty;
        this._width = difficulty.mapX;
        this._depth = difficulty.mapZ;
        this.generateMap();
        this.distributePoints();
        this.setStartTile();
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
        const noise = new Noise(seed);

        for (let z = -(this._depth / 2); z < (this._depth / 2); z++) {
            for (let x = -(this._width / 2); x < (this._width / 2); x++) {
                const value = noise.simplex2(x / 2, z / 2);
                let type = value > -0.3 ? MapTileType.DEFAULT : MapTileType.HOLE;
                const position = new Vector3(x, 2, z);
                const scale = new Vector3(1, 0.2 + Math.abs(value * 8), 1);
                const alpha = 0.6 + Math.abs(value / 1.5);

                const tile = new MapTile(position, type, scale, alpha);

                this._tiles.push(tile);
            }
        }
    

        for (let x = 0; x < this._width; x++) {
            for (let z = 0; z < this._depth; z++) {
                this._currentGroupSize = 0;
                this.breadthFirst(x, z);
                this._currentGroupId++;
                
                if (this.isPlayable()) break;
            }
            if (this.isPlayable()) break;
        }

        if (!this.isPlayable()) {
            return this.retry();
        }

        this._tiles.forEach((tile) => {
            if (tile.groupId === this._largestGroupId) {
                tile.partOfMainland = true;
            }
        });
    }

    private isPlayable(): boolean {
        return this._largestGroupSize > this._tiles.length * 0.6;
    }

    private retry(): void {
        this._tiles = [];
        this._largestGroupSize = 0;
        this._largestGroupId = 1;
        this._currentGroupId = 1;
        this._currentGroupSize = 0;
        this.generateMap();
    }

    private setStartTile(): void {
        const tile = this._tiles[Math.floor(Math.random() * this._tiles.length)];
        if (tile.partOfMainland && tile.type !== MapTileType.POINT) {
            tile.setType(MapTileType.START);
        } else {
            this.setStartTile();
        }
    }

    private breadthFirst(x: number, z: number): void {
        if ((x >= 0 && x < this._width) && (z >= 0 && z < this._depth)) {
            const pos = x + (z * this._width);
            const currentTile = this._tiles[pos];
            if (currentTile.type !== MapTileType.HOLE) {
                if (!currentTile.visited) {       
                    currentTile.setVisited();
                    this._currentGroupSize++;

                    if (this._currentGroupSize > this._largestGroupSize) {
                        this._largestGroupSize = this._currentGroupSize;
                        this._largestGroupId = this._currentGroupId;
                    }
        
                    
                    currentTile.groupId = this._currentGroupId;
                    this.breadthFirst(x + 1, z);
                    this.breadthFirst(x, z + 1);
                    this.breadthFirst(x, z - 1);
                    this.breadthFirst(x - 1, z);
                }
            }
        }
    }

    private distributePoints() {
        let pointsToDistribute = this._difficulty.pointsToCollect;
        while(pointsToDistribute > 0) {
            const tile = this._tiles[Math.floor(Math.random() * this._tiles.length)];
            if (tile.partOfMainland && tile.type !== MapTileType.POINT) {
                tile.setType(MapTileType.POINT);
                pointsToDistribute--;
            }
        }

    }

}

export enum MapTileType {
    DEFAULT,
    HOLE,
    START,
    POINT
}

export class MapTile {

    public type: number;
    public position: Vector3;
    public scale: Vector3;
    public alpha: number;

    public visited: boolean;
    public groupId: number;
    public partOfMainland: boolean;

    public constructor(position: Vector3, type: MapTileType = MapTileType.DEFAULT, scale: Vector3, alpha: number) {
        this.position = position;
        this.scale = scale;
        this.type = type;
        this.alpha = alpha < 0.2 ? 0.2 : alpha;
    }

    public setType(type: MapTileType): void {
        this.type = type;
    }

    public setVisited(value: boolean = true): void {
        this.visited = value;
    }

}
