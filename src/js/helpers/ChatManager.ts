import * as PIXI from 'pixi.js';
import ChatDialog from './ChatDialog';
import gsap from 'gsap';

import gameConfig from '../../assets/data/magic_words_config.json';

export default class ChatManager extends PIXI.Container {
    private _app: PIXI.Application;
    private _messagesPosition: number = 0;
    private _messagesOffset: number;
    private _currentDialogIndex: number = 0;
    private _active : boolean;
    private _currentChatDialog?: ChatDialog;

    constructor(app: PIXI.Application, messagesOffset: number = 150) {
        super();
        this._app = app;
        this._messagesOffset = messagesOffset;
        this._currentDialogIndex = 0;
        this._active = true;
    }

    public async showDialogs(data: any): Promise<void> {
        if (this._currentDialogIndex >= data.dialogue.length || !this._active) {
            return;
        }

        if (this._messagesPosition > 0) {
            gsap.to(this, { y: this.y - this._messagesOffset, duration: 0.5 });
        }
        const currentDialog = data.dialogue[this._currentDialogIndex];
        const chatDialog = new ChatDialog(this._app, currentDialog, data.avatars, gameConfig.time_per_word);
        chatDialog.y = this._messagesPosition;
        this.addChild(chatDialog);

        this._currentChatDialog = chatDialog;
        this._messagesPosition += this._messagesOffset;
        await chatDialog.showDialog();
        this._currentDialogIndex++;
        this.showDialogs(data);
    }

    public stopDialogs(): void {
        this._active = false;
        if (this._currentChatDialog) {
            this._currentChatDialog.stopShowingDialog();
        }
    }
}
