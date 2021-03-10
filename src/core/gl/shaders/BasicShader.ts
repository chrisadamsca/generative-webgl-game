import { Shader } from "../Shader";

const glsl = x => x;

export class BasicShader extends Shader {

    public constructor() {
        super('basic');
        this.load(this.getVertexSource(), this.getFragmentSource());
    }

    private getVertexSource(): string {
        return glsl`#version 300 es
            in vec3 a_position;
            in vec2 a_texCoord;

            uniform mat4 u_projection;
            uniform mat4 u_model;

            out vec2 v_texCoord;

            void main() {
                gl_Position = u_projection * u_model  * vec4(a_position, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
    }

    private getFragmentSource(): string {
        return glsl`#version 300 es
            precision mediump float;

            uniform vec4 u_tint;
            uniform sampler2D u_diffuse;

            in vec2 v_texCoord;

            out vec4 myOutputColor;

            void main() {
                myOutputColor = u_tint * texture(u_diffuse, v_texCoord);
            }
        `;
    }
}