export default class StringUtils {

    public extractWords(text: string): string[] {
        return text.split(' ');
    };

    public hasCurlyBraces(text: string): boolean {
        return text.includes('{') && text.includes('}');
    };

    public removeCurlyBraces(text: string): string {
        return text.replace(/{|}/g, '');
    };
}