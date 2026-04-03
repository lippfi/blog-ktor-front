import { backendURL } from "@/constants";
import { authenticatedRequest } from "@/api/apiUtils";
import { refreshTokens } from "@/api/sessionClient";
import mitt from 'mitt';
import type {
    TokenPair,
    UserView,
    UserRegistration,
    UserLogin,
    UserAdditionalInfo,
    UserSessionInfo,
    UpdateUserRequest,
    UpdatePasswordRequest,
    SerializableStringMap,
    NotificationSettings,
    FriendRequestCreate,
    FriendRequest,
    IgnoredUserView,
    Language,
    Sex,
    NsfwPolicy,
    UserPermission,
} from "@/api/dto/userServiceDto";

export type { Language, Sex, NsfwPolicy, UserPermission } from "@/api/dto/userServiceDto";
export type { NsfwPolicy as NSFWPolicy } from "@/api/dto/userServiceDto";
export type {
    TokenPair,
    UserView,
    UserRegistration,
    UserLogin,
    UserAdditionalInfo,
    UserSessionInfo,
    UpdateUserRequest,
    UpdatePasswordRequest,
    SerializableStringMap,
    NotificationSettings,
    FriendRequestCreate,
    FriendRequest,
    IgnoredUserView,
};

export const authEvents = mitt();

const TOKEN_PAIR_KEY = 'tokenPair';
const SESSION_INFO_KEY = 'sessionInfo';
const SESSION_INFO_TIME_KEY = 'timeToSessionInfo';
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

// --- Token pair management ---

function getTokenPair(): TokenPair | null {
    const raw = localStorage.getItem(TOKEN_PAIR_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as TokenPair;
    } catch {
        return null;
    }
}

function setTokenPair(tokenPair: TokenPair): void {
    localStorage.setItem(TOKEN_PAIR_KEY, JSON.stringify(tokenPair));
    localStorage.setItem('jwt', tokenPair.accessToken);
}

function clearTokenPair(): void {
    localStorage.removeItem(TOKEN_PAIR_KEY);
    localStorage.removeItem('jwt');
}

export function getAccessToken(): string | null {
    return getTokenPair()?.accessToken ?? null;
}

async function refreshTokenPair(): Promise<void> {
    const tokenPair = getTokenPair();
    if (!tokenPair) return;

    try {
        const newTokenPair = await refreshTokens(tokenPair.refreshToken);
        setTokenPair(newTokenPair);
    } catch (error) {
        console.error('Error refreshing token pair:', error);
    }
}

function startTokenRefreshJob(): void {
    stopTokenRefreshJob();
    refreshIntervalId = setInterval(refreshTokenPair, REFRESH_INTERVAL_MS);
}

function stopTokenRefreshJob(): void {
    if (refreshIntervalId !== null) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
    }
}

// --- Session info ---

export async function updateCurrentSessionInfo(): Promise<UserSessionInfo> {
    const response = await authenticatedRequest('/user/session-info');

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const sessionInfo: UserSessionInfo = await response.json();

    localStorage.setItem(SESSION_INFO_KEY, JSON.stringify(sessionInfo));
    localStorage.setItem(SESSION_INFO_TIME_KEY, Date.now().toString());
    return sessionInfo;
}

export async function getCurrentSessionInfo(): Promise<UserSessionInfo> {
    const sessionInfoStr = localStorage.getItem(SESSION_INFO_KEY);
    const lastFetchTimeStr = localStorage.getItem(SESSION_INFO_TIME_KEY);

    const needsFetch = !sessionInfoStr || !lastFetchTimeStr ||
        (Date.now() - parseInt(lastFetchTimeStr) > REFRESH_INTERVAL_MS);

    if (needsFetch) {
        try {
            return updateCurrentSessionInfo();
        } catch (error) {
            console.error('Failed to fetch session info:', error);

            if (sessionInfoStr) {
                return JSON.parse(sessionInfoStr);
            }

            throw error;
        }
    }

    return JSON.parse(sessionInfoStr!);
}

export function isSignedIn(): boolean {
    return getTokenPair() !== null;
}

export function clearCurrentSessionInfo(): void {
    localStorage.removeItem(SESSION_INFO_KEY);
    localStorage.removeItem(SESSION_INFO_TIME_KEY);
}

export function getCurrentUserLogin(): string | undefined {
    return JSON.parse(localStorage.getItem(SESSION_INFO_KEY) || 'null')?.login;
}

