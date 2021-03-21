import { mat4, vec3 } from "gl-matrix";
import { gl } from "../gl/GLUtilities";
import { Shader } from "../gl/Shader";
import { Vector3 } from "../math/Vector3";

export class Camera {

    private _shader: Shader;
    private _cameraPosition: vec3 = vec3.create();
    private _up: vec3 = [0, 1, 0];
    private _target: vec3 = [0, 1, 0];
    private _projectionMatrix: mat4 = mat4.create();
    private _viewProjectionMatrix: mat4 = mat4.create();

    public constructor(shader: Shader) {
        this._shader = shader;
    }

    public initialize(): void {
        mat4.perspective(this._projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 10000);

        vec3.set(this._cameraPosition, 0, 20, 0.00001);
        vec3.rotateX(this._cameraPosition, this._cameraPosition, vec3.create(), (Math.PI / 5) );

        const up = [0, 1, 0];
        const target = [0, 0, 0];
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, (this._cameraPosition as any), (target as any), (up as any));

        mat4.multiply(this._viewProjectionMatrix, this._projectionMatrix, viewMatrix);
    }

    public resize(): void {
        this.initialize();
    }

    public render(): void {
        const projectionLocation = this._shader.getUniformLocation('uProjectionMatrix');
        gl.uniformMatrix4fv(projectionLocation, false, this._viewProjectionMatrix);
    }

}