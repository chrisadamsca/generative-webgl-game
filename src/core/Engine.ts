import { AttributeInfo, GLBuffer } from "./gl/GLBuffer";
import { gl, GLUtilities } from "./gl/GLUtilities";
import { Shader } from "./gl/Shader";

const glsl = x => x;

export class Engine {

    private _canvas: HTMLCanvasElement;
    private _shader: Shader;

    private _buffer: GLBuffer;

    public constructor() {
        console.log('Engine created.');
    }

    public resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    public start(): Engine {
        console.log('Engine started.');
        
        this._canvas = GLUtilities.initialize();

        gl.clearColor(0, 0, 1, 1);
        this.loadShaders();
        this._shader.use();

        this.createBuffer();

        this.loop();
        return this;
    }

    private loop(): void {
        gl.clear(gl.COLOR_BUFFER_BIT); // ??? What is this? Resetting everything, but how?

        const colorPosition = this._shader.getUniformLocation('u_color');
        gl.uniform4f(colorPosition, 1, 0.5, 0, 1); // uniform 4 float 

        this._buffer.bind();
        this._buffer.draw();

        requestAnimationFrame(() => {
            
            this.loop();
        });
    }

    private createBuffer(): void {
        this._buffer = new GLBuffer(3);

        const positionAttributeInfo = new AttributeInfo();
        positionAttributeInfo.location = this._shader.getAttributeLocation('a_position');
        positionAttributeInfo.offset = 0;
        positionAttributeInfo.size = 3;
        this._buffer.addAttributeLocation(positionAttributeInfo);

        const vertices = [
            0,   0,   0,
            0,   0.5, 0,
            0.5, 0.5, 0
        ];

        this._buffer.pushBackData(vertices);
        this._buffer.upload();
        this._buffer.unbind();
    }

    private loadShaders(): void {
        const vertexSource = glsl`
            attribute vec3 a_position;

            void main() {
                gl_Position = vec4(a_position, 1.0);
            }
        `;
        const fragmentSource = glsl`
            precision mediump float;

            uniform vec4 u_color;

            void main() {
                gl_FragColor = u_color;
            }
        `;
        this._shader = new Shader('basic', vertexSource, fragmentSource);
    }

}