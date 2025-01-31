import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import BasicAnimations from '../helpers/BasicAnimations';
import { Scene } from '../helpers/Scene';

import assetsData from '../../assets/data/assets.json';

import sound from '../utilities/Sound';

export default class MainScene extends Scene {
    private _app: PIXI.Application;
    private _basicAnimations: BasicAnimations;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
        this._basicAnimations = new BasicAnimations();
    }

    protected onInit(): void {
        this.preloadAssets();
    }

    private preloadAssets(): void{
        return;
    }

    private loadSounds(sounds: { [key: string]: string }): void {
        for (const key in sounds) {
            sound.loadSound(key, sounds[key]);
        }
    }   

    private create(): void {

        const bitmapFontText = new PIXI.BitmapText({
            text: 'bitmap fonts are supported!\nWoo yay!',
            style: {
                fontFamily: 'grobold',
                fontSize: 25,
                align: 'center',
            },
        });
        bitmapFontText.x = this._app.screen.width / 2;
        bitmapFontText.y = 100;
        bitmapFontText.anchor.set(0.5);
        this._app.stage.addChild(bitmapFontText);

        const fish = new PIXI.Sprite(PIXI.Assets.get('gameAtlas').textures['brown_fish']);
        fish.x = 200;
        fish.y = 200;
        this._app.stage.addChild(fish);
        console.log('Fish loaded');

        const buttonContainer = new PIXI.Container();
        buttonContainer.x = this._app.screen.width / 2;
        buttonContainer.y = this._app.screen.height - 100;
        buttonContainer.eventMode = 'static';
        buttonContainer.cursor = 'pointer';
        this._app.stage.addChild(buttonContainer);

        const buttonImage = PIXI.Sprite.from(PIXI.Assets.get('gameAtlas').textures['button']);
        buttonImage.anchor.set(0.5);
        buttonContainer.addChild(buttonImage);

        const buttonText = new PIXI.Text('Click me!', {
            fill: 'white',
            fontSize: 24,
        });
        buttonText.y =-5;
        buttonText.anchor.set(0.5);
        buttonContainer.addChild(buttonText);

        buttonContainer.on('pointerdown', () => {
            sound.playSound('pop');
            this._basicAnimations.animateButton(buttonContainer, () => {
                console.log('Button clicked!');
            });
        });

        gsap.to(fish, { x: 600, duration: 2, ease: 'power2.inOut', repeat: -1, yoyo: true });

    }
}