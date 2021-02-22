import { AssetManager } from "./assets/AssetManager";
import { AttributeInfo, GLBuffer } from "./gl/GLBuffer";
import { gl, GLUtilities } from "./gl/GLUtilities";
import { Shader } from "./gl/Shader";
import { Sprite } from "./graphics/Sprite";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/MessageBus";

const glsl = x => x;

export class Engine {

    private _canvas: HTMLCanvasElement;
    private _shader: Shader;

    // temporary:
    private _sprite: Sprite;
    private _projection: Matrix4x4;

    public constructor() {
        console.log('Engine created.');
    }

    public resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            this._projection = Matrix4x4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100.0, 100.0);
            gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    public start(): Engine {
        console.log('Engine started.');

        AssetManager.initialize();
        
        this._canvas = GLUtilities.initialize();
        this.resize();

        gl.clearColor(0, 0, 1, 1);
        this.loadShaders();
        this._shader.use();
        
        this._sprite = new Sprite('test', '/assets/textures/texture.jpg');
        this._sprite.load();
        this._sprite.position.x = 1;
        
        this.loop();
        return this;
    }

    private loop(): void {
        MessageBus.update(0);
        
        gl.clear(gl.COLOR_BUFFER_BIT); // ??? What is this? Resetting everything, but how?

        const colorLocation = this._shader.getUniformLocation('u_tint');
        // gl.uniform4f(colorLocation, 1, 0.5, 0, 1); // uniform 4 float 
        gl.uniform4f(colorLocation, 1, 1, 1, 1); // uniform 4 float 

        const projectionLocation = this._shader.getUniformLocation('u_projection');
        gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(this._projection.data));

        const modelLocation = this._shader.getUniformLocation('u_model');
        gl.uniformMatrix4fv(modelLocation, false, new Float32Array(Matrix4x4.translation(this._sprite.position).data));

        this._sprite.draw(this._shader);

        requestAnimationFrame(() => {
            
            this.loop();
        });
    }

    private loadShaders(): void {
        const vertexSource = glsl`
            attribute vec3 a_position;
            attribute vec2 a_texCoord;

            uniform mat4 u_projection;
            uniform mat4 u_model;

            varying vec2 v_texCoord;

            void main() {
                gl_Position = u_model * u_projection * vec4(a_position, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        const fragmentSource = glsl`
            precision mediump float;

            uniform vec4 u_tint;
            uniform sampler2D u_diffuse;

            varying vec2 v_texCoord;

            void main() {
                gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
            }
        `;
        this._shader = new Shader('basic', vertexSource, fragmentSource);
    }

}