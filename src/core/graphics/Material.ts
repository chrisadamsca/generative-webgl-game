import { Color } from "./Color";
import { Texture } from "./Texture";
import { TextureManager } from "./TextureManager";

export class Material {

    private _name: string;
    private _diffuseTextureName: string;

    private _diffuseTexture: Texture;
    private _tint: Color;

    public constructor(name: string, tint: Color, diffuseTextureName?: string) {
        this._name = name;
        this._tint = tint;
        this._diffuseTextureName = diffuseTextureName;

        if (this.diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }
    }

    public get name(): string {
        return this._name;
    }

    public get diffuseTextureName(): string {
        return this._diffuseTextureName;
    }

    public set diffuseTextureName(value: string) {
        if (this._diffuseTexture !== undefined) {
            TextureManager.releaseTexture(this.diffuseTextureName);
        }
        this._diffuseTextureName = value;

        if (this.diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }
    }

    public get diffuseTexture(): Texture {
        return this._diffuseTexture;
    }

    public get tint(): Color {
        return this._tint;
    }

    public destroy(): void {
        TextureManager.releaseTexture(this.diffuseTextureName);
        this._diffuseTexture = undefined;
    }

}