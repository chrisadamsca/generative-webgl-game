import { AssetManager } from "./assets/AssetManager";
import { gl, GLUtilities } from "./gl/GLUtilities";
import { BasicShader } from "./gl/shaders/BasicShader";
import { Color } from "./graphics/Color";
import { Material } from "./graphics/Material";
import { MaterialManager } from "./graphics/MaterialManager";
import { Sprite } from "./graphics/Sprite";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/MessageBus";
import { LevelManager } from "./world/LevelManager";

export class Engine {

    private _canvas: HTMLCanvasElement;
    private _basicShader: BasicShader;
    
    // temporary:
    private _projection: Matrix4x4;

    public constructor() {
        console.log('Engine created.');
    }

    public resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
        }
    }

    public start(): Engine {
        console.log('Engine started.');

        AssetManager.initialize();
        
        this._canvas = GLUtilities.initialize();
        this.resize();

        gl.clearColor(0, 0, 1, 1);

        // Load Shaders
        this._basicShader = new BasicShader();
        this._basicShader.use()

        // Load Materials
        MaterialManager.registerMaterial(new Material('test', '/assets/textures/texture.jpg', Color.white()));

        const levelId = LevelManager.createTestLevel();
        LevelManager.changeLevel(levelId);

        this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
        
        this.loop();
        return this;
    }

    private loop(): void {
        MessageBus.update(0);

        LevelManager.update(0);
        
        gl.clear(gl.COLOR_BUFFER_BIT); // ??? What is this? Resetting everything, but how?

        LevelManager.render(this._basicShader);

        const projectionLocation = this._basicShader.getUniformLocation('u_projection');
        gl.uniformMatrix4fv(projectionLocation, false, this._projection.toFloat32Array());

        requestAnimationFrame(() => {
            
            this.loop();
        });
    }

}