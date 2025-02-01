import * as PIXI from 'pixi.js';

export default class Fps extends PIXI.BitmapText {

    private _fpsInterval?: NodeJS.Timeout;
    private _updateFrequency: number;
    constructor(app : PIXI.Application, text : string, font : string = 'futuraPTBold', fontSize : number = 24, updateFrequency : number = 500, 
        positionX : number = 10, positionY : number = 5) {
        super(text, {
            fontFamily: font,
            fontSize: fontSize,
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.position.set(positionX, positionY);
        app.stage.addChild(this);
        
        this._updateFrequency = updateFrequency;
        this._addUpdateListener(app);
    }

    private _addUpdateListener(app : PIXI.Application): void {
        this._fpsInterval = setInterval(() => {
            this.text = `FPS: ${app.ticker.FPS.toFixed(2)}`;
        }, this._updateFrequency);
    }

    public removeUpdateListener(): void {
        clearInterval(this._fpsInterval);
    }
}