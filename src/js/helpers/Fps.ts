import * as PIXI from 'pixi.js';

export default class Card extends PIXI.Sprite {

    constructor(index: number) {
        super(PIXI.Assets.get('gameAtlas').textures['card_' + index]);
    }
}