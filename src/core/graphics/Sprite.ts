import { AttributeInfo, GLBuffer } from "../gl/GLBuffer";
import { gl } from "../gl/GLUtilities";
import { Shader } from "../gl/Shader";
import { Vector3 } from "../math/Vector3";
import { Texture } from "./Texture";
import { TextureManager } from "./TextureManager";

export class Sprite {

    public position: Vector3 = new Vector3();

    private _name: string;
    private _width: number;
    private _height: number;

    private _buffer: GLBuffer;
    private _texture: Texture;

    public constructor(name: string, textureName: string, width: number = 100, height: number = 100) {
        this._name = name;
        this._width = width;
        this._height = height;

        this._texture = TextureManager.getTexture(textureName);
    }

    public get name(): string {
        return this._name;
    }

    public destroy(): void {
        this._buffer.destroy();
        TextureManager.releaseTexture(this._texture.name);
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

    public draw(shader: Shader): void {
        this._texture.activateAndBind(0);
        const diffuseLocation = shader.getUniformLocation('u_diffuse');
        gl.uniform1i(diffuseLocation, 0);
        
        this._buffer.bind();
        this._buffer.draw();
    }

}