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
    private _basicAnimations: BasicAnimations;
    private _fpsCounter?: Fps;
    private _cardsDeckManager?: CardsDeckManager;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
        this._basicAnimations = new BasicAnimations();
    }

    protected onInit(): void {
        this._create();
    }

    private _create(): void {

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
        bitmapFontText.y = this._app.screen.height * 0.15;
        bitmapFontText.anchor.set(0.5);
        this._app.stage.addChild(bitmapFontText);

        this._createCardDecks();
        this._createFPSCounter();
        this._createTopGameMenu();
    }

    private _createCardDecks(): void {

        const cardDeck = new CardDeck(gameConfig.number_of_cards, gameConfig.cards_offset);
        cardDeck.x = this._app.screen.width * 0.3;
        cardDeck.y = this._app.screen.height * 0.6;
        this._app.stage.addChild(cardDeck);

        const cardDeck2 = new CardDeck(1, gameConfig.cards_offset);
        cardDeck2.x = this._app.screen.width * 0.7;
        cardDeck2.y = cardDeck.y;
        this._app.stage.addChild(cardDeck2);

        const boardContainer = new PIXI.Container();
        this._app.stage.addChild(boardContainer);

        this._cardsDeckManager = new CardsDeckManager();
        this._cardsDeckManager.moveCardsToDeck(boardContainer, cardDeck, cardDeck2, gameConfig.cards_change_frequency, gameConfig.cards_change_speed);

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