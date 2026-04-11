export type Language = 'RU' | 'EN' | 'KK' | 'KK_CYRILLIC';
export type Sex = 'MALE' | 'FEMALE' | 'UNDEFINED';
export type NsfwPolicy = 'SHOW' | 'HIDE' | 'WARN';
export type UserPermission = 'SVG_UPLOAD' | 'WRITE_BASIC_REACTIONS' | 'ISSUE_INVITE_CODES';

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface UserView {
    login: string;
    nickname: string;
    avatarUri?: string | null;
    signature?: string | null;
}

export interface UserRegistration {
    login: string;
    email: string;
    password: string;
    nickname: string;
    timezone: string;
    language: Language;
}

export interface UserLogin {
    login: string;
    password: string;
}

export interface UserAdditionalInfo {
    sex: Sex;
    timezone: string;
    language: Language;
    nsfw: NsfwPolicy;
    birthDate?: string | null;
}

export interface UserSessionInfo {
    login: string;
    nickname: string;
    language: Language;
    nsfw: NsfwPolicy;
    timezone: string;
    permissions: UserPermission[];
}

export interface UpdateUserRequest {
    user: UserRegistration;
    oldPassword: string;
}

export interface SerializableStringMap {
    content: Record<string, string>;
}

export interface NotificationSettings {
    notifyAboutComments: boolean;
    notifyAboutReplies: boolean;
    notifyAboutPostReactions: boolean;
    notifyAboutCommentReactions: boolean;
    notifyAboutPrivateMessages: boolean;
    notifyAboutMentions: boolean;
    notifyAboutNewPosts: boolean;
    notifyAboutFriendRequests: boolean;
    notifyAboutReposts: boolean;
}

export interface FriendRequestCreate {
    toUser: string;
    message: string;
    label?: string | null;
}

export interface FriendRequest {
    id: string;
    user: UserView;
    message: string;
    label?: string | null;
    createdAt: string;
}

export interface UpdatePasswordRequest {
    newPassword: string;
    oldPassword: string;
}

export interface IgnoredUserView {
    login: string;
    nickname: string;
    avatarUri?: string | null;
    reason?: string | null;
}

export interface RelationshipInfo {
    friendLogins: string[];
    outgoingFriendRequestLogins: string[];
    incomingFriendRequestLogins: string[];
    ignoredLogins: string[];
    hiddenFromFeedLogins: string[];
}
