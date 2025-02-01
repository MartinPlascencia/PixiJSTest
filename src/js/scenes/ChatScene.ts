import * as PIXI from 'pixi.js';
import BasicAnimations from '../helpers/BasicAnimations';
import IconsManager from '../helpers/chat/IconsManager';
import ChatManager from '../helpers/chat/ChatManager';
import TopGameMenu from '../helpers/TopGameMenu';
import { Scene } from '../helpers/Scene';
import Fps from '../helpers/Fps';

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
            this._create();
        });
    } 

    private _create(): void {

        const background = new PIXI.Graphics().rect(0, 0, this._app.screen.width, this._app.screen.height).fill(0x1099bb);
        this._app.stage.addChild(background);

        const chatManager = new ChatManager(this._app);
        chatManager.y = this._app.screen.height - 100;
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