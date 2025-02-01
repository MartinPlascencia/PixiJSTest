import * as PIXI from 'pixi.js';

export default class IconsManager {

    private _notWorkingEmojies : string[] = ['sad'];

    public async saveIconsToCache(data: any): Promise<void> {

        const iconPromises = data.emojies.map(async (icon: { [key: string]: string }) => {
            const imageUrl = this._notWorkingEmojies.includes(icon.name) 
                ? 'https://cdn-icons-png.flaticon.com/128/1791/1791330.png': icon.url;
            return this._addImageToCache(imageUrl, icon.name);
        });
    
        const avatarPromises = data.avatars.map(async (avatar: { [key: string]: string }) => {
            return this._addImageToCache(avatar.url, avatar.name);
        });
    
        await Promise.all([...iconPromises, ...avatarPromises]);
    }
    
    private async _addImageToCache(url: string, textureKey: string): Promise<void> {
        try {
            const texture = await PIXI.Assets.load({src: url, loadParser: 'loadTextures'});
            PIXI.Cache.set(textureKey, texture);
        } catch (error) {
            console.error(`Failed to load texture: ${url}`, error);
        }
    }
    

}