import { Vector3 } from "../../math/Vector3";

export interface IShape {

    position: Vector3;

    origin: Vector3;

    readonly offset: Vector3;

    setFromJson(json: any): void;

    intersects(shape: IShape): boolean;

    pointInShape(point: Vector3): boolean;

}