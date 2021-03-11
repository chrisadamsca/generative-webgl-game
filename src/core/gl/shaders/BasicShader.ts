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
            in vec3 a_VertexNormal;


            uniform mat4 u_projection;
            uniform mat4 u_model;
            uniform mat4 u_normalMatrix;

            out vec2 v_texCoord;
            out vec3 v_Lighting;

            void main() {
                gl_Position = u_projection * u_model  * vec4(a_position, 1.0);
                v_texCoord = a_texCoord;

                vec3 ambientLight = vec3(0, 0, -10  );
                vec3 directionalLightColor = vec3(1, 0, 0);
                vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
          
                mat4 test = u_normalMatrix;

                vec4 transformedNormal = u_normalMatrix * vec4(a_VertexNormal, 1.0);

                float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
                v_Lighting = ambientLight + (directionalLightColor * directional);
            }
        `;
    }

    private getFragmentSource(): string {
        return glsl`#version 300 es
            precision mediump float;

            uniform vec4 u_tint;
            uniform sampler2D u_diffuse;

            in vec2 v_texCoord;
            in vec3 v_Lighting;

            out vec4 myOutputColor;

            void main() {
                myOutputColor = u_tint * vec4(v_Lighting, 1.0) * texture(u_diffuse, v_texCoord);
            }
        `;
    }
}