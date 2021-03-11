import { Shader } from "../Shader";

const glsl = x => x;

export class AdvancedShader extends Shader {

    public constructor() {
        super('advanced');
        this.load(this.getVertexSource(), this.getFragmentSource());
    }

    private getVertexSource(): string {
        return glsl`#version 300 es
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            uniform mat4 uNormalMatrix;
        
            in vec3 aVertexPosition;
            in vec3 aVertexNormal;
        
            out vec3 vNormal;
            out vec3 vEyeVector;
        
            void main(void) {
                vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
                // Set varyings to be used inside of fragment shader
                vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
                vEyeVector = -vec3(vertex.xyz);
                gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
            }
        `;
    }

    private getFragmentSource(): string {
        return glsl`#version 300 es
        precision mediump float;

        uniform vec4 uMaterialDiffuse;
    
        in vec3 vNormal;
        in vec3 vEyeVector;
    
        out vec4 fragColor;
    
        void main(void) {
            vec4 lightDiffuseColor = vec4(1, 1, 1, 1);
            vec4 lightSpecular = vec4(0, 0, 0, 1);
            vec4 materialAmbient = vec4(1, 1, 1, 1);
            vec4 materialSpecular = vec4(0, 0, 0, 1);
            vec4 lightAmbient = vec4(0.4, 0.4, 0.4, 1);
            float shininess = 1.0;

            // Normalized light direction
            vec3 lightDirection = vec3(0, 0, 0);
            vec3 L = normalize(lightDirection);
        
            // Normalized normal
            vec3 N = normalize(vNormal);
        
            float lambertTerm = dot(N, -L);
            // Ambient
            
            vec4 Ia = lightAmbient * materialAmbient;
            // Diffuse
            vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
            // Specular
            vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

            if (lambertTerm > 0.0) {
                Id = lightDiffuseColor * uMaterialDiffuse * lambertTerm;
                vec3 E = normalize(vEyeVector);
                vec3 R = reflect(L, N);
                float specular = pow( max(dot(R, E), 0.0), shininess);
                Is = lightSpecular * materialSpecular * specular;
            }
        
            // Final fargment color takes into account all light values that
            // were computed within the fragment shader
            fragColor = vec4(vec3(Ia + Id + Is), 1.0);
        }
        `;
    }
}