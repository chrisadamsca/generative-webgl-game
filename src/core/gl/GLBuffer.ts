import { gl } from "./GLUtilities";

export class AttributeInfo {
    public location: number;
    public size: number;
    public offset: number = 0;
}

export class GLBuffer {

    private _hasAttributeLocation: boolean = false;
    private _elementSize: number;
    private _stride: number;
    private _buffer: WebGLBuffer;

    private _targetBufferType: number;
    private _dataType: number;
    private _mode: number; 
    private _typeSize: number;

    private _data: number[] = [];
    private _attributes: AttributeInfo[] = [];

    public constructor(dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, mode: number = gl.TRIANGLES) {
        this._elementSize = 0;
        this._dataType = dataType;
        this._targetBufferType = targetBufferType;
        this._mode = mode;

        switch (this._dataType) {
            case gl.FLOAT:
            case gl.INT:
            case gl.UNSIGNED_INT:
                this._typeSize = 4;
                break;
            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                this._typeSize = 2;
                break;
            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                this._typeSize = 1;
                break;
            default:
                throw new Error('Unrecognized data type: ' + dataType.toString());
                break;
        }
        this._buffer = gl.createBuffer();
    }

    public destroy(): void {
        gl.deleteBuffer(this._buffer);
    }

    public get data(): any {
        return this._data;
    }

    public bind(normalized: boolean = false): void {
        gl.bindBuffer(this._targetBufferType, this._buffer);
        
        if (this._hasAttributeLocation) {
            for (const attribute of this._attributes) {
                gl.enableVertexAttribArray(attribute.location);
                gl.vertexAttribPointer(attribute.location, attribute.size, this._dataType, normalized, this._stride, attribute.offset * this._typeSize);
            }
        }
    }

    public unbind(): void {
        for (const attribute of this._attributes) {
            gl.disableVertexAttribArray(attribute.location);
        }
        gl.bindBuffer(this._targetBufferType, undefined);
    }

    public addAttributeLocation(info: AttributeInfo): void {
        this._hasAttributeLocation = true;
        info.offset = this._elementSize;
        this._attributes.push(info);
        this._elementSize += info.size;
        this._stride = this._elementSize * this._typeSize;
    }

    public setData(data: number[]): void {
        this.clearData();
        this.pushBackData(data);
    }

    public pushBackData(data: number[]): void {
        this._data = [...this._data, ...data];
    }

    public clearData(): void {
        this._data.length = 0;
    }

    public upload(): void {
        gl.bindBuffer(this._targetBufferType, this._buffer);

        let bufferData: ArrayBuffer;
        switch (this._dataType) {
            case gl.FLOAT:
                bufferData = new Float32Array(this._data);
                break;
            case gl.INT:
                bufferData = new Int32Array(this._data);
                break;
            case gl.UNSIGNED_INT:
                bufferData = new Uint32Array(this._data);
                break;
            case gl.SHORT:
                bufferData = new Int16Array(this._data);
                break;
            case gl.UNSIGNED_SHORT:
                bufferData = new Uint16Array(this._data);
                break;
            case gl.BYTE:
                bufferData = new Int8Array(this._data);
                break;
            case gl.UNSIGNED_BYTE:
                bufferData = new Uint8Array(this._data);
                break;
        }
        gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
    }

    public draw(): void {
        if (this._targetBufferType === gl.ARRAY_BUFFER) {
            gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
        } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
            gl.drawElements(this._mode, this._data.length, this._dataType, 0);
        }
    }

}