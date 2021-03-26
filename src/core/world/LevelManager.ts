import { Shader } from "../gl/Shader";
import { DIFFICULTY_UPDATED, Message } from "../message/Message";
import { UIManager } from "../ui/UIManager";
import { ILevelDifficulty } from "./ILevelDifficulty";
import { Level } from "./Level";

const START_SPEED = 0.075;
const SPEED_INCREMENT = 0.001;

const START_WIDTH = 6;
const START_DEPTH = 4;
const WIDTH_INCREMENT = 4;
const DEPTH_INCREMENT = 2;

const START_PTC = 1;
const PTC_INCREMENT = 2;

const EVERY_NTH_LEVEL = 5;

export class LevelManager {

    private static _globalLevelId: number = 1;
    private static _activeLevel: Level;
    private static _inst: LevelManager;

    private static _difficulty: ILevelDifficulty;
    
    private constructor() {}

    public static get activeLevel(): Level {
        return LevelManager._activeLevel;
    }

    public static initialize(): void {
        LevelManager._inst = new LevelManager();
        LevelManager._difficulty = {
            speed: START_SPEED,
            pointsToCollect: START_PTC,
            mapX: START_WIDTH,
            mapZ: START_DEPTH
        };
    }

    public static reset(): void {
        LevelManager._difficulty = {
            speed: START_SPEED,
            pointsToCollect: START_PTC,
            mapX: START_WIDTH,
            mapZ: START_DEPTH
        };
        this._globalLevelId = 1;
        this.changeLevel();
    }

    public static changeLevel(first: boolean = false): void {
        if (!first) {
            if (LevelManager._activeLevel !== undefined) {
                LevelManager._activeLevel.onDeactivated();
                LevelManager._activeLevel.unload();
                LevelManager._activeLevel = undefined;
            }
        }
        LevelManager.loadLevel();
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

    private static updateDifficulty(): void {
        Message.send(DIFFICULTY_UPDATED, this._inst, LevelManager._difficulty);
        const updatedSpeed = LevelManager._difficulty.speed + SPEED_INCREMENT;
        const updatedPTC = LevelManager._difficulty.pointsToCollect + PTC_INCREMENT;
        const updatedMapX = this.majorDifficultyChange() ? LevelManager._difficulty.mapX + WIDTH_INCREMENT : LevelManager._difficulty.mapX;
        const updatedMapZ = this.majorDifficultyChange() ? LevelManager._difficulty.mapZ + DEPTH_INCREMENT : LevelManager._difficulty.mapZ;
        LevelManager._difficulty = {
            speed: updatedSpeed,
            pointsToCollect: updatedPTC,
            mapX: updatedMapX,
            mapZ: updatedMapZ
        };
    }

    private static majorDifficultyChange(): boolean {
        return LevelManager._globalLevelId % EVERY_NTH_LEVEL === 0;
    }

    private static loadLevel(): void {
        LevelManager._activeLevel = new Level(LevelManager._globalLevelId, LevelManager._difficulty);
        LevelManager._activeLevel.initialize();
        LevelManager._activeLevel.onActivated();
        LevelManager._activeLevel.load();
        UIManager.updateLevel(this._globalLevelId);
        LevelManager._globalLevelId++
        LevelManager.updateDifficulty();
    }
    
}