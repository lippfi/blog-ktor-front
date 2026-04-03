import type { UserView } from "@/api/dto/userServiceDto";

export interface DiaryInfo {
    name: string;
    subtitle: string;
    defaultReadGroup: string;
    defaultCommentGroup: string;
    defaultReactGroup: string;
}

export interface DiaryStyleCreate {
    name: string;
    description: string | null;
    styleContent: string;
    enabled: boolean;
}

export interface DiaryStyleUpdate {
    id: string;
    name: string;
    description: string | null;
    styleContent: string;
    enabled: boolean;
}

export interface DiaryStylePreview {
    id: string;
    name: string;
}

export interface DiaryStyle {
    id: string;
    name: string;
    description?: string | null;
    enabled: boolean;
    styleUri: string;
    styleContent: string;
    authorLogin: string;
    authorNickname: string;
}

export interface UpdateTitleSubtitleRequest {
    title: string;
    subtitle: string;
}

export interface UpdateDefaultGroupsRequest {
    defaultReadGroup: string;
    defaultCommentGroup: string;
    defaultReactGroup: string;
}

export interface UserProfilePage {
    login: string;
    nickname: string;
    content: string;
    song?: string | null;
    styles: string[];
    friends: UserView[];
}
