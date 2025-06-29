export function getDateTimeString(localDateTime: String) {
    const creationDate = new Date(localDateTime);
    const now = new Date();
    const diffHours = (now.getTime() - creationDate.getTime()) / (1000 * 60 * 60);

    const time = creationDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (diffHours > 24) {
        return `${time} ${creationDate.toLocaleDateString(undefined)}`
    } else {
        return time
    }
}

export function safeBase64Encode(str: string): string {
    // Convert string to UTF-8 bytes, then to base64
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(binString);
}

export function safeBase64Decode(base64: string): string {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0));
    return new TextDecoder().decode(bytes);
}
