import * as PIXI from 'pixi.js';
import BasicAnimations from '../helpers/BasicAnimations';
import CardDeck from '../helpers/cards/CardDeck';
import CardsDeckManager from '../helpers/cards/CardsDeckManager';
import Fps from '../helpers/Fps';
import TopGameMenu from '../helpers/TopGameMenu';
import { Scene } from '../helpers/Scene';

import gameConfig from '../../assets/data/ace_of_shadows_config.json';

import sound from '../utilities/Sound';

export default class CardsScene extends Scene {

    private _app: PIXI.Application;
    private _fpsCounter?: Fps;
    private _cardsDeckManager?: CardsDeckManager;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
    }

    protected onInit(): void {
        console.log('initializing cards scene');
        this._create();
    }

    private _create(): void {

        console.log('creating cards scene');
        sound.playSound('walking_jazz', true,0.5);
        
        const cardsBackground = new PIXI.Sprite(PIXI.Assets.get('backgroundBlue'));
        cardsBackground.anchor.set(0.5);
        cardsBackground.angle = 90;
        cardsBackground.x = this._app.screen.width / 2;
        cardsBackground.y = this._app.screen.height / 2;
        this._app.stage.addChild(cardsBackground);
        
        const bitmapFontText = new PIXI.BitmapText({
            text: 'Ace of Shadows',
            style: {
                fontFamily: 'grobold',
                fontSize: 35,
                align: 'center',
            },
        });
        bitmapFontText.x = this._app.screen.width / 2;
        bitmapFontText.y = bitmapFontText.height + this._app.screen.height * 0.12;
        bitmapFontText.anchor.set(0.5);
        this._app.stage.addChild(bitmapFontText);

        this._createCardDecks();
        this._createFPSCounter();
        this._createTopGameMenu();
        console.log('created cards scene');
    }

    private _createCardDecks(): void {

        const decksContainer = new PIXI.Container();
        decksContainer.x = this._app.screen.width / 2;
        decksContainer.y = this._app.screen.height / 2;
        this._app.stage.addChild(decksContainer);

        const cardDeck = new CardDeck(gameConfig.number_of_cards, gameConfig.cards_offset);
        cardDeck.x = this._app.screen.width * 0.3 - decksContainer.x;
        cardDeck.y = this._app.screen.height * 0.75 - decksContainer.y;
        decksContainer.addChild(cardDeck);

        const cardDeck2 = new CardDeck(1, gameConfig.cards_offset);
        cardDeck2.x = this._app.screen.width * 0.7 - decksContainer.x;
        cardDeck2.y = cardDeck.y;
        decksContainer.addChild(cardDeck2);

        const boardContainer = new PIXI.Container();
        decksContainer.addChild(boardContainer);

        this._cardsDeckManager = new CardsDeckManager();
        this._cardsDeckManager.moveCardsToDeck(boardContainer, cardDeck, cardDeck2, gameConfig.cards_change_frequency, gameConfig.cards_change_speed);

        if(decksContainer.height > this._app.screen.height * 0.5){
            console.log('scaling decks container');
            decksContainer.scale.set(this._app.screen.height * 0.5 / decksContainer.height);
        }

    }

    private _createFPSCounter(): void {
        this._fpsCounter = new Fps(this._app, 'FPS: 0');
    }

    public onDestroy(): void {
        sound.stopAllSounds();
        this._cardsDeckManager?.stopMovingCardsToDeck();
        this._fpsCounter?.removeUpdateListener();

    }

    private _createTopGameMenu(): void {
        const topGameMenu = new TopGameMenu(this._app);
        this._app.stage.addChild(topGameMenu);
    }
}