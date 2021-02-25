import { AssetManager } from "./assets/AssetManager";
import { gl, GLUtilities } from "./gl/GLUtilities";
import { BasicShader } from "./gl/shaders/BasicShader";
import { Color } from "./graphics/Color";
import { Material } from "./graphics/Material";
import { MaterialManager } from "./graphics/MaterialManager";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/MessageBus";
import { LevelManager } from "./world/LevelManager";
import { SpriteComponentData } from "./components/SpriteComponent"
import { RotationBehaviorData } from "./behaviors/RotationBehavior";
import { AnimatedSpriteComponentData } from "./components/AnimatedSpriteComponent";
import { InputManager, MouseContext } from "./input/InputManager";
import { KeyboardMovementBehaviorData } from "./behaviors/KeyboardMovementBehavior";
import { IMessageHandler } from "./message/IMessageHandler";
import { Message } from "./message/Message";

const tempWebpackFixToIncludeSpriteTS = new SpriteComponentData();
const tempWebpackFixToIncludeAnimatedSpriteTS = new AnimatedSpriteComponentData();
const tempWebpackFixToIncludeRotationBehaviorTS = new RotationBehaviorData();
const tempWebpackFixToIncludeKeyboardMovementBehaviorTS = new KeyboardMovementBehaviorData();

export class Engine implements IMessageHandler{

    private _canvas: HTMLCanvasElement;
    private _basicShader: BasicShader;
    private _previousTime: number = 0;
    
    
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

    public onMessage(message: Message): void {
        if (message.code === 'MOUSE_UP') {
            const context = message.context as MouseContext;
            document.title = `Pos: [${context.position.x}, ${context.position.y}]`;
        }
    }

    public start(): Engine {
        console.log('Engine started.');

        AssetManager.initialize();
        InputManager.initialize();
        LevelManager.initialize();

        Message.subscribe('MOUSE_UP', this)
        
        this._canvas = GLUtilities.initialize();
        this.resize();

        gl.clearColor(0, 0, 1, 1);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Load Shaders
        this._basicShader = new BasicShader();
        this._basicShader.use()

        // Load Materials
        MaterialManager.registerMaterial(new Material('test', '/assets/textures/texture.jpg', Color.white()));
        MaterialManager.registerMaterial(new Material('duck', '/assets/textures/duck.png', Color.white()));

        this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);

        LevelManager.changeLevel(0);
        
        this.loop();
        return this;
    }

    private loop(): void {
        this.update();
        this.render();
    }

    private update(): void {
        const delta = performance.now() - this._previousTime;
        
        MessageBus.update(delta);

        LevelManager.update(delta);

        this._previousTime = performance.now();
    }

    private render(): void {
        gl.clear(gl.COLOR_BUFFER_BIT); // ??? What is this? Resetting everything, but how?

        LevelManager.render(this._basicShader);

        const projectionLocation = this._basicShader.getUniformLocation('u_projection');
        gl.uniformMatrix4fv(projectionLocation, false, this._projection.toFloat32Array());

        requestAnimationFrame(() => this.loop());
    }

}