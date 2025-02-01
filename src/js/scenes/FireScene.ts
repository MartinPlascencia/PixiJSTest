import * as PIXI from 'pixi.js';
import FireParticles from '../helpers/FireParticles';
import { Scene } from '../helpers/Scene';

import assetsData from '../../assets/data/assets.json';

import sound from '../utilities/Sound';

export default class Fire extends Scene {
    private _app: PIXI.Application;
    private _fireContainer?: PIXI.Container;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
    }

    protected onInit(): void {

        this.preloadAssets();
    }

    private  preloadAssets(): void {
        const currentBundle = assetsData["gameAssets"];
        PIXI.Assets.addBundle("gameAssets",currentBundle.assets.sprites);
        PIXI.Assets.loadBundle("gameAssets", (progress) => {
            console.log('Loading progress:', progress);
        }).then(async (resources) => {
            console.log('Assets loaded:', resources);
            await this.loadSounds(currentBundle.assets.sounds);
            this.create();
        });
    }

    private async loadSounds(sounds: { [key: string]: string }): Promise<void> {
        await Promise.all(Object.entries(sounds).map(([key, url]) => sound.loadSound(key, url)));
        console.log('Sounds loaded');
    }   

    private create(): void {

        const blackOverlay = new PIXI.Graphics();
        blackOverlay.beginFill(0x000000);
        blackOverlay.drawRect(0, 0, this._app.screen.width, this._app.screen.height);
        blackOverlay.endFill();
        this._app.stage.addChild(blackOverlay);
        
        this._fireContainer = new FireParticles(10);
        this._fireContainer.position.set(this._app.screen.width * 0.5, this._app.screen.height * 0.5);
        this._app.stage.addChild(this._fireContainer);

        this._app.stage.interactive = true;
        this._app.stage.on('pointermove', (event: PIXI.FederatedPointerEvent) => {
            this._fireContainer?.position.set(event.global.x, event.global.y);
        });
    }
}