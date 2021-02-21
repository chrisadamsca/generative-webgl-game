import { gl, GLUtilities } from "./GLUtilities";

export class Engine {

    private _canvas: HTMLCanvasElement;

    public constructor() {
        console.log('Engine created.');   
    }

    public start(): Engine {
        console.log('Engine started.');
        
        this._canvas = GLUtilities.initialize();

        gl.clearColor(0, 0, 1, 1);

        this.loop();
        return this;
    }

    private loop(): void {
        gl.clear(gl.COLOR_BUFFER_BIT); // ??? What is this? Resetting everything, but how?

        requestAnimationFrame(() => {
            
            this.loop();
        });
    }

}