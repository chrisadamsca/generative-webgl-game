import { Vector3 } from "../../math/Vector3";


export class Box {

    public position: Vector3 = Vector3.zero;

    public origin: Vector3 = Vector3.zero;

    public width: number;
    public height: number;
    public depth: number;

    public get offset(): Vector3 {
        return new Vector3((this.width * this.origin.x), (this.height * this.origin.y));
    }

    public setFromJson(json: any): void {
        if (json.position !== undefined) {
            this.position.setFromJSON(json.position);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJSON(json.origin);
        }

        if (json.width === undefined) {
            throw new Error('Box requires width to be defined.')
        }
        this.width = Number(json.width);
        
        if (json.height === undefined) {
            throw new Error('Box requires height to be defined.')
        }
        this.height = Number(json.height);

        if (json.depth === undefined) {
            throw new Error('Box requires depth to be defined.')
        }
        this.depth = Number(json.depth);
    }

    public intersects(other: Box): boolean {
        if (other instanceof Box) {
            return (this.pointInShape(other.position) || 
                this.pointInShape(new Vector3(other.position.x + other.width, other.position.y)) ||
                this.pointInShape(new Vector3(other.position.x + other.width, other.position.y + other.height)) ||
                this.pointInShape(new Vector3(other.position.x, other.position.y + other.height)) );
        }

        return false;
    }

    public pointInShape(point: Vector3): boolean {
        
        const x = this.width < 0 ? this.position.x - this.width : this.position.x;
        const y = this.height < 0 ? this.position.y - this.height : this.position.y;
        const z = this.depth < 0 ? this.position.z - this.depth : this.position.z;
        const extentX = this.width < 0 ? this.position.x : this.position.x + this.width;
        const extentY = this.height < 0 ? this.position.y : this.position.y + this.height;
        const extentZ = this.depth < 0 ? this.position.z : this.position.z + this.depth;

        if (point.x >= x && point.x <= extentX && point.y >= y && point.y <= extentY) {
            return true;
        }

        return false;
    };

}