import { SpriteComponent } from "../components/SpriteComponent";
import { GameObject } from "./GameObject";
import { Level } from "./Level";

export class TestLevel extends Level {

    private _parentObject: GameObject;
    private _parentSprite: SpriteComponent;
    private _testObject: GameObject;
    private _testSprite: SpriteComponent;


    public load(): void {
        this._parentObject = new GameObject(0, 'parentObject');
        this._parentSprite = new SpriteComponent('test2', 'test');
        this._parentObject.addComponent(this._parentSprite);

        this._parentObject.transform.position.x = 300;
        this._parentObject.transform.position.y = 300;

        this._testObject = new GameObject(1, 'testObject');
        this._testSprite = new SpriteComponent('test', 'test');
        this._testObject.addComponent(this._testSprite);

        this._testObject.transform.position.x = 100;
        this._testObject.transform.position.y = 100;

        this._parentObject.addChild(this._testObject);

        this.scene.addObject(this._parentObject);

        super.load()
    }

    public update(time: number): void {

        this._parentObject.transform.rotation.z += 0.01;
        this._testObject.transform.rotation.z += 0.01;
        // this._parentObject.transform.position.x += 1;
        
        super.update(time);
    }
    
}