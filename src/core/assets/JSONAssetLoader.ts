import { AssetManager } from "./AssetManager";
import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";

export class JSONAsset implements IAsset { 
    public readonly name: string;
    public readonly data: any;

    public constructor(name: string, data: JSON) {
        this.name = name;
        this.data = data;
    }
}

export class JSONAssetLoader implements IAssetLoader {

    public get supportedExtensions(): string[] {
        return ['json'];
    }

    public async loadAsset(assetName: string): Promise<void> {
        const response = await fetch(assetName);
        this.onJSONLoaded(assetName, response);
    }

    private async onJSONLoaded(assetName: string, response: Response): Promise<void> {
        const json: JSON = await response.json();
        const asset = new JSONAsset(assetName, json);
        AssetManager.onAssetLoaded(asset);
    }
}