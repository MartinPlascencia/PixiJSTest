import * as PIXI from "pixi.js";

export abstract class Scene extends PIXI.Container {
    private initialized: boolean = false;

    constructor() {
        super();
    }

    init(): void {
        if (!this.initialized) {
            this.initialized = true;
            this.onInit();
        }
    }

    protected abstract onInit(): void;
    onDestroy(): void {}

    update(delta: number): void {}

    destroyScene(): void {
        this.removeAllListeners();
        this.destroy({ children: true });
        this.onDestroy();
    }
}
