import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import BasicAnimations from './BasicAnimations';
import { sceneManager } from '../main';
import FireScene from '../scenes/FireScene';
import ChatScene from '../scenes/ChatScene';
import CardsScene from '../scenes/CardsScene';

import sound from '../utilities/Sound';

export default class TopGameMenu extends PIXI.Container {

    private _basicAnimations: BasicAnimations;
    private _app: PIXI.Application;
    private _arrowButton?: PIXI.Sprite;

    private _menuHeight: number = 200;
    private _buttonTags: string[] = ['Cards', 'Chat', 'Fire'];
    private _menuOpened: boolean = false;
    private _openPosition: number = 0;
    private _closePosition: number = -this._menuHeight;
    private _buttonsOffset: number = 200;
    private _buttonList : PIXI.Container[] = [];


    constructor(app: PIXI.Application) {
        super();
        this._basicAnimations = new BasicAnimations();
        this._app = app;
        this._createMenu();
    }

    private _createMenu(): void {   

        const background = new PIXI.Graphics().rect(0, -this._menuHeight, this._app.screen.width, this._menuHeight * 2).fill(0x000000);
        background.alpha = 0.5;
        this.addChild(background);

        const menuLine = new PIXI.Graphics().rect(0, this._menuHeight - this._menuHeight * 0.05, this._app.screen.width, this._menuHeight * 0.05).fill(0x1099bb);
        this.addChild(menuLine);

        const arrowButton = new PIXI.Sprite(PIXI.Assets.get('gameAtlas').textures['arrow']);
        arrowButton.anchor.set(0.5);
        arrowButton.position.set(background.width * 0.5, background.height * 0.5 + arrowButton.height * 0.1);
        arrowButton.eventMode = 'static';
        arrowButton.cursor = 'pointer';
        arrowButton.scale.set(0.6);
        this.addChild(arrowButton);
        this._buttonList.push(arrowButton);
        this._arrowButton = arrowButton;

        arrowButton.on('pointerdown', () => {
            arrowButton.eventMode = 'none';
            sound.playSound('click');
            this._basicAnimations.animateButton(arrowButton, () => {
                this._menuOpened = !this._menuOpened;
                this._menuOpened ? this._openMenu() : this._closeMenu();
            })
        });

        let buttonsPivot = this._app.screen.width * 0.5 - this._buttonsOffset;
        this._buttonTags.forEach((tag, index) => {
            const buttonContainer = new PIXI.Container();
            buttonContainer.position.set(buttonsPivot, 100);
            this.addChild(buttonContainer);
            buttonsPivot += this._buttonsOffset;
            buttonContainer.eventMode = 'static';
            buttonContainer.cursor = 'pointer';
            buttonContainer.on('pointerdown', () => {
                this._deactivateButtons();
                sound.playSound('pop');
                this._basicAnimations.animateButton(buttonContainer, () => {
                    this._pressedSceneButton(tag);
                });
            });

            const button = new PIXI.Sprite(PIXI.Assets.get('gameAtlas').textures['button']);
            button.scale.set(0.7, 1);
            button.anchor.set(0.5);
            buttonContainer.addChild(button);

            const buttonText = new PIXI.BitmapText(tag + '\nTest', {
                fontFamily: 'futuraPTBold',
                fontSize: 20,
                fill: 0xffffff,
                align: 'center'
            });
            buttonText.anchor.set(0.5);
            buttonContainer.addChild(buttonText);
            this._buttonList.push(buttonContainer);
        });

        this._startMenu();
    }

    private _activateButtons(): void {
        this._buttonList.forEach(button => {
            button.eventMode = 'static';
        });
    }

    private _deactivateButtons(): void {
        this._buttonList.forEach(button => {
            button.eventMode = 'none';
        });
    }

    private _openMenu(): void {
        gsap.to(this, {
            y: this._openPosition,
            ease: 'back.out',
            onComplete: () => {
                this._activateButtons();
            }
        });
    }

    private _closeMenu(): void {
        this._deactivateButtons();
        gsap.to(this, {
            y: this._closePosition,
            ease: 'back.in',
            onComplete: () => {
                if (this._arrowButton) {
                    this._arrowButton.eventMode = 'static';
                }
            }
        });
    }

    private _pressedSceneButton(tag: string): void {
        switch (tag) {
            case 'Cards':
                sceneManager.changeScene(new CardsScene(this._app));
                break;
            case 'Chat':
                sceneManager.changeScene(new ChatScene(this._app));
                break;
            case 'Fire':
                sceneManager.changeScene(new FireScene(this._app));
                break;
        }
    }

    private _startMenu() : void {
        this.position.set(0, -this._menuHeight);
        this._deactivateButtons();
        if (this._arrowButton) {
            this._arrowButton.eventMode = 'static';
            this._basicAnimations.popObject(this._arrowButton);
        }

    }
}