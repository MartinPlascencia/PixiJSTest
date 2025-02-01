import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export default class FireParticles extends PIXI.Container {

    private _maxParticles: number;
    private _particles: PIXI.Sprite[] = [];
    private _particlesInterval?: NodeJS.Timeout;
    constructor(maxParticles : number) {
        super();
        this._maxParticles = maxParticles;
        this._startFireParticles();
    }

    private _startFireParticles(): void {

        this._particlesInterval = setInterval(this._createFireParticle.bind(this), 300);
    }
    
    private _createFireParticle() : void {
        if (this._particles.length >= this._maxParticles) {
            return;
        }

        const fireParticle = new PIXI.Sprite(PIXI.Assets.get('gameAtlas').textures['fire_spark']);
        fireParticle.anchor.set(0.5);
        fireParticle.x = (Math.random() * 40 - 20);
        fireParticle.y = 0;
        fireParticle.alpha = 0;
        fireParticle.scale.set(0.5 + Math.random() * 0.5);
        
        this.addChild(fireParticle);
        this._particles.push(fireParticle);

        this._animateFireParticle(fireParticle);
    }

    private _animateFireParticle(sprite: PIXI.Sprite): void {
        gsap.to(sprite, {
            duration: 1.5 + Math.random(), // Random duration
            y: sprite.y - (100 + Math.random() * 50), // Move upward
            alpha: 1,
            ease: "power1.out"
        });

        gsap.to(sprite.scale, {
            duration: 1.5 + Math.random(),
            x: 1.5,
            y: 1.5,
            ease: "power1.out"
        });

        gsap.to(sprite, {
            delay: 1,
            duration: 0.5,
            alpha: 0,
            onComplete: () => {
                this.removeChild(sprite);
                this._particles.splice(this._particles.indexOf(sprite), 1);
            }
        });
    }

    public stopParticles(): void {
        this._particles.forEach((particle) => {
            gsap.killTweensOf(particle);
            this.removeChild(particle);
        });
        clearInterval(this._particlesInterval);
        this._particles = [];
    }
}