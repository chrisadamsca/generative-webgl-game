import { mat4, vec3 } from "gl-matrix";
import { gl } from "../gl/GLUtilities";
import { Shader } from "../gl/Shader";
import { IMessageHandler } from "../message/IMessageHandler";
import { DIFFICULTY_UPDATED, Message } from "../message/Message";
import { ILevelDifficulty } from "../world/ILevelDifficulty";

export class Camera implements IMessageHandler {

    private _shader: Shader;
    private _cameraPosition: vec3 = vec3.create();
    private _up: vec3 = [0, 1, 0];
    private _target: vec3 = [0, 0, 0];
    private _projectionMatrix: mat4 = mat4.create();
    private _viewProjectionMatrix: mat4 = mat4.create();
    private _cameraHeight: number;
    private _fovy: number;

    public constructor(shader: Shader, startHeight: number = 15, fovy: number = 45) {
        this._shader = shader;
        this._fovy = fovy;
        this._cameraHeight = startHeight;

        Message.subscribe(DIFFICULTY_UPDATED, this);
    }

    public onMessage(message: Message): void {
        if (message.code = DIFFICULTY_UPDATED) {
            const difficulty = message.context as ILevelDifficulty;
            this._cameraHeight = 15 + (difficulty.mapX / 3);
            this.resize();
        }
    }

    public initialize(): void {
        mat4.perspective(this._projectionMatrix, this._fovy, gl.canvas.width / gl.canvas.height, 0.1, 10000);

        vec3.set(this._cameraPosition, 0, this._cameraHeight, 0.00001);
        vec3.rotateX(this._cameraPosition, this._cameraPosition, vec3.create(), (Math.PI / 5) );

        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this._cameraPosition, this._target, this._up);

        mat4.multiply(this._viewProjectionMatrix, this._projectionMatrix, viewMatrix);
    }

    public resize(): void {
        this.initialize();
    }

    public update() {

    }

    public render(): void {
        const projectionLocation = this._shader.getUniformLocation('uProjectionMatrix');
        gl.uniformMatrix4fv(projectionLocation, false, this._viewProjectionMatrix);
    }

}