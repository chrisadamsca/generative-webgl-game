import { Vector3 } from "../../math/Vector3";
import { IShape } from "./IShape";
import { Rectangle2D } from "./Rectangle2d";

export class Circle2D implements IShape {

    public position: Vector3 = Vector3.zero;

    public origin: Vector3 = Vector3.zero;

    public radius: number;

    public get offset(): Vector3 {
        return new Vector3(this.radius + (this.radius * this.origin.x), this.radius + (this.radius * this.origin.y));
    }

    public setFromJson(json: any): void {
        if (json.position !== undefined) {
            this.position.setFromJSON(json.position);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJSON(json.origin);
        }

        if (json.radius === undefined) {
            throw new Error('Circle2D requires radius to be defined.')
        }
        this.radius = Number(json.radius);
    }

    public intersects(other: IShape): boolean {

        if (other instanceof Circle2D) {
            const distance = Math.abs(Vector3.distance(other.position, this.position));
            const radiusLengths = this.radius + other.radius;
            if (distance <= radiusLengths) {
                return true;
            }
        }

        if (other instanceof Rectangle2D) {
            const deltaX = this.position.x - Math.max(other.position.x, Math.min(this.position.x, other.position.x + other.width));
            const deltaY = this.position.y - Math.max(other.position.y, Math.min(this.position.y, other.position.y + other.height));
            if ((deltaX * deltaX + deltaY * deltaY) < (this.radius * this.radius)) {
                return true;
            }
        }

        return false;
    }

    public pointInShape(point: Vector3): boolean {

        const absDistance = Math.abs(Vector3.distance(this.position, point));
        if (absDistance <= this.radius) {
            return true
        }

        return false;
    };

}