export async function getCurrentUserNickname(): Promise<string> {
    return (await getCurrentSessionInfo()).nickname;
}

// --- Auth ---

export async function signIn(login: string, password: string): Promise<Result> {
    const body: UserLogin = { login, password };
    const response = await fetch(`${backendURL}/user/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (response.ok) {
        const tokenPair: TokenPair = await response.json();
        setTokenPair(tokenPair);
        startTokenRefreshJob();
        await getCurrentSessionInfo();
        authEvents.emit('auth-changed', true);
        return { type: 'ok' };
    } else {
        return { type: 'error', message: await response.text() };
    }
}

export async function signUp(
    login: string,
    nickname: string,
    email: string,
    password: string,
    inviteCode: string,
    language: string,
    timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): Promise<Result> {
    const body: UserRegistration = {
        login,
        nickname,
        email,
        password,
        timezone,
        language: language as UserRegistration['language'],
    };

    const url = inviteCode.trim()
        ? `${backendURL}/user/sign-up?invite-code=${encodeURIComponent(inviteCode)}`
        : `${backendURL}/user/sign-up`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function confirmRegistration(code: string): Promise<Result<TokenPair>> {
    const response = await fetch(
        `${backendURL}/user/confirm-registration?code=${encodeURIComponent(code)}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
    );

    if (response.ok) {
        const tokenPair: TokenPair = await response.json();
        setTokenPair(tokenPair);
        startTokenRefreshJob();
        return { type: 'ok', data: tokenPair };
    } else {
        return { type: 'error', message: await response.text() };
    }
}

export function logOut(): void {
    stopTokenRefreshJob();
    clearTokenPair();
    clearCurrentSessionInfo();
    authEvents.emit('auth-changed', false);
}

// --- Availability checks ---

export async function isLoginBusy(login: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-login-busy?login=${encodeURIComponent(login)}`);
    return (await response.text()) === 'true';
}

export async function isEmailBusy(email: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-email-busy?email=${encodeURIComponent(email)}`);
    return (await response.text()) === 'true';
}

