import { InputManager, Keys } from "../input/InputManager";
import { BaseBehavior } from "./BaseBehavior";
import { BehaviorManager } from "./BehaviorManager";
import { IBehavior } from "./IBehavior";
import { IBehaviorBuilder } from "./IBehaviorBuilder";
import { IBehaviorData } from "./IBehaviorData";

export class KeyboardMovementBehaviorData implements IBehaviorData {

    public name: string;
    public speed: number = -0.1;

    public setFromJSON(json: any): void {
        if (json.name === undefined) {
            throw new Error(`Name must be defined in BehaviorData.`)
        }

        this.name = String(json.name);

        if (json.speed !== undefined) {
            this.speed = Number(json.speed);
        }

    }

}

export class KeyboardMovementBehaviorBuilder implements IBehaviorBuilder {

    public get type(): string {
        return 'keyboardMovement';
    };

    public buildFromJSON(json: any): IBehavior {
        const data = new KeyboardMovementBehaviorData();
        data.setFromJSON(json);
        return new KeyboardMovementBehavior(data);
    }

}

export class KeyboardMovementBehavior extends BaseBehavior {

    public speed: number = 0.1;

    public constructor(data: KeyboardMovementBehaviorData) {
        super(data);
        this.speed = data.speed;
    }

    public update(time: number): void {
        if (InputManager.isKeyDown(Keys.LEFT) || InputManager.isKeyDown(Keys.A)) {
            this._owner.transform.position.z += this.speed;
            
        }
        
        if (InputManager.isKeyDown(Keys.RIGHT) || InputManager.isKeyDown(Keys.D)) {
            this._owner.transform.position.z -= this.speed;
        }
        
        if (InputManager.isKeyDown(Keys.UP) || InputManager.isKeyDown(Keys.W)) {
            this._owner.transform.position.x -= this.speed;
        }

        if (InputManager.isKeyDown(Keys.DOWN) || InputManager.isKeyDown(Keys.S)) {
            this._owner.transform.position.x += this.speed;
        }

        super.update(time);
    }

}

BehaviorManager.registerBuilder(new KeyboardMovementBehaviorBuilder());