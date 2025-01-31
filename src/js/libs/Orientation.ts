import gameConfig from '../../assets/data/game_config.json';
import debounce from 'lodash.debounce';

export default class Orientation {
    private firstResolution!: string;

    constructor() {
        this.onResizeCallback();
    }

    // Handle DOM-based visibility toggling
    blockGame(active: boolean): void {
        const turnElement = document.getElementById("turn");

        if (!turnElement) {
            console.error('Required DOM elements not found.');
            return;
        }

        if (active) {
            turnElement.style.display = "block";
        } else {
            turnElement.style.display = "none";

            if (this.getResolution() !== this.firstResolution) {
                window.location.reload();
            }
        }
    }

    // Entry point for checking orientation logic
    checkOrientation(): void {
        this.checkBlockResolution();
    }

    private onResizeCallback(): void {
        window.onresize = debounce(() => {
            this.checkBlockResolution();
        }, 200);
    }

    private checkBlockResolution(): void {
        if (!this.firstResolution) {
            this.firstResolution = this.getResolution();
        }

        const defaultOrientation = gameConfig.orientation;

        const currentOrientation = this.getResolution();

        if (currentOrientation === "landscape") {
            this.blockGame(defaultOrientation === 'portrait');
        } else {
            this.blockGame(defaultOrientation === 'landscape');
        }
    }

    hasCorrectResolution(): boolean {
        return gameConfig.orientation === this.firstResolution;
    }

    private getResolution(): string {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }
}
