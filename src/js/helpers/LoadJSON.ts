export default class LoadJSON {

    public async loadJson(url: string): Promise<any> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json(); // Parse JSON response
            return data;
        } catch (error) {
            console.error('Error loading JSON:', error);
            return null;
        }
    }
}