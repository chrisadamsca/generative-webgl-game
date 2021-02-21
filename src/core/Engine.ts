import { gl, GLUtilities } from "./gl/GLUtilities";
import { Shader } from "./gl/Shader";

const glsl = x => x;

export class Engine {

    private _canvas: HTMLCanvasElement;
    private _shader: Shader;

    public constructor() {
        console.log('Engine created.');
    }

    public resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
        }
    }

    public start(): Engine {
        console.log('Engine started.');
        
        this._canvas = GLUtilities.initialize();

        gl.clearColor(0, 0, 1, 1);
        this.loadShaders();
        this._shader.use();

        this.loop();
        return this;
    }

    private loop(): void {
        gl.clear(gl.COLOR_BUFFER_BIT); // ??? What is this? Resetting everything, but how?

        requestAnimationFrame(() => {
            
            this.loop();
        });
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
            void main() {
                gl_FragColor = vec4(1.0);
            }
        `;
        this._shader = new Shader('basic', vertexSource, fragmentSource);
    }

}