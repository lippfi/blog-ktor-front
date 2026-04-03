import { formatInstant } from '@/utils/dateTime';

export function getDateTimeString(instant: string) {
    return formatInstant(instant);
}

export function safeBase64Encode(str: string): string {
    // Convert string to UTF-8 bytes, then to base64
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(binString);
}

export function safeBase64Decode(base64: string): string {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
}
