import { Vector2 } from "../../math/Vector2";
import { IShape2D } from "./IShape2d";
import { Rectangle2D } from "./Rectangle2d";

export class Circle2D implements IShape2D {

    public position: Vector2 = Vector2.zero;

    public offset: Vector2 = Vector2.zero;

    public radius: number;

    public setFromJson(json: any): void {
        if (json.position !== undefined) {
            this.position.setFromJSON(json.position);
        }

        if (json.offset !== undefined) {
            this.offset.setFromJSON(json.offset);
        }

        if (json.radius === undefined) {
            throw new Error('Circle2D requires radius to be defined.')
        }
        this.radius = Number(json.radius);
    }

    public intersects(other: IShape2D): boolean {

        if (other instanceof Circle2D) {
            const distance = Math.abs(Vector2.distance(other.position, this.position));
            const radiusLengths = this.radius + other.radius;
            if (distance <= radiusLengths) {
                return true;
            }
        }

        return false;
    }

    public pointInShape(point: Vector2): boolean {

        const absDistance = Math.abs(Vector2.distance(this.position, point));
        if (absDistance <= this.radius) {
            return true
        }

        return false;
    };

}