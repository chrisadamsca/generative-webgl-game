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

    protected _materialName: string;
    protected _material: Material;
    protected _alpha: number = 1;
    protected _vertices: number[];    

    public constructor(name: string, materialName: string, width: number = 1, height: number = 1, depth: number = 1, alpha = 1) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._depth = depth;
        this._materialName = materialName;

        this._material = MaterialManager.getMaterial(this._materialName);
        this._alpha = alpha;
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

    public get depth(): number {
        return this._depth;
    }

    public get origin(): Vector3 {
        return this._origin;
    }

    public set origin(value: Vector3) {
        this._origin = value;
    }

    public destroy(): void {
        this._verticesBuffer.destroy();
        MaterialManager.releaseMaterial(this._materialName);
        this._material = undefined;
        this._materialName = undefined;
    }

    public load(): void {
        this._vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this._vertexArray);
        
        const widthHalf = this._width / 2;
        const heightHalf = this._height / 2;
        const depthHalf = this._depth / 2;

        // Vertices
        this._vertices = [	
            // Front
            -widthHalf, heightHalf, depthHalf, 0, 0, 1,
            -widthHalf,-heightHalf, depthHalf, 0, 0, 1,
            widthHalf,-heightHalf, depthHalf, 0, 0, 1,
     
            widthHalf,-heightHalf, depthHalf, 0, 0, 1,
            widthHalf,heightHalf, depthHalf, 0, 0, 1,
            -widthHalf,heightHalf, depthHalf, 0, 0, 1,
     
            // Right 
            widthHalf, heightHalf, depthHalf, 1, 0, 0,
            widthHalf,-heightHalf, depthHalf, 1, 0, 0,
            widthHalf,-heightHalf, -depthHalf, 1, 0, 0,
             
            widthHalf,-heightHalf, -depthHalf, 1, 0, 0,
            widthHalf,heightHalf, -depthHalf, 1, 0, 0,
            widthHalf,heightHalf, depthHalf, 1, 0, 0,
     
            // Back 
            -widthHalf, heightHalf, -depthHalf, 0, 0, -1,
            -widthHalf,-heightHalf, -depthHalf, 0, 0, -1,
            widthHalf,-heightHalf, -depthHalf, 0, 0, -1,
     
            widthHalf,-heightHalf, -depthHalf, 0, 0, -1,
            widthHalf,heightHalf, -depthHalf, 0, 0, -1,
            -widthHalf,heightHalf, -depthHalf, 0, 0, -1,
             
            // Top 
            -widthHalf, heightHalf, -depthHalf, 0, 1, 0,
            -widthHalf,heightHalf, depthHalf, 0, 1, 0,
            widthHalf,heightHalf, depthHalf, 0, 1, 0,
             
            widthHalf,heightHalf, depthHalf, 0, 1, 0,
            widthHalf,heightHalf, -depthHalf, 0, 1, 0,
            -widthHalf, heightHalf, -depthHalf, 0, 1, 0,
     
            // Left 
            -widthHalf, heightHalf, depthHalf, -1, 0, 0,
            -widthHalf,-heightHalf, depthHalf, -1, 0, 0,
            -widthHalf,-heightHalf, -depthHalf, -1, 0, 0,
             
            -widthHalf,-heightHalf, -depthHalf, -1, 0, 0,
            -widthHalf,heightHalf, -depthHalf, -1, 0, 0,
            -widthHalf,heightHalf, depthHalf, -1, 0, 0,
     
            // Bottom 
            -widthHalf, -heightHalf, -depthHalf, 0, -1, 0,
            -widthHalf,-heightHalf, depthHalf, 0, -1, 0,
            widthHalf,-heightHalf, depthHalf, 0, -1, 0,
             
            widthHalf,-heightHalf, depthHalf, 0, -1, 0,
            widthHalf,-heightHalf, -depthHalf, 0, -1, 0,
            -widthHalf, -heightHalf, -depthHalf, 0, -1, 0,
    
        ]


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

        const alphaLocation = shader.getUniformLocation('uMaterialAlpha');
        gl.uniform1f(alphaLocation, this._alpha); // uniform 4 float (v vector)

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