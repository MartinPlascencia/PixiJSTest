import * as PIXI from 'pixi.js';
import CardDeck from './CardDeck';
import gsap from 'gsap';

import sound from '../utilities/Sound';

export default class CardsDeckManager {

    constructor() {

    }

    public moveCardsToDeck(stage : PIXI.Container,initialDeck : CardDeck, finalDeck : CardDeck, moveFrequency : number, timeToMove : number): void {
        const cards = initialDeck.children;
        const moveInterval = setInterval(() => {
            const card = initialDeck.removeLastCard();
            stage.addChild(card);
            card.x += initialDeck.x;
            card.y += initialDeck.y;

            sound.playSound('card_sound', false, 0.05);
            gsap.to(card, { 
                x: finalDeck.x, 
                y: finalDeck.y + finalDeck.getDeckOffset(), 
                duration: timeToMove, 
                ease: 'power1.inOut',
                onComplete: () => {
                    finalDeck.addCard(card);
                    if (cards.length === 0) {
                        clearInterval(moveInterval);
                    }
                }
            });
        }, moveFrequency * 1000);
    }
}