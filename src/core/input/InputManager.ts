import { Vector2 } from "../math/Vector2";
import { Message } from "../message/Message";

export enum Keys {
    LEFT = 'ArrowLeft',
    UP = 'ArrowUp',
    RIGHT = 'ArrowRight',
    DOWN = 'ArrowDown',
}

export class MouseContext {
    public leftDown: boolean;
    public rightDown: boolean;
    public position: Vector2;

    public constructor(leftDown: boolean, rightDown: boolean, position: Vector2) {
        this.leftDown = leftDown;
        this.rightDown = rightDown;
        this.position = position;
    }

}

export class InputManager {

    private static _keys: boolean[] = [];
    private static _prevMouseX: number;
    private static _prevMouseY: number;
    private static _mouseX: number;
    private static _mouseY: number;
    private static _leftDown: boolean = false;
    private static _rightDown: boolean = false;


    public static initialize(): void {
        for (let i = 0; i < 255; i++) {
            InputManager._keys[i] = false;
            
        }

        window.addEventListener('keydown', InputManager.onKeyDown);
        window.addEventListener('keyup', InputManager.onKeyUp);
        window.addEventListener('mousemove', InputManager.onMouseMove);
        window.addEventListener('mousedown', InputManager.onMouseDown);
        window.addEventListener('mouseup', InputManager.onMouseUp);
    }

    public static isKeyDown(key: Keys): boolean {
        return InputManager._keys[key];
    }

    // Todo: only use numbers later on to improve speed
    public static getMousePosition(): Vector2 {
        return new Vector2(this._mouseX, this._mouseY);
    }

    private static onKeyDown(event: KeyboardEvent): boolean {
        InputManager._keys[event.code] = true;
        Message.send('KEY_DOWN', InputManager._keys[event.code]);
        return true;
        // event.preventDefault();
        // event.stopPropagation();
        // return false;
    }

    private static onKeyUp(event: KeyboardEvent): boolean {
        InputManager._keys[event.code] = false;
        return true
        // event.preventDefault();
        // event.stopPropagation();
        // return false;
    }

    private static onMouseMove(event: MouseEvent): void {
        InputManager._prevMouseX = InputManager._mouseX;
        InputManager._prevMouseY = InputManager._mouseY;

        InputManager._mouseX = event.clientX;
        InputManager._mouseY = event.clientY;
    }

    private static onMouseDown(event: MouseEvent): void {
        if (event.button === 0) {
            this._leftDown = true;
        } else if (event.button === 2) {
            this._rightDown = true;
        }

        Message.send('MOUSE_DOWN', this, new MouseContext(InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosition()))
    }

    private static onMouseUp(event: MouseEvent): void {
        if (event.button === 0) {
            this._leftDown = false;
        } else if (event.button === 2) {
            this._rightDown = false;
        }

        Message.send('MOUSE_UP', this, new MouseContext(InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosition()))
    }

}