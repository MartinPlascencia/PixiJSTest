import * as PIXI from 'pixi.js';
import CardDeck from './CardDeck';
import gsap from 'gsap';

import sound from '../../utilities/Sound';

export default class CardsDeckManager {

    private _moveInterval?: NodeJS.Timeout;
    public moveCardsToDeck(boardContainer : PIXI.Container,initialDeck : CardDeck, finalDeck : CardDeck, moveFrequency : number, timeToMove : number): void {
        const cards = initialDeck.children;
        this._moveInterval = setInterval(() => {
            const card = initialDeck.removeLastCard();
            boardContainer.addChild(card);
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
                        clearInterval(this._moveInterval);
                    }
                }
            });

            gsap.to(card.scale, {
                x: card.scale.x * 1.2,
                y: card.scale.y * 1.2,
                yoyo: true,
                repeat: 1,
                duration: 0.2,
            });
        }, moveFrequency * 1000);
    }

    public stopMovingCardsToDeck(): void {
        gsap.globalTimeline.clear();
        clearInterval(this._moveInterval);
    }
}