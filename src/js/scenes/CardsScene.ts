import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import BasicAnimations from '../helpers/BasicAnimations';
import CardDeck from '../helpers/CardDeck';
import CardsDeckManager from '../helpers/CardsDeckManager';
import { Scene } from '../helpers/Scene';

import assetsData from '../../assets/data/assets.json';
import gameConfig from '../../assets/data/ace_of_shadows_config.json';

import sound from '../utilities/Sound';

export default class CardsScene extends Scene {

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
        bitmapFontText.y = this._app.screen.height * 0.1;
        bitmapFontText.anchor.set(0.5);
        this._app.stage.addChild(bitmapFontText);

        this._createCardDecks();
    }

    private _createCardDecks(): void {

        const cardDeck = new CardDeck(gameConfig.number_of_cards, gameConfig.cards_offset);
        cardDeck.x = this._app.screen.width * 0.3;
        cardDeck.y = this._app.screen.height * 0.55;
        this._app.stage.addChild(cardDeck);

        const cardDeck2 = new CardDeck(1, gameConfig.cards_offset);
        cardDeck2.x = this._app.screen.width * 0.7;
        cardDeck2.y = cardDeck.y;
        this._app.stage.addChild(cardDeck2);

        const cardsDeckManager = new CardsDeckManager();
        cardsDeckManager.moveCardsToDeck(this._app.stage, cardDeck, cardDeck2, gameConfig.cards_change_frequency, gameConfig.cards_change_speed);

    }
}