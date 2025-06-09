import { backendURL } from "@/main";
import {authenticatedRequest} from "@/api/userService.ts";

// Types
export interface DiaryInfo {
    name: string;
    subtitle: string;
    defaultReadGroup: string;
    defaultCommentGroup: string;
    defaultReactGroup: string;
}

type Result<T> = 
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

// API Methods

export async function getDiaryStyleText(diaryLogin: string): Promise<Result<string>> {
    try {
        const response = await fetch(
            `${backendURL}/diary/style-text?diaryLogin=${encodeURIComponent(diaryLogin)}`
        );
        if (response.ok) {
            const data = await response.text();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function getDiaryStyleFile(diaryLogin: string): Promise<Result<string>> {
    try {
        const response = await fetch(
            `${backendURL}/diary/style-file?diaryLogin=${encodeURIComponent(diaryLogin)}`
        );
        if (response.ok) {
            const data = await response.text();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function setDiaryStyle(styleContent: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest('/diary/set-style', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: styleContent
        });

        if (response.ok) {
            const message = await response.text();
            return { type: 'ok', data: message };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function updateDiaryInfo(login: string, diaryInfo: DiaryInfo): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/diary/update-diary-info?login=${encodeURIComponent(login)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diaryInfo)
        });

        if (response.ok) {
            const message = await response.text();
            return { type: 'ok', data: message };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}