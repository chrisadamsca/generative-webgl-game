import { gl } from "./GLUtilities";

export class Shader {

    private _name: string;
    private _program: WebGLProgram

    public constructor(name: string, vertexSource: string, fragmentSource: string) {
        this._name = name;
        const vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

        this.createProgram(vertexShader, fragmentShader);
    }

    public get name(): string {
        return this._name;
    }

    public use(): void {
        gl.useProgram(this._program);
    }

    private loadShader(source: string, shaderType: number): WebGLShader {
        let shader: WebGLShader = gl.createShader(shaderType);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        const error = gl.getShaderInfoLog(shader);
        if (error !== "") {
            throw new Error(`Error compiling shader ${this.name}: ${error}`);
        }

        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        this._program = gl.createProgram();

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);

        let error = gl.getProgramInfoLog(this._program);
        if (error !== "") {
            throw new Error(`Error linking shader ${this.name}: ${error}`);
        }
    }

}