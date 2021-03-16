import { Vector3 } from "../math/Vector3";
import {Noise} from "noisejs";

export class LevelMap {

    private _difficulty: number;
    private _width: number;
    private _depth: number;

    private _tiles: MapTile[] = [];
    private _pointsTotal: number = 0;
    private _largestGroupSize: number = 0;
    private _largestGroupId: number = 1;
    private _currentGroupId: number = 1;
    private _currentGroupSize: number = 0;

    public constructor(difficulty: number = 1, width: number = 20, depth: number = 12) {
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

    public get pointsTotal(): number {
        return this._pointsTotal;
    }

    private generateMap(): void {
        const seed = Math.random();
        console.warn('[SEED] ', seed)
        const noise = new Noise(seed);
        // const noise = new Noise('ALENAHEITZ');
        for (let z = -(this._depth / 2); z < (this._depth / 2); z++) {
            for (let x = -(this._width / 2); x < (this._width / 2); x++) {
                const value = noise.simplex2(x / 2, z / 2);
                let type = value > -0.3 ? MapTileType.DEFAULT : MapTileType.HOLE;

                // const position = new Vector3(x + x/5, 2, z + z/5);
                const position = new Vector3(x, 2, z);
                const scale = new Vector3(1, 0.2 + Math.abs(value * 8), 1);
                const lighten = Math.abs(value / 1.5);

                const tile = new MapTile(position, type, scale, lighten);

                this._tiles.push(tile);
            }
        }
    

        for (let x = 0; x < this._width; x++) {
            for (let z = 0; z < this._depth; z++) {
                // if (this._largestGroupSize < (this._width * this._depth) * 0.7) {
                    this._currentGroupSize = 0;
                    this.breadthFirst(x, z);
                    this._currentGroupId++;
                // }
            }
        }

        console.warn('[BFS] Largest Size: ', this._largestGroupSize);
        console.warn('[BFS] Largest Group: ', this._largestGroupId);
        this._tiles.forEach((tile, index) => {
            console.warn(`Tile ${index}, group: ${tile.groupId}`)
            if (tile.groupId === this._largestGroupId) {
                tile.partOfMain = true;
                if ((Math.random() > 0.8)) {
                    tile.setType(MapTileType.POINT);
                    this._pointsTotal++;
                }
            }
        });
        this.setStartTile();
    }

    private setStartTile(): void {
        const tile = this._tiles[Math.floor(Math.random() * this._tiles.length)];
        if (tile.partOfMain && tile.type !== MapTileType.POINT) {
            tile.setType(MapTileType.START);
        } else {
            this.setStartTile();
        }
    }

    private breadthFirst(x: number, z: number): void {
        if ((x >= 0 && x < this._width) && (z >= 0 && z < this._depth)) {
            const pos = x + (z * this._width);
            const currentTile = this._tiles[pos];
            // if (pos === 1) {
            //     currentTile.partOfMain = true;
            // }
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

    public visited: boolean;
    public groupId: number;
    public partOfMain: boolean;

    public constructor(position: Vector3, type: MapTileType = MapTileType.DEFAULT, scale: Vector3, lighten: number) {
        this.position = position;
        this.scale = scale;
        this.type = type;
        this.lighten = lighten < 0.2 ? 0.2 : lighten;
    }

    public setType(type: MapTileType): void {
        this.type = type;
    }

    public setVisited(value: boolean = true): void {
        this.visited = value;
    }

}
