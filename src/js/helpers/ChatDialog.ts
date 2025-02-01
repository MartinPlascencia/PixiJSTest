import * as PIXI from 'pixi.js';
import StringUtils from './StringUtils';
import { resolve } from '../../../webpack.config';

import sound from '../utilities/Sound';

export default class ChatDialog extends PIXI.Container {
    private _app: PIXI.Application;
    private _characterIconContainer?: PIXI.Container;
    private _dialoguesContainer?: PIXI.Container;
    private _dialogWidth: number = 0;
    private _wordsOffset: number = 5;
    private _timePerWord: number = 0;
    private _iconsScale: number = 0.25;
    private _active: boolean;

    private _defaultAvatar: string = 'Leonard'; 


    constructor(app: PIXI.Application, dialogue: {name: string, text: string}, avatars: {name: string, url: string, position : string}[],
        timePerWord: number) {
        super();
        this._app = app;
        this._timePerWord = timePerWord;
        this._active = true;

        const usedAvatar = avatars.find(avatar => avatar.name === dialogue.name);
        const isLeft = usedAvatar ? usedAvatar.position === 'left' : false;
        this._createCharacterFrame(dialogue.name, isLeft);
        this._setDialogWidth();
        this._createDialogueFrame(dialogue.text, isLeft );
        
    }

    private _setDialogWidth(): void {
        if (this._characterIconContainer) {
            this._dialogWidth = this._app.screen.width - this._characterIconContainer.width * 1;
        }
    }

    private _createCharacterFrame(name: string, isLeft: boolean): void {

        const characterIconContainer = new PIXI.Container();
        this.addChild(characterIconContainer);

        let textureIcon = PIXI.Cache.get(name) ? PIXI.Cache.get(name) : PIXI.Cache.get(this._defaultAvatar);
        const characterIcon = new PIXI.Sprite(textureIcon);
        characterIcon.anchor.set(0.5);
        characterIcon.x = 0;
        characterIconContainer.addChild(characterIcon);

        const characterName = new PIXI.BitmapText(name, {
            fontFamily: 'futuraPTBold',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center'
        });
        characterName.anchor.set(0.5);
        characterName.x = 0;
        characterName.y = characterIcon.y + characterIcon.height * 0.6;
        characterIconContainer.addChild(characterName);

        const characterIconOffset = characterIcon.width * 0.5;
        characterIconContainer.x = isLeft ? characterIconOffset : this._app.screen.width - characterIconOffset;
        this._characterIconContainer = characterIconContainer;
    }

    private _createDialogueFrame(text: string, isLeft: boolean): void {

        let obj = new PIXI.Graphics().roundRect(isLeft ? 110 : 50, -50, this._dialogWidth *0.95, 100, 12).fill(0x000000);
        obj.alpha = 0.8;
        this.addChild(obj);

        this._dialoguesContainer = new PIXI.Container();
        this.addChild(this._dialoguesContainer);
        
        const stringUtils = new StringUtils();
        const words = stringUtils.extractWords(text);
        
        const characterIconOffset = this._characterIconContainer?.width ?? 0;
        const initialDialogPivotX = isLeft ? characterIconOffset : characterIconOffset * 0.5;
        
        let dialogPivotX = initialDialogPivotX;
        let dialogPivotY = 0;
    
        for (const word of words) {
            const dialogueAsset = this._createDialogueAsset(word, stringUtils);
            dialogueAsset.x = dialogPivotX;
            dialogueAsset.y = dialogPivotY;
            dialogueAsset.anchor.set(0,1);
            dialogueAsset.alpha = 0;
            this._dialoguesContainer.addChild(dialogueAsset);
    
            dialogPivotX += dialogueAsset.width + this._wordsOffset;
    
            if (dialogPivotX > this._dialogWidth) {
                dialogPivotX = initialDialogPivotX;
                dialogPivotY += dialogueAsset.height + this._wordsOffset;
                dialogueAsset.x = dialogPivotX;
                dialogueAsset.y = dialogPivotY;
                dialogPivotX += dialogueAsset.width + this._wordsOffset;
            }
        }
    }
    
    private _createDialogueAsset(word: string, stringUtils: StringUtils): PIXI.Sprite | PIXI.BitmapText {
        if (stringUtils.hasCurlyBraces(word)) {
            const textureKey = stringUtils.removeCurlyBraces(word);
            const sprite = new PIXI.Sprite(PIXI.Cache.get(textureKey));
            sprite.scale.set(this._iconsScale);
            return sprite;
        } else {
            return new PIXI.BitmapText(word, {
                fontFamily: 'futuraPTBold',
                fontSize: 20,
                fill: 0xFFFFFF,
                align: 'left'
            });
        }
    }
    

    public async showDialog(): Promise<void> {
        if (!this._dialoguesContainer) return;
    
        for (let i = 0; i < this._dialoguesContainer.children.length; i++) {
            if (!this._active) return;
            const word = this._dialoguesContainer.children[i];
            const timeToWait = word instanceof PIXI.BitmapText ? word.text.length * this._timePerWord : this._timePerWord;
            await this._delay(timeToWait);
            sound.playSound('typing_sound');
            word.alpha = 1;
        }
        await this._delay(1);
    }
    
    private _delay(seconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    public stopShowingDialog(): void { 
        this._active = false;
    }
    
}
