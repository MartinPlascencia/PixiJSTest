import * as PIXI from 'pixi.js';
import { Scene } from './Scene';

export class SceneManager {
    private _app: PIXI.Application;
    private currentScene: Scene | null = null;

    constructor(app: PIXI.Application) {
        this._app = app;
    }

    changeScene(newScene: Scene): void {
        if (this.currentScene) {
            this._app.stage.removeChild(this.currentScene);
            this.currentScene.destroyScene();
        }

        this.currentScene = newScene;
        this.currentScene.init();
        this._app.stage.addChild(this.currentScene);
    }

    update(delta: number): void {
        if (this.currentScene) {
            this.currentScene.update(delta);
        }
    }
}
