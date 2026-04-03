import { backendURL } from "@/constants";
import { authenticatedRequest } from "@/api/apiUtils";
import type {
    DiaryInfo,
    DiaryStyleCreate,
    DiaryStyleUpdate,
    DiaryStylePreview,
    DiaryStyle,
    DiaryTitleSubtitle,
    UpdateTitleSubtitleRequest,
    UpdateDefaultGroupsRequest,
    UserProfilePage,
} from "@/api/dto/diaryServiceDto";

export type {
    DiaryInfo,
    DiaryStyleCreate,
    DiaryStyleUpdate,
    DiaryStylePreview,
    DiaryStyle,
    DiaryTitleSubtitle,
    UpdateTitleSubtitleRequest,
    UpdateDefaultGroupsRequest,
    UserProfilePage,
};

// Backward-compatible type aliases
export type DiaryStyleTextCreate = DiaryStyleCreate;
export type DiaryStyleTextUpdate = DiaryStyleUpdate;

// --- Diary info & profile ---

export async function updateDiaryInfo(login: string, diaryInfo: DiaryInfo): Promise<string> {
    const response = await authenticatedRequest(
        `/diary/update-diary-info?login=${encodeURIComponent(login)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(diaryInfo),
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to update diary info: ${await response.text()}`);
    }
    return await response.text();
}

export async function getTitleSubtitle(login: string): Promise<DiaryTitleSubtitle> {
    const response = await authenticatedRequest(
        `/diary/title-subtitle?login=${encodeURIComponent(login)}`
    );
    if (!response.ok) {
        throw new Error(`Failed to get title/subtitle: ${await response.text()}`);
    }
    return await response.json() as DiaryTitleSubtitle;
}

export async function updateTitleSubtitle(login: string, request: UpdateTitleSubtitleRequest): Promise<string> {
    const response = await authenticatedRequest(
        `/diary/update-title-subtitle?login=${encodeURIComponent(login)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to update title/subtitle: ${await response.text()}`);
    }
    return await response.text();
}

export async function updateDefaultGroups(login: string, request: UpdateDefaultGroupsRequest): Promise<string> {
    const response = await authenticatedRequest(
        `/diary/update-default-groups?login=${encodeURIComponent(login)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to update default groups: ${await response.text()}`);
    }
    return await response.text();
}

export async function updateProfile(login: string, content: string): Promise<string> {
    const response = await authenticatedRequest(
        `/diary/update-profile?login=${encodeURIComponent(login)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: content,
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to update profile: ${await response.text()}`);
    }
    return await response.text();
}

export async function getProfile(login: string): Promise<UserProfilePage> {
    const response = await fetch(
        `${backendURL}/diary/profile?login=${encodeURIComponent(login)}`
    );
    if (!response.ok) {
        throw new Error(`Failed to get profile: ${await response.text()}`);
    }
    return await response.json() as UserProfilePage;
}

// --- Styles ---

export async function getEnabledStyleUris(login: string): Promise<string[]> {
    const response = await fetch(
        `${backendURL}/diary/styles/enabled?login=${encodeURIComponent(login)}`
    );
    if (!response.ok) {
        throw new Error(`Failed to get enabled style URIs: ${response.statusText}`);
    }
    return await response.json();
}

export async function getStyleById(styleId: string): Promise<DiaryStylePreview> {
    const response = await fetch(`${backendURL}/diary/styles/${encodeURIComponent(styleId)}`);
    if (!response.ok) {
        throw new Error(`Failed to get style: ${response.statusText}`);
    }
    return await response.json() as DiaryStylePreview;
}

export async function updateStyle(
    styleId: string,
    login: string,
    style: DiaryStyleUpdate
): Promise<DiaryStyle> {
    const response = await authenticatedRequest(
        `/diary/styles/${encodeURIComponent(styleId)}?login=${encodeURIComponent(login)}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(style),
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to update style: ${response.statusText}`);
    }
    return await response.json() as DiaryStyle;
}

export async function deleteStyle(styleId: string, login: string): Promise<string> {
    const response = await authenticatedRequest(
        `/diary/styles/${encodeURIComponent(styleId)}?login=${encodeURIComponent(login)}`,
        { method: 'DELETE' }
    );
    if (!response.ok) {
        throw new Error(`Failed to delete style: ${response.statusText}`);
    }
    return await response.text();
}

export async function getStyleCollection(login: string): Promise<DiaryStyle[]> {
    const response = await authenticatedRequest(
        `/diary/styles?login=${encodeURIComponent(login)}`
    );
    if (!response.ok) {
        throw new Error(`Failed to get style collection: ${response.statusText}`);
    }
    return await response.json() as DiaryStyle[];
}

export async function addStyle(login: string, style: DiaryStyleCreate): Promise<DiaryStyle> {
    const response = await authenticatedRequest(
        `/diary/styles?login=${encodeURIComponent(login)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(style),
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to add style: ${response.statusText}`);
    }
    return await response.json() as DiaryStyle;
}

export async function addStyleById(
    login: string,
    styleId: string,
    enable: boolean = false
): Promise<DiaryStyle> {
    const response = await authenticatedRequest(
        `/diary/styles/add-style-by-id?login=${encodeURIComponent(login)}&styleId=${encodeURIComponent(styleId)}&enable=${enable}`,
        { method: 'POST' }
    );
    if (!response.ok) {
        throw new Error(`Failed to add style by ID: ${response.statusText}`);
    }
    return await response.json() as DiaryStyle;
}

export async function uploadStyleFile(
    diaryLogin: string,
    file: File,
    name: string = 'New Style',
    enabled: boolean = true
): Promise<DiaryStyle> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await authenticatedRequest(
        `/diary/styles/upload?diaryLogin=${encodeURIComponent(diaryLogin)}&name=${encodeURIComponent(name)}&enabled=${enabled}`,
        {
            method: 'POST',
            body: formData,
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to upload style file: ${response.statusText}`);
    }
    return await response.json() as DiaryStyle;
}

export async function reorderStyles(login: string, styleIds: string[]): Promise<DiaryStyle[]> {
    const response = await authenticatedRequest(
        `/diary/styles/reorder?login=${encodeURIComponent(login)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(styleIds),
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to reorder styles: ${response.statusText}`);
    }
    return await response.json() as DiaryStyle[];
}

// --- Backward-compatible object-style API ---

export const diaryClient = {
    getDiaryStyle: getStyleById,
    getDiaryStyleUris: getEnabledStyleUris,
    getDiaryStyleCollection: getStyleCollection,
    addDiaryStyle: addStyle,
    addDiaryStyleById: addStyleById,
    updateDiaryStyle: (diaryLogin: string, style: DiaryStyleUpdate): Promise<DiaryStyle> =>
        updateStyle(style.id, diaryLogin, style),
    deleteDiaryStyle: (styleId: string, diaryLogin: string): Promise<string> =>
        deleteStyle(styleId, diaryLogin),
    reorderDiaryStyles: reorderStyles,
};
