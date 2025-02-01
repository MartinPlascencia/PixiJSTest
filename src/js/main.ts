import MainScene from './scenes/MainScene';
import PreloadScene from './scenes/PreloadScene';
import CardsScene from './scenes/CardsScene';
import ChatScene from './scenes/ChatScene';
import FireScene from './scenes/FireScene';
import Orientation from './libs/Orientation';
import * as PIXI from 'pixi.js';
import { SceneManager } from './helpers/SceneManager';
import Fire from './scenes/FireScene';

const gameWidth = 1920;
const gameHeight = Math.round(gameWidth * (window.innerHeight / window.innerWidth));

window.onload = () => {

    const orientation = new Orientation();
    orientation.checkOrientation();

    if (orientation.hasCorrectResolution()) {
        InitializeApp();
    }
    window.focus();
};

export let sceneManager: SceneManager;

async function InitializeApp(){
    const app = new PIXI.Application();
    await app.init({
        backgroundColor: '#ffffff',
        resizeTo: window,
        width: gameWidth,
        height: gameHeight,
    });

    document.body.appendChild(app.canvas);
    sceneManager = new SceneManager(app);
    sceneManager.changeScene(new PreloadScene(app));

    app.ticker.add((delta: PIXI.Ticker) => {
        sceneManager.update(delta.deltaTime);
    });
}



