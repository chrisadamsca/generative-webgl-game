import { AssetManager } from "./assets/AssetManager";
import { gl, GLUtilities } from "./gl/GLUtilities";
import { BasicShader } from "./gl/shaders/BasicShader";
import { Color } from "./graphics/Color";
import { Material } from "./graphics/Material";
import { MaterialManager } from "./graphics/MaterialManager";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/MessageBus";
import { LevelManager } from "./world/LevelManager";
import { RotationBehaviorData } from "./behaviors/RotationBehavior";
import { InputManager, MouseContext } from "./input/InputManager";
import { KeyboardMovementBehaviorData } from "./behaviors/KeyboardMovementBehavior";
import { IMessageHandler } from "./message/IMessageHandler";
import { Message, PLAYER_DIED } from "./message/Message";
import { AudioManager } from "./audio/AudioManager";
import { CollisionComponentData } from "./components/CollisionComponent";
import { CollisionManager } from "./collision/CollisionManager";
import { PlayerBehaviorData } from "./behaviors/PlayerBehavior";
import { importMath } from "./math/MathExtensions";
import { ScrollBehaviorData } from "./behaviors/ScrollBehavior";
import { Cube } from "./graphics/Cube";
import { CubeComponentData } from "./components/CubeComponent";
import { Vector3 } from "./math/Vector3";
import { AdvancedShader } from "./gl/shaders/AdvancedShader";
import { mat4, vec3 } from "gl-matrix";
import { Shader } from "./gl/Shader";
import { ItemComponentData } from "./components/ItemComponent";
import { Camera } from "./graphics/Camera";

const tempWebpackFixToIncludeColisionComponentTS = new CollisionComponentData();
const tempWebpackFixToIncludeItemComponentTS = new ItemComponentData();
const tempWebpackFixToIncludeRotationBehaviorTS = new RotationBehaviorData();
const tempWebpackFixToIncludeKeyboardMovementBehaviorTS = new KeyboardMovementBehaviorData();
const tempWebpackFixToIncludePlayerBehaviorTS = new PlayerBehaviorData();
const tempWebpackFixToIncludeScrollBehaviorTS = new ScrollBehaviorData();
const tempWebpackFixToIncludeCubeTS = new CubeComponentData();
const i = importMath;

export class Engine implements IMessageHandler{

    private _canvas: HTMLCanvasElement;
    private _shader: Shader;
    private _previousTime: number = 0;

    private _camera: Camera;

    public constructor() {
        console.log('Engine created.');
        Message.subscribe(PLAYER_DIED, this);
    }

    public resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            
            if (this._camera) {
                this._camera.resize();
            }
        }
    }

    public onMessage(message: Message): void {
        if (message.code === PLAYER_DIED) {
            // alert();
            // LevelManager.changeLevel(1);
        }
    }

    public start(): Engine {
        console.log('Engine started.');

        AssetManager.initialize();
        InputManager.initialize();
        LevelManager.initialize();

        this._canvas = GLUtilities.initialize();
        this.resize();

        gl.clearColor(255 / 255, 241 / 255, 224 / 255, 1);
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);

        // Load Shaders
        this._shader = new AdvancedShader();
        this._shader.use()

        // Load Camera
        this._camera = new Camera(this._shader);
        this._camera.initialize();

        // Load Materials
        MaterialManager.registerMaterial(new Material('bg', '/assets/textures/bg.png', Color.white()));
        MaterialManager.registerMaterial(new Material('cube', '/assets/textures/cube.png', Color.white()));
        MaterialManager.registerMaterial(new Material('white', '/assets/textures/cube.png', Color.white()));
        MaterialManager.registerMaterial(new Material('red', '/assets/textures/cube.png', new Color(253, 154, 158)));
        MaterialManager.registerMaterial(new Material('green', '/assets/textures/cube.png', new Color(176, 208, 211)));
        MaterialManager.registerMaterial(new Material('blue', '/assets/textures/cube.png', new Color(247, 175, 157)));

        // Load Sounds
        // AudioManager.loadSoundFile('flap', '/assets/sounds/flap.mp3');

        // Setup light
        const lightDirLocation = this._shader.getUniformLocation('uLightDirection');
        gl.uniform3fv(lightDirLocation, [0, -5, -3]); // uniform 4 float (v vector)

        const lightDiffuseLocation = this._shader.getUniformLocation('uLightDiffuse');
        gl.uniform3fv(lightDiffuseLocation, [1, 1, 1]); // uniform 4 float (v vector)

        LevelManager.changeLevel();

        setTimeout(() => {
            Message.send('GAME_START', this);
        }, 3000);
        
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
        CollisionManager.update(delta);

        this._previousTime = performance.now();
    }

    private render(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // ??? What is this? Resetting everything, but how?

        this._camera.render();

        LevelManager.render(this._shader);

        requestAnimationFrame(() => this.loop());
    }

}