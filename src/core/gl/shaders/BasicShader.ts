import { Shader } from "../Shader";

const glsl = x => x;

export class BasicShader extends Shader {

    public constructor() {
        super('basic');
        this.load(this.getVertexSource(), this.getFragmentSource());
    }

    private getVertexSource(): string {
        return glsl`#version 300 es

            in vec3 aVertexPosition;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;


            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix  * vec4(aVertexPosition, 1.0);
            }
        `;
    }

    private getFragmentSource(): string {
        return glsl`#version 300 es
            precision mediump float;

            out vec4 fragColor;

            void main() {
                fragColor = vec4(1, 1, 0, 1);
            }
        `;
    }
}