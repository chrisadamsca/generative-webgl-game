import { AttributeInfo, GLBuffer } from "../gl/GLBuffer";
import { Vector3 } from "../math/Vector3";

export class Sprite {

    public position: Vector3 = new Vector3();

    private _name: string;
    private _width: number;
    private _height: number;

    private _buffer: GLBuffer;

    public constructor(name: string, width: number = 100, height: number = 100) {
        this._name = name;
        this._width = width;
        this._height = height;
    }

    public load(): void {
        this._buffer = new GLBuffer(3);

        const positionAttributeInfo = new AttributeInfo();
        positionAttributeInfo.location = 0; // not dynamic! maybe look up the position of the positionattribute
        positionAttributeInfo.offset = 0;
        positionAttributeInfo.size = 3;
        this._buffer.addAttributeLocation(positionAttributeInfo);

        const vertices = [
            0,   0,   0,
            0,   this._height, 0,
            this._width, this._height, 0,

            this._width, this._height, 0,
            this._width, 0,   0,
            0,   0,   0 
        ];

        this._buffer.pushBackData(vertices);
        this._buffer.upload();
        this._buffer.unbind();
    }

    public update(time: number): void {

    }

    public draw(): void {
        this._buffer.bind();
        this._buffer.draw();
    }

}