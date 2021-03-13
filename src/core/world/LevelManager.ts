import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/AssetManager";
import { JSONAsset, JSONAssetLoader } from "../assets/JSONAssetLoader";
import { Shader } from "../gl/Shader";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/Message";
import { Level } from "./Level";

export class LevelManager implements IMessageHandler {

    private static globalLevelId: number = 1;
    // private static _levels: {[id: number]: Level} = {};
    private static _registeredLevels: {[id: number]: string} = {};
    private static _activeLevel: Level;
    private static _inst: LevelManager;
    
    private constructor() {}

    public static initialize(): void {
        LevelManager._inst = new LevelManager();
        // TODO: TEMP
        LevelManager._registeredLevels[0] = '/assets/levels/testLevel.json';
    }

    public static changeLevel(id: number): void {
        if (LevelManager._activeLevel !== undefined) {
            LevelManager._activeLevel.onDeactivated();
            LevelManager._activeLevel.unload();
            LevelManager._activeLevel = undefined;
        }

        if (LevelManager._registeredLevels[id] === undefined) {
            throw new Error(`Level Id ${id} does not exist.`);
        } else {
            if (AssetManager.isAssetLoaded(LevelManager._registeredLevels[id])) {
                const asset = AssetManager.getAsset(LevelManager._registeredLevels[id]);
                LevelManager.loadLevel(asset);
            } else {
                Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + LevelManager._registeredLevels[id], LevelManager._inst);
                AssetManager.loadAsset(LevelManager._registeredLevels[id]);
            }
        }
    }

    public static update(time: number): void {
        if (LevelManager._activeLevel !== undefined) {
            LevelManager._activeLevel.update(time);
        }
    }

    public static render(shader: Shader): void {
        if (LevelManager._activeLevel !== undefined) {
            LevelManager._activeLevel.render(shader);
        }
    }

    public onMessage(message: Message): void {
        if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) !== -1) {
            const asset = message.context as JSONAsset;
            LevelManager.loadLevel(asset);
        }
    }

    private static loadLevel(asset: JSONAsset): void {
        const levelData = asset.data;
        let levelId: number;
        if (levelData.id === undefined) {
            throw new Error(`Level file format exception: Level Id not present.`);
        } else {
            levelId = Number(levelData.id);
        }

        let levelName: string;
        if (levelData.name === undefined) {
            throw new Error(`Level file format exception: Level name not present.`);
        } else {
            levelName = String(levelData.name);
        }
        let levelDescription: string;
        if (levelData.description !== undefined) {
            levelDescription = levelData.description;
        }

        LevelManager._activeLevel = new Level(levelId, levelName, levelDescription);
        LevelManager._activeLevel.initialize(levelData);
        LevelManager._activeLevel.onActivated();
        LevelManager._activeLevel.load();
    }
    
}