import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

export class Vertex {

    public position: Vector3 = Vector3.zero;
    public texCoords: Vector2 = Vector2.zero;
    public normalVector: Vector3;

    public constructor(x: number = 0, y: number = 0, z: number = 0, nX?: number, nY?: number, nZ?: number) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        // this.texCoords.x = tu;
        // this.texCoords.y = tv;

        this.normalVector = new Vector3(nX, nY, nZ);
    }

    public toArray(): number[] {
        let array: number[] = [];

        array = array.concat(this.position.toArray());
        array = array.concat(this.normalVector.toArray());

        return array;
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }

}