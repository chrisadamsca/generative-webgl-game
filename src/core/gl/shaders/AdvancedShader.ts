import { Shader } from "../Shader";

const glsl = x => x;

export class AdvancedShader extends Shader {

    public constructor() {
        super('advanced');
        this.load(this.getVertexSource(), this.getFragmentSource());
    }

    private getVertexSource(): string {
        return glsl`#version 300 es
            precision mediump float;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            uniform mat4 uNormalMatrix;
            uniform vec3 uLightDirection;
            uniform vec3 uLightDiffuse;
            uniform vec3 uMaterialDiffuse;
            uniform float uMaterialAlpha;
            
            in vec3 aVertexPosition;
            in vec3 aVertexNormal;
        
            out vec4 vVertexColor;
        
            void main(void) {
                // Calculate the normal vector
                vec3 N = normalize(vec3(uNormalMatrix * vec4(aVertexNormal, 1.0)));
            
                // Normalized light direction
                vec3 L = normalize(uLightDirection);
            
                // Dot product of the normal product and negative light direction vector
                float lambertTerm = dot(N, -L);
            
                // Calculating the diffuse color based on the Lambertian reflection model
                vec3 Id = uMaterialDiffuse * uLightDiffuse * lambertTerm;
                // vec3 Id = uMaterialDiffuse * uLightDiffuse;
            
                // // Set the varying to be used inside of the fragment shader
                vVertexColor = vec4(Id, uMaterialAlpha);
    
                // Setting the vertex position
                gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
            }
        `;
    }

    private getFragmentSource(): string {
        return glsl`#version 300 es
            precision mediump float;

            // Expect the interpolated value fro, the vertex shader
            in vec4 vVertexColor;
        
            // Return the final color as fragColor
            out vec4 fragColor;
        
            void main(void)  {
                // Simply set the value passed in from the vertex shader
                fragColor = vVertexColor * vec4(1, 1, 1, 1);
            }
        `;
    }
}