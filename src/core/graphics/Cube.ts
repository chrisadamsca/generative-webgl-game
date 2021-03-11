import { AttributeInfo, GLBuffer } from "../gl/GLBuffer";
import { gl } from "../gl/GLUtilities";
import { Shader } from "../gl/Shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Vector3 } from "../math/Vector3";
import { Material } from "./Material";
import { MaterialManager } from "./MaterialManager";
import { Vertex } from "./Vertex";
import { mat4 } from "gl-matrix";

export class Cube {

    protected _name: string;
    protected _width: number;
    protected _height: number;
    protected _depth: number;
    protected _origin: Vector3 = Vector3.zero;

    protected _buffer: GLBuffer;
    protected _materialName: string;
    protected _material: Material;
    protected _vertices: Vertex[] = [];

    protected _done: boolean = false;

    public constructor(name: string, materialName: string, width: number = 10, height: number = 10, depth: number = 10) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._depth = depth;
        this._materialName = materialName;

        this._material = MaterialManager.getMaterial(this._materialName);
    }

    public get name(): string {
        return this._name;
    }
    
    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get origin(): Vector3 {
        return this._origin;
    }

    public set origin(value: Vector3) {
        this._origin = value;
        this.recalculateVertices();
    }

    public destroy(): void {
        this._buffer.destroy();
        MaterialManager.releaseMaterial(this._materialName);
        this._material = undefined;
        this._materialName = undefined;
    }

    public load(): void {
        this._buffer = new GLBuffer();

        const positionAttributeInfo = new AttributeInfo();
        positionAttributeInfo.location = 1; // not dynamic! maybe look up the position of the positionattribute
        positionAttributeInfo.size = 3;
        this._buffer.addAttributeLocation(positionAttributeInfo);

        // const texCoordAttributeInfo = new AttributeInfo();
        // texCoordAttributeInfo.location = 1; // not dynamic! maybe look up the position of the positionattribute
        // texCoordAttributeInfo.size = 2;
        // this._buffer.addAttributeLocation(texCoordAttributeInfo);

        // const colorAttributeInfo = new AttributeInfo();
        // colorAttributeInfo.location = 2; // not dynamic! maybe look up the position of the positionattribute
        // colorAttributeInfo.size = 3;
        // this._buffer.addAttributeLocation(colorAttributeInfo);

        const normalAttributeInfo = new AttributeInfo();
        normalAttributeInfo.location = 0; // not dynamic! maybe look up the position of the positionattribute
        normalAttributeInfo.size = 3;
        this._buffer.addAttributeLocation(normalAttributeInfo);

        this.calculateVertices();
        

    }

    public update(time: number): void {

    }

    public draw(shader: Shader, modelViewMatrix: Matrix4x4): void {

        const modelLocation = shader.getUniformLocation('uModelViewMatrix');
        gl.uniformMatrix4fv(modelLocation, false, modelViewMatrix.toFloat32Array());

        const colorLocation = shader.getUniformLocation('uMaterialDiffuse');
        gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array()); // uniform 4 float (v vector)



        let normalMatrix = mat4.create();
        mat4.copy(normalMatrix, modelViewMatrix.toFloat32Array());
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        const normalLocation = shader.getUniformLocation('uNormalMatrix');
        gl.uniformMatrix4fv(normalLocation, false, normalMatrix); // uniform 4 float (v vector)

        if (!this._done) {
            console.warn('modelViewMatrix: ', modelViewMatrix.toFloat32Array());
            console.warn('modelViewMatrixGLMAt: ', modelViewMatrix.toGlMatrix());
            this._done = true;
        }

        // const normalMatrix = mat4.create();
        // mat4.invert(normalMatrix, mat4.fromValues(model.data[0], model.data[1], model.data[2], model.data[3], model.data[4], model.data[5], model.data[6], model.data[7], model.data[8], model.data[9], model.data[10], model.data[11], model.data[12], model.data[13], model.data[14], model.data[15]));
        // mat4.transpose(normalMatrix, normalMatrix);
        // const normalLocation = shader.getUniformLocation('u_normalMatrix');
        // gl.uniformMatrix4fv(normalLocation, false, normalMatrix); // uniform 4 float (v vector)

        // if (this._material.diffuseTexture !== undefined) {
        //     this._material.diffuseTexture.activateAndBind(0);
        // }
        // const diffuseLocation = shader.getUniformLocation('u_diffuse');
        // gl.uniform1i(diffuseLocation, 0);
        
        this._buffer.bind();
        this._buffer.draw();
    }

    protected calculateVertices(): void {
        const minX = - (this._width * this._origin.x);
        const minY = - (this._height * this._origin.y);
        const minZ = - (this._depth * this._origin.z);
        const maxX = this._width * (1.0 - this._origin.x);
        const maxY = this._height * (1.0 - this._origin.y);
        const maxZ = this._depth * (1.0 - this._origin.z);

        const front = [
            new Vertex(0, 0, -10, 0, 0, 1),
            new Vertex(0, 1, -10, 0, 0, 1),
            new Vertex(1, 1, -10, 0, 0, 1),

            new Vertex(1, 1, -10, 0, 0, 1),
            new Vertex(1, 0, -10, 0, 0, 1),
            new Vertex(0, 0, -10, 0, 0, 1)
        ];

        // const front = [
        //     new Vertex(minX, minY, maxZ, 0, 0, -1),
        //     new Vertex(minX, maxY, maxZ, 0, 0, -1),
        //     new Vertex(maxX, maxY, maxZ, 0, 0, -1),

        //     new Vertex(maxX, maxY, maxZ, 0, 0, -1),
        //     new Vertex(maxX, minY, maxZ, 0, 0, -1),
        //     new Vertex(minX, minY, maxZ, 0, 0, -1)
        // ];

        const left = [
            new Vertex(minX, minY, minZ, -1, 0, 0),
            new Vertex(minX, maxY, minZ, -1, 0, 0),
            new Vertex(minX, maxY, maxZ, -1, 0, 0),
            new Vertex(minX, maxY, maxZ, -1, 0, 0),
            new Vertex(minX, minY, maxZ, -1, 0, 0),
            new Vertex(minX, minY, minZ, -1, 0, 0)
        ];

        const top = [
            new Vertex(minX, minY, minZ, 0, 1, 0),
            new Vertex(minX, minY, maxZ, 0, 1, 0),
            new Vertex(maxX, minY, maxZ, 0, 1, 0),
            new Vertex(maxX, minY, maxZ, 0, 1, 0),
            new Vertex(maxX, minY, minZ, 0, 1, 0),
            new Vertex(minX, minY, minZ, 0, 1, 0)
        ];
        
        // const left = [
        //     new Vertex(maxX, minY, minZ, 0, 0),
        //     new Vertex(maxX, maxY, minZ, 0, 1),
        //     new Vertex(maxX, maxY, maxZ, 1, 1),
        //     new Vertex(maxX, maxY, maxZ, 1, 1),
        //     new Vertex(maxX, minY, maxZ, 1, 0),
        //     new Vertex(maxX, minY, minZ, 0, 0),
        // ];



        const back = [
            new Vertex(minX, minY, minZ, 0, 0), // bottom left
            new Vertex(minX, maxY, minZ, 0, 1), // top left
            new Vertex(maxX, maxY, minZ, 1, 1), // top right68

            new Vertex(maxX, maxY, minZ, 1, 1), // top right
            new Vertex(maxX, minY, minZ, 1, 0), // bottom right
            new Vertex(minX, minY, minZ, 0, 0), // bottom left
        ];



        const right = [
            new Vertex(minX, minY, minZ, 0.8, 0, -1.0),
            new Vertex(minX, maxY, minZ, 0.8, 0, -1.0),
            new Vertex(minX, maxY, maxZ, 0.8, 0, -1.0),

            new Vertex(minX, maxY, maxZ, 0.8, 0, -1.0),
            new Vertex(minX, minY, maxZ, 0.8, 0, -1.0),
            new Vertex(minX, minY, minZ, 0.8, 0, -1.0)
        ];

        const bottom = [
            new Vertex(minX, maxY, minZ, 0.75, 0.0, 0.0),
            new Vertex(minX, maxY, maxZ, 0.75, 0.0, 0.0),
            new Vertex(maxX, maxY, maxZ, 0.75, 0.0, 0.0),

            new Vertex(maxX, maxY, maxZ, 0.75, 0.0, 0.0),
            new Vertex(maxX, maxY, minZ, 0.75, 0.0, 0.0),
            new Vertex(minX, maxY, minZ, 0.75, 0.0, 0.0)
        ];
        

        this._vertices = [
            ...front,
            // ...left,
            // ...top
        ];

        for (const vertex of this._vertices) {
            this._buffer.pushBackData(vertex.toArray());
        }

        this._buffer.upload();
        this._buffer.unbind();
    }

    protected recalculateVertices(): void {
        const minX = - (this._width * this._origin.x);
        const minY = - (this._height * this._origin.y);
        const minZ = - (this._depth * this._origin.z);
        const maxX = this._width * (1.0 - this._origin.x);
        const maxY = this._height * (1.0 - this._origin.y);
        const maxZ = this._depth * (1.0 - this._origin.z);

        // Front
        this._vertices[0].position.set(minX, minY, minZ);
        this._vertices[1].position.set(minX, maxY, minZ);
        this._vertices[2].position.set(maxX, maxY, minZ);

        this._vertices[3].position.set(maxX, maxY, minZ);
        this._vertices[4].position.set(maxX, minY, minZ);
        this._vertices[5].position.set(minX, minY, minZ);

        // Right
        this._vertices[6].position.set(maxX, minY, minZ);
        this._vertices[7].position.set(maxX, maxY, minZ);
        this._vertices[8].position.set(maxX, maxY, maxZ);

        this._vertices[9].position.set(maxX, maxY, maxZ);
        this._vertices[10].position.set(maxX, minY, maxZ);
        this._vertices[11].position.set(maxX, minY, minZ);

        // Top
        this._vertices[12].position.set(minX, minY, minZ);
        this._vertices[13].position.set(minX, minY, maxZ);
        this._vertices[14].position.set(maxX, minY, maxZ);
        
        this._vertices[15].position.set(maxX, minY, maxZ);
        this._vertices[16].position.set(maxX, minY, minZ);
        this._vertices[17].position.set(minX, minY, minZ);

        // Back
        this._vertices[18].position.set(minX, minY, maxZ);
        this._vertices[19].position.set(minX, maxY, maxZ);
        this._vertices[20].position.set(maxX, maxY, maxZ);

        this._vertices[21].position.set(maxX, maxY, maxZ);
        this._vertices[22].position.set(maxX, minY, maxZ);
        this._vertices[23].position.set(minX, minY, maxZ);

        // Left
        this._vertices[24].position.set(minX, minY, minZ);
        this._vertices[25].position.set(minX, maxY, minZ);
        this._vertices[26].position.set(minX, maxY, maxZ);

        this._vertices[27].position.set(minX, maxY, maxZ);
        this._vertices[28].position.set(minX, minY, maxZ);
        this._vertices[29].position.set(minX, minY, minZ);

        // Bottom
        this._vertices[30].position.set(minX, maxY, minZ);
        this._vertices[31].position.set(minX, maxY, maxZ);
        this._vertices[32].position.set(maxX, maxY, maxZ);
        
        this._vertices[33].position.set(maxX, maxY, maxZ);
        this._vertices[34].position.set(maxX, maxY, minZ);
        this._vertices[35].position.set(minX, maxY, minZ);

        this._buffer.clearData();

        for (const vertex of this._vertices) {
            this._buffer.pushBackData(vertex.toArray());
        }

        this._buffer.upload();
        this._buffer.unbind();
    }

}