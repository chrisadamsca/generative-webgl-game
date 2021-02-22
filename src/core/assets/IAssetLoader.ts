import { IAsset } from "./IAsset";

export interface IAssetLoader {
    readonly supportedExtensions: string[];

    loadAsset(assetName: string): void;
}