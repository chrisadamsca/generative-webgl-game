import { Shader } from "../gl/Shader";
import { ILevelDifficulty } from "./ILevelDifficulty";
import { Level } from "./Level";

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
            speed: 0.075,
            pointsToCollect: 8,
            mapX: 10,
            mapZ: 6
        };
    }

    public static reset(): void {
        LevelManager._difficulty = {
            speed: 0.075,
            pointsToCollect: 8,
            mapX: 10,
            mapZ: 6
        };
        this._globalLevelId = 1;
        this.changeLevel();
    }

    public static changeLevel(): void {
        if (LevelManager._activeLevel !== undefined) {
            LevelManager._activeLevel.onDeactivated();
            LevelManager._activeLevel.unload();
            LevelManager._activeLevel = undefined;
        }
        LevelManager.updateDifficulty();
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
       switch (LevelManager._globalLevelId) {
           case 2:
               LevelManager._difficulty = {
                speed: 0.1,
                pointsToCollect: 12,
                mapX: 16,
                mapZ: 10
            };
               break;
           case 3:
               LevelManager._difficulty = {
                speed: 0.11,
                pointsToCollect: 18,
                mapX: 20,
                mapZ: 12
            };
               break;
       }
    }

    private static loadLevel(): void {
        const levelId: number = LevelManager._globalLevelId++

        LevelManager._activeLevel = new Level(levelId, this._difficulty);
        LevelManager._activeLevel.initialize();
        LevelManager._activeLevel.onActivated();
        LevelManager._activeLevel.load();
    }
    
}