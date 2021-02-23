import { AttributeInfo, GLBuffer } from "../gl/GLBuffer";
import { gl } from "../gl/GLUtilities";
import { Shader } from "../gl/Shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Vector3 } from "../math/Vector3";
import { Material } from "./Material";
import { MaterialManager } from "./MaterialManager";

export class Sprite {

    private _name: string;
    private _width: number;
    private _height: number;

    private _buffer: GLBuffer;
    private _materialName: string;
    private _material: Material;

    public constructor(name: string, materialName: string, width: number = 100, height: number = 100) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._materialName = materialName;

        this._material = MaterialManager.getMaterial(this._materialName);
    }

    public get name(): string {
        return this._name;
    }

    public destroy(): void {
        this._buffer.destroy();
        MaterialManager.releaseMaterial(this._materialName);
        this._material = undefined;
        this._materialName = undefined;
    }

    public load(): void {
        this._buffer = new GLBuffer(5);

        const positionAttributeInfo = new AttributeInfo();
        positionAttributeInfo.location = 0; // not dynamic! maybe look up the position of the positionattribute
        positionAttributeInfo.offset = 0;
        positionAttributeInfo.size = 3;
        this._buffer.addAttributeLocation(positionAttributeInfo);

        const texCoordAttributeInfo = new AttributeInfo();
        texCoordAttributeInfo.location = 1; // not dynamic! maybe look up the position of the positionattribute
        texCoordAttributeInfo.offset = 3;
        texCoordAttributeInfo.size = 2;
        this._buffer.addAttributeLocation(texCoordAttributeInfo);

        const vertices = [
            0,   0,   0, 0, 0,
            0,   this._height, 0, 0, 1.0,
            this._width, this._height, 0, 1.0, 1.0,

            this._width, this._height, 0, 1.0, 1.0,
            this._width, 0,   0, 1.0, 0,
            0,   0,   0, 0, 0
        ];

        this._buffer.pushBackData(vertices);
        this._buffer.upload();
        this._buffer.unbind();
    }

    public update(time: number): void {

    }

    public draw(shader: Shader, model: Matrix4x4): void {

        const modelLocation = shader.getUniformLocation('u_model');
        gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());

        const colorLocation = shader.getUniformLocation('u_tint');
        gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array()); // uniform 4 float (v vector)

        if (this._material.diffuseTexture !== undefined) {
            this._material.diffuseTexture.activateAndBind(0);
        }
        const diffuseLocation = shader.getUniformLocation('u_diffuse');
        gl.uniform1i(diffuseLocation, 0);
        
        this._buffer.bind();
        this._buffer.draw();
    }

}