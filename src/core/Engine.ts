import { AssetManager } from "./assets/AssetManager";
import { gl, GLUtilities } from "./gl/GLUtilities";
import { Color } from "./graphics/Color";
import { Material } from "./graphics/Material";
import { MaterialManager } from "./graphics/MaterialManager";
import { MessageBus } from "./message/MessageBus";
import { LevelManager } from "./world/LevelManager";
import { RotationBehaviorData } from "./behaviors/RotationBehavior";
import { InputManager, MouseContext } from "./input/InputManager";
import { KeyboardMovementBehaviorData } from "./behaviors/KeyboardMovementBehavior";
import { Message } from "./message/Message";
import { AudioManager } from "./audio/AudioManager";
import { CollisionComponentData } from "./components/CollisionComponent";
import { CollisionManager } from "./collision/CollisionManager";
import { PlayerBehaviorData } from "./behaviors/PlayerBehavior";
import { importMath } from "./math/MathExtensions";
import { ScrollBehaviorData } from "./behaviors/ScrollBehavior";
import { CubeComponentData } from "./components/CubeComponent";
import { AdvancedShader } from "./gl/shaders/AdvancedShader";
import { Shader } from "./gl/Shader";
import { PointComponentData } from "./components/PointComponent";
import { Camera } from "./graphics/Camera";

const tempWebpackFixToIncludeColisionComponentTS = new CollisionComponentData();
const tempWebpackFixToIncludePointComponentTS = new PointComponentData();
const tempWebpackFixToIncludeRotationBehaviorTS = new RotationBehaviorData();
const tempWebpackFixToIncludeKeyboardMovementBehaviorTS = new KeyboardMovementBehaviorData();
const tempWebpackFixToIncludePlayerBehaviorTS = new PlayerBehaviorData();
const tempWebpackFixToIncludeScrollBehaviorTS = new ScrollBehaviorData();
const tempWebpackFixToIncludeCubeTS = new CubeComponentData();
const i = importMath;

export class Engine {

    private _canvas: HTMLCanvasElement;
    private _shader: Shader;
    private _previousTime: number = 0;

    private _camera: Camera;

    public constructor() {
        console.log('Engine created.');
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

    public start(): Engine {
        console.log('Engine started.');

        AssetManager.initialize();
        InputManager.initialize();
        LevelManager.initialize();

        this._canvas = GLUtilities.initialize();
        this.resize();

        gl.clearColor(152 / 255, 201 / 255, 244 / 255, 1);
        gl.enable(gl.DEPTH_TEST);

        // Load Shaders
        this._shader = new AdvancedShader();
        this._shader.use()

        // Load Camera
        this._camera = new Camera(this._shader);
        this._camera.initialize();

        // Load Materials
        MaterialManager.registerMaterial(new Material('ground', new Color(72, 207, 196)));
        MaterialManager.registerMaterial(new Material('point', new Color(7, 122, 116)));
        MaterialManager.registerMaterial(new Material('player', new Color(221, 100, 108)));

        // Load Sounds
        AudioManager.loadSoundFile('ding', '/assets/sounds/ding.wav');

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
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this._camera.render();

        LevelManager.render(this._shader);

        requestAnimationFrame(() => this.loop());
    }

}