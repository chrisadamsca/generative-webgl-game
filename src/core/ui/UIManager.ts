import { LevelManager } from "../world/LevelManager";

export class UIManager {

    private constructor() {}

    public static initialize() {
        document.getElementById('debug-btn').onclick = () => {
            LevelManager.startShowcase();
        }
    }

    public static updateLevel(level: number): void {
        document.getElementById('level-count').innerText = level.toString();
    }

    public static updateLifes(lifes: number): void {
        document.getElementById('life-count').innerText = lifes.toString();
    }

    public static updatePoints(collected: number, total: number): void {
        document.getElementById('points-count').innerText = collected.toString();
        document.getElementById('points-total').innerText = total.toString();
    }

}