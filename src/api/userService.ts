import { backendURL } from "@/main";

// Common types
export type Language = 'EN' | 'RU' | 'KK' | 'KK_CYRILLIC';
export type Sex = 'MALE' | 'FEMALE' | 'UNDEFINED';
export type NSFWPolicy = 'SHOW' | 'HIDE' | 'WARN';

export function getCurrentUserLogin() {
    // TODO
    return "shimpansky"
}
export function getCurrentUserNickname() {
    // TODO
    return "детектив шимпански"
}

interface UserBase {
    login: string;
    nickname: string;
    avatarUri?: string;
}
export interface FriendBase {
    label: string;
    login: string;
    nickname: string;
    avatarUri?: string;
}

interface UserUpdateRequest {
    user: {
        login: string;
        email: string;
        password: string;
        nickname: string;
        timezone: string;
        language: Language;
    };
    oldPassword: string;
}

export interface UserAdditionalInfo {
    sex: Sex;
    timezone: string;
    language: Language;
    nsfw: NSFWPolicy;
    birthDate?: string;
}

interface NotificationSettings {
    notifyAboutComments: boolean;
    notifyAboutReplies: boolean;
    notifyAboutPostReactions: boolean;
    notifyAboutCommentReactions: boolean;
    notifyAboutPrivateMessages: boolean;
    notifyAboutMentions: boolean;
}

interface FriendRequest {
    id: string;
    user: UserBase;
    message: string;
    label: string;
    createdAt: string;
}

interface SignInData {
    login: string;
    password: string;
}

interface SignUpData {
    login: string;
    email: string;
    password: string;
    nickname: string;
    timezone: string;
    language: Language;
}

interface FriendRequestData {
    toUser: string;
    message: string;
    label: string;
}

type Result =
    | { type: 'ok' }
    | { type: 'error'; message: string };

type LoginResult = Result;

async function authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
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

export async function signIn(login: string, password: string): Promise<LoginResult> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password } as SignInData)
    };

    const response = await fetch(`${backendURL}/user/sign-in`, requestOptions);
    let result: LoginResult
    if (response.ok) {
        const token = await response.text();
        localStorage.setItem('jwt', token);
        result = { type: 'ok' };
    } else {
        const text = await response.text();
        result = { type: 'error', message: text };
    }
    return result;
}

interface SignUpData {
    login: string;
    nickname: string;
    email: string;
    password: string;
}

type RegistrationResult =
    | { type: 'ok' }
    | { type: 'error'; message: string };

export async function signUp(
    login: string,
    nickname: string,
    email: string,
    password: string,
    inviteCode: string,
    timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: Language = 'EN'
): Promise<RegistrationResult> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            login, 
            nickname, 
            email, 
            password,
            timezone,
            language
        } as SignUpData)
    };
    const url = inviteCode.trim()
        ? `${backendURL}/user/sign-up?inviteCode=${encodeURIComponent(inviteCode)}`
        : `${backendURL}/user/sign-up`
    const response = await fetch(url, requestOptions);

    let result: RegistrationResult;
    if (response.ok) {
        result = { type : 'ok' }
    } else {
        result = { type: 'error', message : await response.text() }
    }
    return result;
}

export async function isLoginBusy(login: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-login-busy?login=${encodeURIComponent(login)}`);
    const text = await response.text();
    return text === 'true';
}

export async function isNicknameBusy(nickname: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-nickname-busy?nickname=${encodeURIComponent(nickname)}`);
    const text = await response.text();
    return text === 'true';
}

export async function isEmailBusy(email: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-email-busy?email=${encodeURIComponent(email)}`);
    const text = await response.text();
    return text === 'true';
}

export function logOut(): void {
    localStorage.removeItem('jwt');
}

export async function createInviteCode(): Promise<string> {
    const response = await authenticatedRequest('/user/create-invite-code');
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

export async function updateUser(updateData: UserUpdateRequest): Promise<Result> {
    const response = await authenticatedRequest('/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateAdditionalInfo(info: UserAdditionalInfo): Promise<Result> {
    const response = await authenticatedRequest('/user/update-additional-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function sendPasswordResetEmail(userIdentifier: string): Promise<Result> {
    const response = await authenticatedRequest('/user/send-password-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userIdentifier)
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function resetPassword(code: string, newPassword: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/reset-password?code=${encodeURIComponent(code)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPassword)
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function getAvatars(): Promise<string[]> {
    const response = await authenticatedRequest('/user/avatars');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function reorderAvatars(avatarIds: string[]): Promise<Result> {
    const response = await authenticatedRequest('/user/reorder-avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avatarIds)
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function addAvatar(file: File): Promise<Result> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await authenticatedRequest('/user/add-avatar', {
        method: 'POST',
        body: formData
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function deleteAvatar(uri: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/delete-avatar?uri=${encodeURIComponent(uri)}`, {
        method: 'DELETE'
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<Result> {
    const response = await authenticatedRequest('/user/notification-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function sendFriendRequest(request: FriendRequestData): Promise<Result> {
    const response = await authenticatedRequest('/user/friend-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function acceptFriendRequest(requestId: string, label?: string): Promise<Result> {
    const url = label 
        ? `/user/friend-request/accept?requestId=${requestId}&label=${encodeURIComponent(label)}`
        : `/user/friend-request/accept?requestId=${requestId}`;

    const response = await authenticatedRequest(url, { method: 'POST' });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function declineFriendRequest(requestId: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/friend-request/decline?requestId=${requestId}`, {
        method: 'POST'
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function cancelFriendRequest(requestId: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/friend-request?requestId=${requestId}`, {
        method: 'DELETE'
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function getSentFriendRequests(): Promise<FriendRequest[]> {
    const response = await authenticatedRequest('/user/friend-requests/sent');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function getReceivedFriendRequests(): Promise<FriendRequest[]> {
    const response = await authenticatedRequest('/user/friend-requests/received');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function getFriends(): Promise<UserBase[]> {
    const response = await authenticatedRequest('/user/friends');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function removeFriend(login: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/friends?login=${encodeURIComponent(login)}`, {
        method: 'DELETE'
    });

    return response.ok 
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}
