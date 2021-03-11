export var gl: WebGL2RenderingContext;

export class GLUtilities {

    public static initialize(elementId?: string): HTMLCanvasElement {
        let canvas: HTMLCanvasElement;
        
        if (elementId) {
            canvas = document.getElementById(elementId) as HTMLCanvasElement;
            if (!canvas) {
                throw new Error('Cannot find a canvas element with id: ' + elementId);
            }
        } else {
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            document.body.appendChild(canvas);
        }

        gl = canvas.getContext('webgl2');
        if (!gl) {
            throw new Error('Unable to initialize WebGL context.');
        }

        return canvas;
    }

}