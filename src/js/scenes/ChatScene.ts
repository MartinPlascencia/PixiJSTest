import * as PIXI from 'pixi.js';
import BasicAnimations from '../helpers/BasicAnimations';
import IconsManager from '../helpers/IconsManager';
import { Scene } from '../helpers/Scene';

import assetsData from '../../assets/data/assets.json';

import sound from '../utilities/Sound';
import LoadJSON from '../helpers/LoadJSON';

export default class PreloadScene extends Scene {
    private _app: PIXI.Application;
    private _basicAnimations: BasicAnimations;
    private _chatData?: JSON;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
        this._basicAnimations = new BasicAnimations();
    }

    protected onInit(): void {

        const loadJson = new LoadJSON();
        loadJson.loadJson('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords').then(async (data) => {

            this._chatData = data;
            const iconsManager =  new IconsManager();
            await iconsManager.saveIconsToCache(data)
            this.preloadAssets();
        });
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

        

    }
}