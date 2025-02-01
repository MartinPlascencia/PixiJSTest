import * as PIXI from 'pixi.js';
import FireParticles from '../helpers/fire/FireParticles';
import { Scene } from '../helpers/Scene';
import Fps from '../helpers/Fps';
import TopGameMenu from '../helpers/TopGameMenu';

import sound from '../utilities/Sound';

export default class Fire extends Scene {
    private _app: PIXI.Application;
    private _fireContainer?: PIXI.Container;
    private _fireTitle?: PIXI.BitmapText;

    private _distanceFromMouse: number = 75;
    private _titleTextMinimumAlpha: number = 0.1;
    private _fpsCounter?: Fps;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
    }

    protected onInit(): void {

        this._create();
    }  

    private _create(): void {

        const background = new PIXI.Graphics().rect(0, 0, this._app.screen.width, this._app.screen.height).fill(0x000000);
        this._app.stage.addChild(background);
        
        const title = new PIXI.BitmapText('Fire Particles\nTest', {
            fontFamily: 'futuraPTBold',
            fontSize: 48,
            fill: 0xFFFFFF,
            align: 'center'
        });
        title.anchor.set(0.5);
        title.position.set(this._app.screen.width * 0.5, title.height);
        this._app.stage.addChild(title);
        this._fireTitle = title;

        this._fireContainer = new FireParticles(10);
        this._fireContainer.position.set(this._app.screen.width * 0.5, this._app.screen.height * 0.5);
        this._app.stage.addChild(this._fireContainer);


        sound.playSound('fire_sound', true, 0.2);
        this._followMouse();
        this._createFPSCounter();
        this._createTopGameMenu();
        //this._addEffects();
    }

    private _followMouse(): void {
        this._app.stage.interactive = true;
        this._app.stage.on('pointermove', (event: PIXI.FederatedPointerEvent) => {
            this._fireContainer?.position.set(event.global.x, event.global.y);
            this._checkFirePosition(event.global.x, event.global.y);
        });
    }

    private _checkFirePosition(pointerX : number, pointerY : number): void {
        if (this._fireTitle &&  (Math.abs(this._fireTitle.x - pointerX) < this._distanceFromMouse) && 
            (Math.abs(this._fireTitle.y - pointerY) < this._distanceFromMouse) && this._fireTitle.alpha > this._titleTextMinimumAlpha) {
            this._fireTitle.alpha -= 0.005;
        }
    }

    private _createFPSCounter(): void {
        this._fpsCounter = new Fps(this._app, '', 'futuraPTBold', 24);
    }

    public onDestroy(): void {
        sound.stopAllSounds();
        this._fpsCounter?.removeUpdateListener();
    }

    private _createTopGameMenu(): void {
        const topGameMenu = new TopGameMenu(this._app);
        this._app.stage.addChild(topGameMenu);
    }
}