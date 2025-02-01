import gsap from "gsap";
import * as PIXI from "pixi.js";
export default class BasicAnimations {

    public animateButton(buttonContainer: PIXI.Container | PIXI.Sprite, callback?: () => void): void {
        buttonContainer.eventMode = 'none';
        
        gsap.to(buttonContainer.scale, { 
            x: buttonContainer.scale.x * 0.7, 
            y: buttonContainer.scale.y * 0.7, 
            duration: 0.15 , 
            yoyo: true, 
            repeat: 1,
            ease: 'linear',
            onComplete: () => {
                gsap.to(buttonContainer.scale, { 
                    x: buttonContainer.scale.x * 0.9, 
                    y: buttonContainer.scale.y * 0.9, 
                    duration: 0.075, 
                    yoyo: true, 
                    repeat: 1,
                    ease: 'linear',
                    onComplete: () => {
                        if(callback !== undefined){
                            callback();
                        }
                    }
                });
            }
        });
    }

    public popObject(object: PIXI.Container | PIXI.Sprite): void {
        gsap.from(object.scale, { 
            x: 0, 
            y: 0, 
            duration: 0.4, 
            ease: 'back.out',
        });
    }
}