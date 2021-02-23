import { Shader } from "../gl/Shader";
import { Level } from "./Level";
import { TestLevel } from "./TestLevel";

export class LevelManager {

    private static globalLevelId: number = 1;
    private static _levels: {[id: number]: Level} = {};
    private static _activeLevel: Level;
    
    private constructor() {}

    public static createLevel(name: string, description: string): number {
        LevelManager.globalLevelId++;
        const level = new Level(LevelManager.globalLevelId, name, description);
        LevelManager._levels[LevelManager.globalLevelId] = level;
        return LevelManager.globalLevelId;
    }

    // TODO: Just temporory, delete in future
    public static createTestLevel(): number {
        LevelManager.globalLevelId++;
        const level = new TestLevel(LevelManager.globalLevelId, 'Test', 'A simple test level');
        LevelManager._levels[LevelManager.globalLevelId] = level;
        return LevelManager.globalLevelId;
    }

    public static changeLevel(id: number): void {
        if (LevelManager._activeLevel !== undefined) {
            LevelManager._activeLevel.onDeactivated();
            LevelManager._activeLevel.unload();
        }

        if (LevelManager._levels[id] !== undefined) {
            LevelManager._activeLevel = LevelManager._levels[id];
            LevelManager._activeLevel.onActivated();
            LevelManager._activeLevel.load();
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

}