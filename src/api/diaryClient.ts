import {backendURL} from "@/main.ts";

export interface DiaryStylePreview {
    id: string,
    name: string,
    enabled: boolean,
}

export interface DiaryStyle {
    id: string,
    authorLogin: string,
    authorNickname: string,
    name: string,
    description?: string,
    styleUri: string,
    styleContent: string,
    enabled: boolean,
}

export interface DiaryStyleTextCreate {
    name: string,
    description: string | null,
    styleContent: string,
    enabled: boolean,
}

export interface DiaryStyleTextUpdate {
    id: string,
    name: string,
    description: string | null,
    styleContent: string,
    enabled: boolean,
}

export interface IDiaryClient {
    getDiaryStyle(styleId: string): Promise<DiaryStylePreview>;
    getDiaryStyleText(styleId: string): Promise<string>;
    getDiaryStyleUris(diaryLogin: string): Promise<string[]>;
    getDiaryStyleCollection(diaryLogin: string): Promise<DiaryStyle[]>;

    addDiaryStyle(diaryLogin: string, style: DiaryStyleTextCreate): Promise<DiaryStyle>;
    addDiaryStyleById(diaryLogin: string, styleId: string, enable: boolean): Promise<DiaryStyle>;
    updateDiaryStyle(diaryLogin: string, style: DiaryStyleTextUpdate): Promise<DiaryStyle>;

    deleteDiaryStyle(styleId: string, diaryLogin: string): Promise<void>;
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

    async getDiaryStyleText(styleId: string): Promise<string> {
        console.log(`Getting diary style text for ${styleId}`);
        const response = await DiaryClientImpl.authenticatedRequest(`/diary/styles/${styleId}`);
        if (!response.ok) {
            throw new Error(`Failed to get diary style text: ${response.statusText}`);
        }
        return await response.text();
    }

    async getDiaryStyleUris(diaryLogin: string): Promise<string[]> {
        const response = await fetch(`${backendURL}/diary/styles/enabled?login=${diaryLogin}`);
        if (!response.ok) {
            throw new Error(`Failed to get diary style URIs: ${response.statusText}`);
        }
        return await response.json()
    }

    async getDiaryStyleCollection(diaryLogin: string): Promise<DiaryStyle[]> {
        const response = await DiaryClientImpl.authenticatedRequest(`/diary/styles?login=${diaryLogin}`);
        if (!response.ok) {
            throw new Error(`Failed to get diary style collection: ${response.statusText}`);
        }
        return await response.json() as DiaryStyle[];
    }

    async addDiaryStyleById(diaryLogin: string, styleId: string, enable: boolean): Promise<DiaryStyle> {
        const response = await DiaryClientImpl.authenticatedRequest(
            `/diary/styles/add-style-by-id?login=${diaryLogin}&styleId=${styleId}&enable=${enable.toString()}`,
            {
                method: 'POST'
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to add diary style by ID: ${response.statusText}`);
        }
        return await response.json() as DiaryStyle;
    }

    async addDiaryStyle(diaryLogin: string, style: DiaryStyleTextCreate): Promise<DiaryStyle> {
        const response = await DiaryClientImpl.authenticatedRequest(
            `/diary/styles?login=${diaryLogin}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(style)
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to add diary style: ${response.statusText}`);
        }
        return await response.json() as DiaryStyle;
    }

    async updateDiaryStyle(diaryLogin: string, style: DiaryStyleTextUpdate): Promise<DiaryStyle> {
        const response = await DiaryClientImpl.authenticatedRequest(
            `/diary/styles/${style.id}?login=${diaryLogin}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(style)
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to update diary style: ${response.statusText}`);
        }
        return await response.json() as DiaryStyle;
    }

    async deleteDiaryStyle(styleId: string, diaryLogin: string): Promise<void> {
        const response = await DiaryClientImpl.authenticatedRequest(
            `/diary/styles/${styleId}?login=${diaryLogin}`,
            {
                method: 'DELETE'
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to delete diary style: ${response.statusText}`);
        }
    }

    async getDiaryStyle(styleId: string): Promise<DiaryStylePreview> {
        const response = await fetch(`${backendURL}/diary/styles/${styleId}`);
        if (!response.ok) {
            throw new Error(`Failed to get diary style URIs: ${response.statusText}`);
        }
        return await response.json()
    }

    async reorderDiaryStyles(diaryLogin: string, styleIds: string[]): Promise<void> {
        const response = await DiaryClientImpl.authenticatedRequest(
            `/diary/styles/reorder?login=${diaryLogin}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(styleIds)
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to reorder diary styles: ${response.statusText}`);
        }
    }
}

export const diaryClient: IDiaryClient = new DiaryClientImpl();
