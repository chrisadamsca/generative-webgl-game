import { Vector3 } from "../../math/Vector3";
import { IShape } from "./IShape";


export class AABB implements IShape {

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
            throw new Error('AABB requires width to be defined.')
        }
        this.width = Number(json.width);
        
        if (json.height === undefined) {
            throw new Error('AABB requires height to be defined.')
        }
        this.height = Number(json.height);

        if (json.depth === undefined) {
            throw new Error('AABB requires depth to be defined.')
        }
        this.depth = Number(json.depth);
    }

    public intersects(other: AABB): boolean {
        if (other instanceof AABB) {
            const thisMinX = this.position.x - (this.width / 2);
            const thisMaxX = this.position.x + (this.width / 2);
            const thisMinY = this.position.y - (this.height / 2);
            const thisMaxY = this.position.y + (this.height / 2);
            const thisMinZ = this.position.z - (this.depth / 2);
            const thisMaxZ = this.position.z + (this.depth / 2);

            const otherMinX = other.position.x - (this.width / 2);
            const otherMaxX = other.position.x + (this.width / 2);
            const otherMinY = other.position.y - (this.height / 2);
            const otherMaxY = other.position.y + (this.height / 2);
            const otherMinZ = other.position.z - (this.depth / 2);
            const otherMaxZ = other.position.z + (this.depth / 2);

            return (thisMinX <= otherMaxX && thisMaxX >= otherMinX) &&
                    (thisMinY <= otherMaxY && thisMaxY >= otherMinY) &&
                    (thisMinZ <= otherMaxZ && thisMaxZ >= otherMinZ);

        }

        return false;
    }

    pointInShape(point: Vector3): boolean {
        return false;
    };

}