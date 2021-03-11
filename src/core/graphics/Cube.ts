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
        // Front 
        -0.5, 0.5, 0.5, 0, 0, 1,
        -0.5,-0.5, 0.5, 0, 0, 1,
        0.5,-0.5, 0.5, 0, 0, 1,
 
        0.5,-0.5, 0.5, 0, 0, 1,
        0.5,0.5, 0.5, 0, 0, 1,
        -0.5,0.5, 0.5, 0, 0, 1,
 
        // Right 
        0.5, 0.5, 0.5, 1, 0, 0,
        0.5,-0.5, 0.5, 1, 0, 0,
        0.5,-0.5, -0.5, 1, 0, 0,
         
        0.5,-0.5, -0.5, 1, 0, 0,
        0.5,0.5, -0.5, 1, 0, 0,
        0.5,0.5, 0.5, 1, 0, 0,
 
        // Back 
        -0.5, 0.5, -0.5, 0, 0, -1,
        -0.5,-0.5, -0.5, 0, 0, -1,
        0.5,-0.5, -0.5, 0, 0, -1,
 
        0.5,-0.5, -0.5, 0, 0, -1,
        0.5,0.5, -0.5, 0, 0, -1,
        -0.5,0.5, -0.5, 0, 0, -1,
         
        // Top 
        -0.5, 0.5, -0.5, 0, 1, 0,
        -0.5,0.5, 0.5, 0, 1, 0,
        0.5,0.5, 0.5, 0, 1, 0,
         
        0.5,0.5, 0.5, 0, 1, 0,
        0.5,0.5, -0.5, 0, 1, 0,
        -0.5, 0.5, -0.5, 0, 1, 0,
 
        // Left 
        -0.5, 0.5, 0.5, -1, 0, 0,
        -0.5,-0.5, 0.5, -1, 0, 0,
        -0.5,-0.5, -0.5, -1, 0, 0,
         
        -0.5,-0.5, -0.5, -1, 0, 0,
        -0.5,0.5, -0.5, -1, 0, 0,
        -0.5,0.5, 0.5, -1, 0, 0,
 
        // Bottom 
        -0.5, -0.5, -0.5, 0, -1, 0,
        -0.5,-0.5, 0.5, 0, -1, 0,
        0.5,-0.5, 0.5, 0, -1, 0,
         
        0.5,-0.5, 0.5, 0, -1, 0,
        0.5,-0.5, -0.5, 0, -1, 0,
        -0.5, -0.5, -0.5, 0, -1, 0,

    ];
    protected _indeces: number[] = [
        // // Front
        // 0,1,2,0,2,3,
        // // Right
        // 3,2,4,3,4,5,
        // // Back
        // 5,4,6,5,6,7,
        // // Top
        // 0,3,7,7,3,5,
        // // Left
        // 7,6,1,7,1,0,
        // // Bottom
        // 1,6,4,1,4,2
    ];

    protected _normals: number[] = [
        // Front
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // Right
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // Back
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        // Top
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // Left
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        // Bottom
        0, -1, 0,
        0, -1, 0,
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
        this._vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this._vertexArray);
        
        // Vertices
        this._verticesBuffer = new GLBuffer();
        const positionAttributeInfo = new AttributeInfo();
        positionAttributeInfo.location = 1;
        positionAttributeInfo.size = 3;
        this._verticesBuffer.addAttributeLocation(positionAttributeInfo);


        const normalAttributeInfo = new AttributeInfo();
        normalAttributeInfo.location = 0;
        normalAttributeInfo.size = 3;
        this._verticesBuffer.addAttributeLocation(normalAttributeInfo);

        this._verticesBuffer.pushBackData(this._vertices);
        this._verticesBuffer.upload();
        this._verticesBuffer.unbind();

        gl.bindVertexArray(null);
    }

    public update(time: number): void {

    }

    public draw(shader: Shader, modelViewMatrix: Matrix4x4): void {

        const modelLocation = shader.getUniformLocation('uModelViewMatrix');
        gl.uniformMatrix4fv(modelLocation, false, modelViewMatrix.toFloat32Array());

        const colorLocation = shader.getUniformLocation('uMaterialDiffuse');
        gl.uniform3fv(colorLocation, this._material.tint.toVec3Float32Array()); // uniform 4 float (v vector)

        // set normalMatrix attribute
        let normalMatrix = mat4.create();
        mat4.copy(normalMatrix, modelViewMatrix.toFloat32Array());
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        const normalLocation = shader.getUniformLocation('uNormalMatrix');
        gl.uniformMatrix4fv(normalLocation, false, normalMatrix); // uniform 4 float (v vector)
        
        try {
            gl.bindVertexArray(this._vertexArray);
            this._verticesBuffer.bind();
            this._verticesBuffer.draw(); 
            this._verticesBuffer.unbind();
            gl.bindVertexArray(null);
          }
          catch (error) {
            console.error(error);
          }
    }

}