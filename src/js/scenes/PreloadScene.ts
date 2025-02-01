import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import BasicAnimations from '../helpers/BasicAnimations';
import CardsScene from './CardsScene';
import { Scene } from '../helpers/Scene';
import { sceneManager } from '../main';

import assetsData from '../../assets/data/assets.json';

import sound from '../utilities/Sound';

export default class PreloadScene extends Scene {

    private _app: PIXI.Application;
    private _loadingBar: PIXI.Graphics | undefined;
    private _loadingBarWidth: number = 200;
    constructor(app: PIXI.Application) {
        super();
        this._app = app;
    }

    protected onInit(): void {
        this._create();
    }

    private async _create(): Promise<void> {
        const background = new PIXI.Graphics().rect(0, 0, this._app.screen.width, this._app.screen.height).fill(0x33067a);
        this._app.stage.addChild(background);

        const title = new PIXI.Text('Loading...', {
            fontFamily: 'Impact',
            fontSize: 48,
            fill: 0xFFFFFF,
            align: 'center'
        });
        title.anchor.set(0.5);
        title.position.set(this._app.screen.width * 0.5, this._app.screen.height * 0.5);
        this._app.stage.addChild(title);
        gsap.to(title, { alpha: 0.5, duration: 1, repeat: -1, yoyo: true });

        const loadingBar = new PIXI.Graphics().rect(0, 0, this._loadingBarWidth, 50).fill(0xfad33c);
        loadingBar.position.set(this._app.screen.width * 0.5 - this._loadingBarWidth * 0.5, this._app.screen.height * 0.6);
        loadingBar.scale.x = 0;
        this._app.stage.addChild(loadingBar);


        this._preloadAssets("gameAssets", this._assetsReady.bind(this), (progress: number) => {
            loadingBar.scale.x = progress;
        });
    }

    private _preloadAssets(bundleName : keyof typeof assetsData, callback?: () => void, progressCallback?: (progress: number) => void): void {
        const currentBundle = assetsData[bundleName].assets;
        PIXI.Assets.addBundle(bundleName,currentBundle.sprites);
        PIXI.Assets.loadBundle(bundleName, (progress) => {
            if (progressCallback) {
                progressCallback(progress);
            }
        }).then(async (resources) => {
            await this._loadSounds(currentBundle.sounds);
            if (callback) {
                callback();
            }
        });
    }

    private async _loadSounds(sounds: { [key: string]: string }): Promise<void> {
        await Promise.all(Object.entries(sounds).map(([key, url]) => sound.loadSound(key, url)));
        console.log('Sounds loaded');
    }   

    private _assetsReady(): void {
        sceneManager.changeScene(new CardsScene(this._app));
    }
}