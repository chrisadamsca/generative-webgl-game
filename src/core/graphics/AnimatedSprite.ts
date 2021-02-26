import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/AssetManager";
import { ImageAsset } from "../assets/ImageAssetLoader";
import { Vector2 } from "../math/Vector2";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/Message";
import { MaterialManager } from "./MaterialManager";
import { Sprite } from "./Sprite";
import { Vertex } from "./Vertex";

class UVInfo {

    public min: Vector2;
    public max: Vector2;

    public constructor(min: Vector2, max: Vector2) {
        this.min = min;
        this.max = max;
    }

}

export class AnimatedSprite extends Sprite implements IMessageHandler {

    private _frameWidth: number;
    private _frameHeight: number;
    private _frameCount: number;
    private _frameSequence: number[];

    private _frameTime: number = 333;
    private _frameUVs: UVInfo[] = [];

    private _currentFrame: number = 0;
    private _currentTime: number = 0;
    private _assetLoaded: boolean = false;
    private _assetWidth: number = 2;
    private _assetHeight: number = 2;
    private _isPlaying: boolean = true;


    public constructor(name: string, materialName: string, width: number = 100, height: number = 100, frameWidth: number = 10, frameHeight: number = 10, frameCount: number = 1, frameSequence: number[] = []) {
        super(name, materialName, width, height);

        this._frameWidth = frameWidth;
        this._frameHeight = frameHeight;
        this._frameCount = frameCount;
        this._frameSequence = frameSequence;

        Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._material.diffuseTextureName, this);
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }
    
    public destroy(): void {
        super.destroy();
    }

    public play(): void {
        this._isPlaying = true;
    }

    public stop(): void {
        this._isPlaying = false;
    }

    public setFrame(frameNumber: number): void {
        if (frameNumber >= this._frameCount) {
            throw new Error(`Framenumber ${frameNumber} is out of range (${this._frameCount})`);
        }

        this._currentFrame = frameNumber;
    }

    public onMessage(message: Message): void {
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._material.diffuseTextureName) {
            const asset = message.context as ImageAsset;
            this._assetLoaded = true;
            this._assetWidth = asset.width;
            this._assetHeight = asset.height;
            this._calculateUVs();
        }
    }

    public load(): void {
        super.load();

        if(!this._assetLoaded) {
            this.setupFromMaterial();
        }
    }

    public update(time: number): void {

        if (!this._assetLoaded) {
            this.setupFromMaterial();
            return
        };

        if (!this._isPlaying) {
            return;
        }

        this._currentTime += time;
        if (this._currentTime > this._frameTime) {
            this._currentFrame++;
            this._currentTime = 0;

            if (this._currentFrame >= this._frameSequence.length) {
                this._currentFrame = 0;
            }

            const frameUVs = this._frameSequence[this._currentFrame];
            this._vertices[0].texCoords.copyFrom(this._frameUVs[frameUVs].min);
            this._vertices[1].texCoords = new Vector2(this._frameUVs[frameUVs].min.x, this._frameUVs[frameUVs].max.y);
            this._vertices[2].texCoords.copyFrom(this._frameUVs[frameUVs].max);
            this._vertices[3].texCoords.copyFrom(this._frameUVs[frameUVs].max);
            this._vertices[4].texCoords = new Vector2(this._frameUVs[frameUVs].max.x, this._frameUVs[frameUVs].min.y);
            this._vertices[5].texCoords.copyFrom(this._frameUVs[frameUVs].min);

            this._buffer.clearData();
            for (const vertex of this._vertices) {
                this._buffer.pushBackData(vertex.toArray());
            }
            this._buffer.upload();
            this._buffer.unbind();
        }
        
        super.update(time);
    }

    private _calculateUVs(): void {
        let totalWidth: number = 0;
        let yValue: number = 0;
        for (let i = 0; i < this._frameCount; i++) {

            totalWidth += i * this._frameWidth;
            if (totalWidth > this._assetWidth) {
                yValue++
                totalWidth = 0;
            };

            const uMin = (i * this._frameWidth) / this._assetWidth;
            const vMin = (yValue * this._frameHeight) / this._assetHeight;
            const uMax = ((i * this._frameWidth) + this._frameWidth ) / this._assetWidth;
            const vMax = ((yValue * this._frameHeight) + this._frameHeight ) / this._assetHeight;


            const min: Vector2 = new Vector2(uMin, vMin);
            const max: Vector2 = new Vector2(uMax, vMax);
            this._frameUVs.push(new UVInfo(min, max));
        }
    }

    private setupFromMaterial(): void {
        if (!this._assetLoaded) {
            const material = MaterialManager.getMaterial(this._materialName);
            if (material.diffuseTexture.isLoaded) {
                if (AssetManager.isAssetLoaded(material.diffuseTextureName)) {
                    this._assetWidth = material.diffuseTexture.width;
                    this._assetHeight = material.diffuseTexture.height;
                    this._assetLoaded = true;
                    this._calculateUVs();
                }
            }
        }
    }

}