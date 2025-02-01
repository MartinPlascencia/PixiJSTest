import * as PIXI from 'pixi.js';
import Card from './Card';

export default class CardDeck extends PIXI.Container {

    private _cardsIndex : number = 0;
    private _deckOffset: number = 0;
    private _cardsOffset: number;

    private _cardIndexLimit: number = 3;

    constructor(numberOfCards: number, cardsOffset: number, ) {
        super();
        this._cardsOffset = cardsOffset;
        this._createCards(numberOfCards);
    }

    private _createCards(numberOfCards: number): void {
        for (let i = 0; i < numberOfCards; i++) {
            const card = new Card(this._cardsIndex);
            card.anchor.set(0.5);
            this.addCard(card);
            this._cardsIndex++;
            if (this._cardsIndex > this._cardIndexLimit) {
                this._cardsIndex = 0;
            }
        }
    }

    public addCard(card : PIXI.Sprite): void {
        card.x = 0;
        card.y = this._deckOffset;
        this._deckOffset -= this._cardsOffset;
        this.addChild(card);
    }

    public getDeckOffset(): number {
        return this._deckOffset;
    }

    public removeLastCard(): PIXI.Sprite {
        return this.removeChildAt(this.children.length - 1) as PIXI.Sprite;
    }
}