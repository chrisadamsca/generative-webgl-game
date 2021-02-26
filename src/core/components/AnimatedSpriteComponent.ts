import { Shader } from "../gl/Shader";
import { AnimatedSprite } from "../graphics/AnimatedSprite";
import { Sprite } from "../graphics/Sprite";
import { Vector3 } from "../math/Vector3";
import { BaseComponent } from "./BaseComponent";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";
import { SpriteComponentData } from "./SpriteComponent";

export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData {

    public frameWidth: number;
    public frameHeight: number;
    public frameCount: number;
    public frameSequence: number[] = [];
    public autoplay: boolean = true;

    public setFromJSON(json: any): void {
        super.setFromJSON(json);

        if (json.autoplay !== undefined) {
            this.autoplay = Boolean(json.autoplay);
        }

        if (json.frameWidth === undefined) {
            throw new Error(`AnimatedSpriteComponentData requires 'frameWidth' to be defined.`);
        } else {
            this.frameWidth = Number(json.frameWidth);
        }

        if (json.frameHeight === undefined) {
            throw new Error(`AnimatedSpriteComponentData requires 'frameHeight' to be defined.`);
        } else {
            this.frameHeight = Number(json.frameHeight);
        }

        if (json.frameCount === undefined) {
            throw new Error(`AnimatedSpriteComponentData requires 'frameCount' to be defined.`);
        } else {
            this.frameCount = Number(json.frameCount);
        }

        if (json.frameSequence === undefined) {
            throw new Error(`AnimatedSpriteComponentData requires 'frameSequence' to be defined.`);
        } else {
            this.frameSequence = json.frameSequence;
        }

    }
    
}

export class AnimatedSpriteComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return 'animatedSprite';
    };

    public buildFromJSON(json: any): IComponent {
        const data = new AnimatedSpriteComponentData();
        data.setFromJSON(json);
        return new AnimatedSpriteComponent(data);
    }

}


ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder());

export class AnimatedSpriteComponent extends BaseComponent {
    
    private _autoplay: boolean;
    private _sprite: AnimatedSprite;

    public constructor(data: AnimatedSpriteComponentData) {
        super(data);

        this._autoplay = data.autoplay;
        this._sprite = new AnimatedSprite(data.name, data.materialName, data.frameWidth, data.frameHeight, data.frameWidth, data.frameHeight, data.frameCount, data.frameSequence);

        if (!data.origin.equals(Vector3.zero)) {
            this._sprite.origin.copyFrom(data.origin);
        }

    }

    public isPlaying(): boolean {
        return this._sprite.isPlaying;
    }

    public updateReady(): void {
        if (!this._autoplay) {
            this._sprite.stop();
        }
    }

    public load(): void {
        this._sprite.load();

    }

    public update(time: number): void {
        this._sprite.update(time);
        
        super.update(time);
    }

    public render(shader: Shader): void {
        this._sprite.draw(shader, this.owner.worldMatrix);
        super.render(shader);
    }

    public play(): void {
        this._sprite.play()
    }

    public stop(): void {
        this._sprite.stop()
    }

    public setFrame(frameNumber: number): void {
        this._sprite.setFrame(frameNumber);
    }

}