export async function isNicknameBusy(nickname: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-nickname-busy?nickname=${encodeURIComponent(nickname)}`);
    return (await response.text()) === 'true';
}

// --- Search ---

export async function searchUsers(text: string): Promise<Result<UserView[]>> {
    const response = await fetch(`${backendURL}/user/search?text=${encodeURIComponent(text)}`);
    return response.ok
        ? { type: 'ok', data: await response.json() }
        : { type: 'error', message: await response.text() };
}

export async function getUsersByLogins(logins: string[]): Promise<Result<UserView[]>> {
    try {
        const url = `${backendURL}/user/search-logins?logins=${encodeURIComponent(logins.join(','))}`;
        const response = await fetch(url);
        if (response.ok) {
            return { type: 'ok', data: await response.json() };
        } else {
            return { type: 'error', message: await response.text() };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

// --- Password reset ---

export async function sendPasswordResetEmail(userIdentifier: string): Promise<Result> {
    const response = await fetch(`${backendURL}/user/send-password-reset-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userIdentifier,
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function resetPassword(code: string, newPassword: string): Promise<Result> {
    const response = await fetch(`${backendURL}/user/reset-password?code=${encodeURIComponent(code)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newPassword,
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

// --- Profile ---

export async function createInviteCode(): Promise<string> {
    const response = await authenticatedRequest('/user/create-invite-code');
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

export async function updateUser(updateData: UpdateUserRequest): Promise<Result> {
    const response = await authenticatedRequest('/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateAdditionalInfo(info: UserAdditionalInfo): Promise<Result> {
    const response = await authenticatedRequest('/user/update-additional-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateSignature(signature: string): Promise<Result> {
    const response = await authenticatedRequest('/user/update-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: signature,
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateNickname(nickname: string): Promise<Result> {
    const response = await authenticatedRequest('/user/update-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: nickname,
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateLanguage(language: Language): Promise<Result> {
    const response = await authenticatedRequest('/user/update-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(language),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateTimezone(timezone: string): Promise<Result> {
    const response = await authenticatedRequest('/user/update-timezone', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: timezone,
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updatePassword(request: UpdatePasswordRequest): Promise<Result> {
    const response = await authenticatedRequest('/user/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateSex(sex: Sex): Promise<Result> {
    const response = await authenticatedRequest('/user/update-sex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sex),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateNsfwPolicy(nsfw: NsfwPolicy): Promise<Result> {
    const response = await authenticatedRequest('/user/update-nsfw-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nsfw),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function updateBirthdate(date: string): Promise<Result> {
    const response = await authenticatedRequest('/user/update-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(date),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

// --- Avatars ---

export async function getAvatars(): Promise<Record<string, string>> {
    const response = await authenticatedRequest('/user/avatars');
    if (!response.ok) throw new Error(await response.text());
    return (await response.json() as SerializableStringMap).content;
}

export async function reorderAvatars(avatarIds: string[]): Promise<Result> {
    const response = await authenticatedRequest('/user/reorder-avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avatarIds),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function addAvatar(files: File[]): Promise<Result<Record<string, string>>> {
    const formData = new FormData();
    for (const file of files) {
        formData.append('file', file);
    }

    const response = await authenticatedRequest('/user/add-avatar', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        return { type: 'error', message: await response.text() };
    }

    return { type: 'ok', data: (await response.json() as SerializableStringMap).content };
}

export async function addAvatarByUri(uri: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/add-avatar-by-uri?uri=${encodeURIComponent(uri)}`, {
        method: 'POST',
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function deleteAvatar(uri: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/delete-avatar?uri=${encodeURIComponent(uri)}`, {
        method: 'DELETE',
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

// --- Notification settings ---

export async function updateNotificationSettings(settings: NotificationSettings): Promise<Result> {
    const response = await authenticatedRequest('/user/notification-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

// --- Friend requests ---

export async function sendFriendRequest(request: FriendRequestCreate): Promise<Result> {
    const response = await authenticatedRequest('/user/friend-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function cancelFriendRequest(requestId: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/friend-request?requestId=${encodeURIComponent(requestId)}`, {
        method: 'DELETE',
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function acceptFriendRequest(requestId: string, label?: string): Promise<Result> {
    const url = label
        ? `/user/friend-request/accept?requestId=${encodeURIComponent(requestId)}&label=${encodeURIComponent(label)}`
        : `/user/friend-request/accept?requestId=${encodeURIComponent(requestId)}`;

    const response = await authenticatedRequest(url, { method: 'POST' });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function declineFriendRequest(requestId: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/friend-request/decline?requestId=${encodeURIComponent(requestId)}`, {
        method: 'POST',
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

// --- Friends ---

export async function getFriends(): Promise<UserView[]> {
    const response = await authenticatedRequest('/user/friends');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function removeFriend(login: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/friends?login=${encodeURIComponent(login)}`, {
        method: 'DELETE',
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

// --- Feed visibility ---

export async function doNotShowInFeed(login: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/do-not-show-in-feed?login=${encodeURIComponent(login)}`, {
        method: 'POST',
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function showInFeed(login: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/show-in-feed?login=${encodeURIComponent(login)}`, {
        method: 'POST',
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function getDoNotShowInFeedList(): Promise<UserView[]> {
    const response = await authenticatedRequest('/user/do-not-show-in-feed-list');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// --- Ignore ---

export async function ignoreUser(login: string, reason?: string): Promise<Result> {
    let url = `/user/ignore-user?login=${encodeURIComponent(login)}`;
    if (reason) {
        url += `&reason=${encodeURIComponent(reason)}`;
    }

    const response = await authenticatedRequest(url, { method: 'POST' });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function unignoreUser(login: string): Promise<Result> {
    const response = await authenticatedRequest(`/user/unignore-user?login=${encodeURIComponent(login)}`, {
        method: 'POST',
    });

    return response.ok
        ? { type: 'ok' }
        : { type: 'error', message: await response.text() };
}

export async function getIgnoredUsers(): Promise<IgnoredUserView[]> {
    const response = await authenticatedRequest('/user/ignored-users');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// --- Result type ---

export type Result<T = void> =
    | (T extends void ? { type: 'ok'; data?: T } : { type: 'ok'; data: T })
    | { type: 'error'; message: string };

// --- Aliases for backward compatibility ---

export { addAvatarByUri as addAvatarByUrl };
export { addAvatar as addAvatars };
export { getUsersByLogins as getUsers };

// --- Initialize refresh job on load if tokens exist ---

if (getTokenPair()) {
    startTokenRefreshJob();
}
