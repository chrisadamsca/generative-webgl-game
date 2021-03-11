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

    protected _vertexArray: WebGLVertexArrayObject;
    protected _verticesBuffer: GLBuffer;
    protected _indecesBuffer: GLBuffer;
    protected _normalsBuffer: GLBuffer;

    protected log = 0;

    protected _materialName: string;
    protected _material: Material;
    protected _vertices: number[] = [	
        0, 0, 0,
        0, 0.5, 0,
        0.5,-0.5, 0,
        // -0.5, 0.5, 0.5,
        // -0.5,-0.5, 0.5,
        // 0.5,-0.5, 0.5,
        // 0.5, 0.5, 0.5,
        // 0.5,-0.5,-0.5,
        // 0.5, 0.5,-0.5,
        // -0.5,-0.5,-0.5,
        // -0.5, 0.5, -0.5
    ];
    protected _indeces: number[] = [
        // Front
        0,1,2,0,2,3,
        // Right
        3,2,4,3,4,5,
        // Back
        5,4,6,5,6,7,
        // Top
        0,3,7,7,3,5,
        // Left
        7,6,1,7,1,0,
        // Bottom
        1,6,4,1,4,2
    ];

    protected _normals: number[] = [
        // Front
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // Right
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // Back
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        // Top
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // Left
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        // Bottom
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ];

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
        this._verticesBuffer.destroy();
        this._indecesBuffer.destroy();
        this._normalsBuffer.destroy();
        MaterialManager.releaseMaterial(this._materialName);
        this._material = undefined;
        this._materialName = undefined;
    }

    public load(): void {
        // Create VAO
        this._vertexArray = gl.createVertexArray();
        // Bind VAO
        gl.bindVertexArray(this._vertexArray);
        
        // Vertices
        this._verticesBuffer = new GLBuffer();
        const positionAttributeInfo = new AttributeInfo();
        positionAttributeInfo.location = 0;
        positionAttributeInfo.size = 3;
        this._verticesBuffer.addAttributeLocation(positionAttributeInfo);


        this._verticesBuffer.pushBackData(this._vertices);
        this._verticesBuffer.upload();


        // // Normals
        // this._normalsBuffer = new GLBuffer();
        // const normalAttributeInfo = new AttributeInfo();
        // normalAttributeInfo.location = 0;
        // normalAttributeInfo.size = 3;
        // this._normalsBuffer.addAttributeLocation(normalAttributeInfo);


        // this._normalsBuffer.pushBackData(this._normals);
        // this._normalsBuffer.upload();

        // // Indeces
        // this._indecesBuffer = new GLBuffer(gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER);


        // this._indecesBuffer.pushBackData(this._indeces);
        // this._indecesBuffer.upload();

        gl.bindVertexArray(null);

        // this.calculateVertices();
    }

    public update(time: number): void {

    }

    public draw(shader: Shader, modelViewMatrix: Matrix4x4): void {


        // uniform mat4 uProjectionMatrix;  [-]
        // uniform mat4 uModelViewMatrix;   [x]
        // uniform mat4 uNormalMatrix;      [x]
        // uniform vec3 uMaterialDiffuse;   [x]
        // uniform vec3 uLightDirection;    [x]
        // uniform vec3 uLightDiffuse;      [x]

        const testModelViewMatrix = mat4.create();

        const modelLocation = shader.getUniformLocation('uModelViewMatrix');
        gl.uniformMatrix4fv(modelLocation, false, testModelViewMatrix);

        // const colorLocation = shader.getUniformLocation('uMaterialDiffuse');
        // gl.uniform3fv(colorLocation, new Float32Array([0.0,1.0,0.0])); // uniform 4 float (v vector)

        // const lightDirLocation = shader.getUniformLocation('uLightDirection');
        // gl.uniform3fv(lightDirLocation, new Float32Array([-2.0, 0.0, -1.0])); // uniform 4 float (v vector)

        // const lightDiffuseLocation = shader.getUniformLocation('uLightDiffuse');
        // gl.uniform3fv(lightDiffuseLocation, new Float32Array([1, 0.8, 0.8])); // uniform 4 float (v vector)



        // let normalMatrix = mat4.create();
        // mat4.copy(normalMatrix, testModelViewMatrix);
        // mat4.invert(normalMatrix, normalMatrix);
        // mat4.transpose(normalMatrix, normalMatrix);
        // const normalLocation = shader.getUniformLocation('uNormalMatrix');
        // gl.uniformMatrix4fv(normalLocation, false, normalMatrix); // uniform 4 float (v vector)

        // if (!this._done) {
        //     // console.warn('modelViewMatrix: ', modelViewMatrix.toFloat32Array());
        //     // console.warn('testModelViewMatrix: ', testModelViewMatrix);
        //     // console.warn('tint: ', this._material.tint.toFloat32Array());
        //     this._done = true;
        // }

        if (this.log < 10) {
            console.warn('uModelViewMatrix', testModelViewMatrix);
            // console.warn('uNormalMatrix', normalMatrix);
            this.log++;
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
        
        try {
            // Bind
            gl.bindVertexArray(this._vertexArray);
            this._verticesBuffer.bind();
            this._verticesBuffer.draw(); 
            this._verticesBuffer.unbind();
            gl.bindVertexArray(null);
          }
          // We catch the `error` and simply output to the screen for testing/debugging purposes
          catch (error) {
            console.error(error);
          }
    }

    protected calculateVertices(): void {



    }

    protected recalculateVertices(): void {
        // const minX = - (this._width * this._origin.x);
        // const minY = - (this._height * this._origin.y);
        // const minZ = - (this._depth * this._origin.z);
        // const maxX = this._width * (1.0 - this._origin.x);
        // const maxY = this._height * (1.0 - this._origin.y);
        // const maxZ = this._depth * (1.0 - this._origin.z);

        // // Front
        // this._vertices[0].position.set(minX, minY, minZ);
        // this._vertices[1].position.set(minX, maxY, minZ);
        // this._vertices[2].position.set(maxX, maxY, minZ);

        // this._vertices[3].position.set(maxX, maxY, minZ);
        // this._vertices[4].position.set(maxX, minY, minZ);
        // this._vertices[5].position.set(minX, minY, minZ);

        // // Right
        // this._vertices[6].position.set(maxX, minY, minZ);
        // this._vertices[7].position.set(maxX, maxY, minZ);
        // this._vertices[8].position.set(maxX, maxY, maxZ);

        // this._vertices[9].position.set(maxX, maxY, maxZ);
        // this._vertices[10].position.set(maxX, minY, maxZ);
        // this._vertices[11].position.set(maxX, minY, minZ);

        // // Top
        // this._vertices[12].position.set(minX, minY, minZ);
        // this._vertices[13].position.set(minX, minY, maxZ);
        // this._vertices[14].position.set(maxX, minY, maxZ);
        
        // this._vertices[15].position.set(maxX, minY, maxZ);
        // this._vertices[16].position.set(maxX, minY, minZ);
        // this._vertices[17].position.set(minX, minY, minZ);

        // // Back
        // this._vertices[18].position.set(minX, minY, maxZ);
        // this._vertices[19].position.set(minX, maxY, maxZ);
        // this._vertices[20].position.set(maxX, maxY, maxZ);

        // this._vertices[21].position.set(maxX, maxY, maxZ);
        // this._vertices[22].position.set(maxX, minY, maxZ);
        // this._vertices[23].position.set(minX, minY, maxZ);

        // // Left
        // this._vertices[24].position.set(minX, minY, minZ);
        // this._vertices[25].position.set(minX, maxY, minZ);
        // this._vertices[26].position.set(minX, maxY, maxZ);

        // this._vertices[27].position.set(minX, maxY, maxZ);
        // this._vertices[28].position.set(minX, minY, maxZ);
        // this._vertices[29].position.set(minX, minY, minZ);

        // // Bottom
        // this._vertices[30].position.set(minX, maxY, minZ);
        // this._vertices[31].position.set(minX, maxY, maxZ);
        // this._vertices[32].position.set(maxX, maxY, maxZ);
        
        // this._vertices[33].position.set(maxX, maxY, maxZ);
        // this._vertices[34].position.set(maxX, maxY, minZ);
        // this._vertices[35].position.set(minX, maxY, minZ);

        // this._buffer.clearData();

        // for (const vertex of this._vertices) {
        //     this._buffer.pushBackData(vertex.toArray());
        // }

        // this._buffer.upload();
        // this._buffer.unbind();
    }

}