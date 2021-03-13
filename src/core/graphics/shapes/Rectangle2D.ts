import { Vector3 } from "../../math/Vector3";
import { Circle2D } from "./Circle2D";
import { IShape } from "./IShape";

export class Rectangle2D implements IShape {

    public position: Vector3 = Vector3.zero;

    public origin: Vector3 = Vector3.zero;

    public width: number;
    public height: number;

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
            throw new Error('Rectangle2D requires width to be defined.')
        }
        this.width = Number(json.width);
        
        if (json.height === undefined) {
            throw new Error('Rectangle2D requires height to be defined.')
        }
        this.height = Number(json.height);
    }

    public intersects(other: IShape): boolean {
        if (other instanceof Rectangle2D) {
            return (this.pointInShape(other.position) || 
                this.pointInShape(new Vector3(other.position.x + other.width, other.position.y)) ||
                this.pointInShape(new Vector3(other.position.x + other.width, other.position.y + other.height)) ||
                this.pointInShape(new Vector3(other.position.x, other.position.y + other.height)) );
        }

        if (other instanceof Circle2D) {
            const deltaX = other.position.x - Math.max(this.position.x, Math.min(other.position.x, this.position.x + this.width));
            const deltaY = other.position.y - Math.max(this.position.y, Math.min(other.position.y, this.position.y + this.height));
            if ((deltaX * deltaX + deltaY * deltaY) < (other.radius * other.radius)) {
                return true;
            }
        }

        return false;
    }

    public pointInShape(point: Vector3): boolean {
        
        const x = this.width < 0 ? this.position.x - this.width : this.position.x;
        const y = this.height < 0 ? this.position.y - this.height : this.position.y;
        const extentX = this.width < 0 ? this.position.x : this.position.x + this.width;
        const extentY = this.height < 0 ? this.position.y : this.position.y + this.height;

        if (point.x >= x && point.x <= extentX && point.y >= y && point.y <= extentY) {
            return true;
        }

        return false;
    };

}