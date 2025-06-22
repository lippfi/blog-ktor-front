import {backendURL} from "@/main.ts";

export interface DiaryStyle {
    id: string,
    name: string,
    enabled: boolean,
    styleFileUri: string,
    previewPictureUri?: string,
}

export interface DiaryStyleTextCreate {
    name: string,
    enabled: boolean,
    styleFileUri: string,
    previewPictureUri?: string,
}

export interface DiaryStyleTextUpdate {
    id: string,
    name: string,
    enabled: boolean,
    styleFileUri: string,
    previewPictureUri?: string,
}

export interface IDiaryClient {
    getDiaryStyleText(styleId: string): Promise<string>;
    getDiaryStyleUris(diaryLogin: string): Promise<string[]>;
    getDiaryStyleCollection(diaryLogin: string): Promise<DiaryStyle[]>;

    addDiaryStyle(diaryLogin: string, styleId: string): Promise<DiaryStyle>;
    addDiaryStyle(diaryLogin: string, style: DiaryStyleTextCreate): Promise<DiaryStyle>;
    updateDiaryStyle(diaryLogin: string, style: DiaryStyleTextUpdate): Promise<DiaryStyle>;

    deleteDiaryStyle(styleId: string): Promise<void>;
    reorderDiaryStyles(diaryLogin: string, styleIds: string[]): Promise<void>;
}

class DiaryClientImpl implements IDiaryClient {
    private static async authenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
        const token = localStorage.getItem('jwt');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        return fetch(`${backendURL}${endpoint}`, { ...options, headers });
    }
}