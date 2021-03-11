import { mat4 } from "gl-matrix";
import { Vector3 } from "./Vector3";

export class Matrix4x4 {

    private _data: number[] = [];

    private constructor() {
        this._data = [
            1.0, 0, 0, 0,
            0, 1.0, 0, 0,
            0, 0, 1.0, 0,
            0, 0, 0, 1.0
        ];
    }

    public get data(): number[] {
        return this._data;
    }

    public static identity(): Matrix4x4 {
        return new Matrix4x4();
    }

    public static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number): Matrix4x4 {
        const matrix = new Matrix4x4();
        const lr = 1.0 / (left - right);
        const bt = 1.0 / (bottom - top);
        const nf = 1.0 / (nearClip - farClip);

        matrix._data[0] = -2.0 * lr;
        matrix._data[5] = -2.0 * bt;
        matrix._data[10] = 2.0 * nf;
        matrix._data[12] = (left + right) * lr;
        matrix._data[13] = (top + bottom) * bt;
        matrix._data[14] = (farClip + nearClip) * nf;

        return matrix;
    }

    public static translation(position: Vector3): Matrix4x4 {
        const matrix = new Matrix4x4();

        matrix._data[12] = position.x;
        matrix._data[13] = position.y;
        matrix._data[14] = position.z;

        return matrix;
    }

    public static rotationX(angleInRadians: number): Matrix4x4 {
        const matrix = new Matrix4x4();

        const cos = Math.cos( angleInRadians );
        const sin = Math.sin( angleInRadians );

        matrix._data[5] = cos;
        matrix._data[6] = sin;
        matrix._data[9] = -sin;
        matrix._data[10] = cos;

        return matrix;
    }

    public static rotationY(angleInRadians: number): Matrix4x4 {
        const matrix = new Matrix4x4();

        const cos = Math.cos( angleInRadians );
        const sin = Math.sin( angleInRadians );

        matrix._data[0] = cos;
        matrix._data[2] = -sin;
        matrix._data[8] = sin;
        matrix._data[10] = cos;

        return matrix;
    }

    public static rotationZ(angleInRadians: number): Matrix4x4 {
        const matrix = new Matrix4x4();

        const cos = Math.cos(angleInRadians);
        const sin = Math.sin(angleInRadians);

        matrix._data[0] = cos;
        matrix._data[1] = sin;
        matrix._data[4] = -sin;
        matrix._data[5] = cos;

        return matrix;
    }

    public static rotationXYZ(xRadians: number, yRadians: number, zRadians: number): Matrix4x4 {
        const rx = Matrix4x4.rotationX( xRadians );
        const ry = Matrix4x4.rotationY( yRadians );
        const rz = Matrix4x4.rotationZ( zRadians );
        
        // return Matrix4x4.identity();
        return Matrix4x4.multiply( Matrix4x4.multiply( rz, ry ), rx );
    }

    public static scale(scale: Vector3): Matrix4x4 {
        const matrix = new Matrix4x4();

        matrix._data[0] = scale.x;
        matrix._data[5] = scale.y;
        matrix._data[10] = scale.z;

        return matrix;
    }

    public static multiply( a: Matrix4x4, b: Matrix4x4 ): Matrix4x4 {
        let m = new Matrix4x4();

        let b00 = b._data[0 * 4 + 0];
        let b01 = b._data[0 * 4 + 1];
        let b02 = b._data[0 * 4 + 2];
        let b03 = b._data[0 * 4 + 3];
        let b10 = b._data[1 * 4 + 0];
        let b11 = b._data[1 * 4 + 1];
        let b12 = b._data[1 * 4 + 2];
        let b13 = b._data[1 * 4 + 3];
        let b20 = b._data[2 * 4 + 0];
        let b21 = b._data[2 * 4 + 1];
        let b22 = b._data[2 * 4 + 2];
        let b23 = b._data[2 * 4 + 3];
        let b30 = b._data[3 * 4 + 0];
        let b31 = b._data[3 * 4 + 1];
        let b32 = b._data[3 * 4 + 2];
        let b33 = b._data[3 * 4 + 3];
        let a00 = a._data[0 * 4 + 0];
        let a01 = a._data[0 * 4 + 1];
        let a02 = a._data[0 * 4 + 2];
        let a03 = a._data[0 * 4 + 3];
        let a10 = a._data[1 * 4 + 0];
        let a11 = a._data[1 * 4 + 1];
        let a12 = a._data[1 * 4 + 2];
        let a13 = a._data[1 * 4 + 3];
        let a20 = a._data[2 * 4 + 0];
        let a21 = a._data[2 * 4 + 1];
        let a22 = a._data[2 * 4 + 2];
        let a23 = a._data[2 * 4 + 3];
        let a30 = a._data[3 * 4 + 0];
        let a31 = a._data[3 * 4 + 1];
        let a32 = a._data[3 * 4 + 2];
        let a33 = a._data[3 * 4 + 3];

        m._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        m._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        m._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        m._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        m._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        m._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        m._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        m._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        m._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        m._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        m._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        m._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        m._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        m._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        m._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        m._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

        return m;
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array( this._data );
    }

    public toGlMatrix(): mat4 {
        return mat4.fromValues(this._data[0], this._data[1], this._data[2], this._data[3], this._data[4], this._data[5], this._data[6], this._data[7], this._data[8], this._data[9], this._data[10], this._data[11], this._data[12], this._data[13], this._data[14], this._data[15]);
    }

    public copyFrom(matrix: Matrix4x4): void {
        this._data = [...matrix._data];
    }

}