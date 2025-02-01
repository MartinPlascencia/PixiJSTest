import * as PIXI from 'pixi.js';
import BasicAnimations from '../helpers/BasicAnimations';
import IconsManager from '../helpers/IconsManager';
import ChatManager from '../helpers/ChatManager';
import TopGameMenu from '../helpers/TopGameMenu';
import { Scene } from '../helpers/Scene';
import Fps from '../helpers/Fps';

import assetsData from '../../assets/data/assets.json';

import sound from '../utilities/Sound';
import LoadJSON from '../helpers/LoadJSON';

export default class ChatScene extends Scene {
    private _app: PIXI.Application;
    private _basicAnimations: BasicAnimations;
    private _chatData?: JSON;
    private _fpsCounter?: Fps;
    private _chatManager?: ChatManager;

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

        const background = new PIXI.Graphics().rect(0, 0, this._app.screen.width, this._app.screen.height).fill(0x1099bb);
        this._app.stage.addChild(background);

        const chatManager = new ChatManager(this._app);
        chatManager.y = this._app.screen.height * 0.8;
        this._app.stage.addChild(chatManager);
        this._chatManager = chatManager;

        chatManager.showDialogs(this._chatData);
        this._createFpsCounter();
        
        sound.playSound('bbt_song', true,0.2);
        this._createTopGameMenu();
    }

    private _createFpsCounter(): void {
        this._fpsCounter = new Fps(this._app,'');
    }

    public onDestroy(): void {
        sound.stopAllSounds();
        this._fpsCounter?.removeUpdateListener();
        this._chatManager?.stopDialogs();
    }

    private _createTopGameMenu(): void {
        const topGameMenu = new TopGameMenu(this._app);
        this._app.stage.addChild(topGameMenu);
    }
}