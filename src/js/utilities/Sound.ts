import { resolve } from "../../../webpack.config";

class Sound {
    private static instance: Sound;
    private _sounds: Map<string, HTMLAudioElement>;

    private constructor() {
        this._sounds = new Map();
    }

    public static getInstance(): Sound {
        if (!Sound.instance) {
            Sound.instance = new Sound();
        }
        return Sound.instance;
    }

    async loadSound(key: string, url: string): Promise<void> {
        return new Promise((resolve) => {
            const audio = new Audio(url);

            audio.addEventListener('error', () => {
                console.error(`Failed to load sound "${key}" from URL: ${url}`);
                this._sounds.delete(key); 
            });

            audio.addEventListener('canplaythrough', () => {
                this._sounds.set(key, audio);
                resolve();
            });
        });
    }

    public playSound(key: string, loop: boolean = false, volume: number = 1.0): void {
        const sound = this._sounds.get(key);
        if (!sound) {
            console.error(`Sound "${key}" not found!`);
            return;
        }

        sound.loop = loop;
        sound.volume = volume;
        sound.currentTime = 0;

        sound.play().catch((error) => {
            console.error(`Audio playback failed for "${key}":`, error);
        });
    }

    public stopSound(key: string): void {
        const sound = this._sounds.get(key);
        if (sound && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    public setVolume(key: string, volume: number): void {
        const sound = this._sounds.get(key);
        if (sound) {
            sound.volume = Math.max(0, Math.min(1, volume)); 
        }
    }

    public stopAllSounds(): void {
        this._sounds.forEach((sound) => {
            if (!sound.paused) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
    }
}

export default Sound.getInstance();
export { Sound };