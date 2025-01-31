import { resolve } from "../../../webpack.config";

class Sound {
    private static instance: Sound;
    private sounds: Map<string, HTMLAudioElement>;

    private constructor() {
        this.sounds = new Map();
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
                this.sounds.delete(key); 
            });

            audio.addEventListener('canplaythrough', () => {
                this.sounds.set(key, audio);
                resolve();
            });
        });
    }

    playSound(key: string, loop: boolean = false, volume: number = 1.0): void {
        const sound = this.sounds.get(key);
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

    stopSound(key: string): void {
        const sound = this.sounds.get(key);
        if (sound && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    setVolume(key: string, volume: number): void {
        const sound = this.sounds.get(key);
        if (sound) {
            sound.volume = Math.max(0, Math.min(1, volume)); 
        }
    }
}

export default Sound.getInstance();
export { Sound };