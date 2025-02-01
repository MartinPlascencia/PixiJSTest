import * as PIXI from 'pixi.js';
import ChatDialog from './ChatDialog';
import gsap from 'gsap';

import gameConfig from '../../assets/data/magic_words_config.json';

export default class ChatManager extends PIXI.Container {
    private _app: PIXI.Application;
    private _messagesPosition: number = 0;
    private _messagesOffset: number;
    private _currentDialogIndex: number = 0;

    constructor(app: PIXI.Application, messagesOffset: number = 150) {
        super();
        this._app = app;
        this._messagesOffset = messagesOffset;
        this._currentDialogIndex = 0;
    }

    public async showDialogs(data: any): Promise<void> {
        if (this._currentDialogIndex >= data.dialogue.length) {
            return;
        }

        if (this._messagesPosition > 0) {
            gsap.to(this, { y: this.y - this._messagesOffset, duration: 0.5 });
        }
        const currentDialog = data.dialogue[this._currentDialogIndex];
        const chatDialog = new ChatDialog(this._app, currentDialog, data.avatars, gameConfig.time_per_word);
        chatDialog.y = this._messagesPosition;
        this.addChild(chatDialog);
        this._messagesPosition += this._messagesOffset;
        await chatDialog.showDialog();
        this._currentDialogIndex++;
        this.showDialogs(data);
    }
}
