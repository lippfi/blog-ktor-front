import { backendURL } from "@/constants";
import type { TokenPair } from "@/api/dto/userServiceDto";

let refreshPromise: Promise<TokenPair> | null = null;

function clearAuthData(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('tokenPair');
    localStorage.removeItem('sessionInfo');
    localStorage.removeItem('timeToSessionInfo');
}

function getRefreshToken(): string | null {
    const raw = localStorage.getItem('tokenPair');
    if (!raw) return null;
    try {
        return (JSON.parse(raw) as TokenPair).refreshToken;
    } catch {
        return null;
    }
}

function setTokenPair(tokenPair: TokenPair): void {
    localStorage.setItem('tokenPair', JSON.stringify(tokenPair));
    localStorage.setItem('jwt', tokenPair.accessToken);
}

async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        if (!refreshPromise) {
            refreshPromise = fetch(`${backendURL}/session/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            }).then(async (response) => {
                if (!response.ok) {
                    throw new Error('Refresh failed');
                }
                return await response.json() as TokenPair;
            });
        }

        const newTokenPair = await refreshPromise;
        setTokenPair(newTokenPair);
        return true;
    } catch {
        return false;
    } finally {
        refreshPromise = null;
    }
}

function redirectToLogin(): void {
    clearAuthData();
    window.location.href = '/login';
}

async function handleUnauthorizedWithRetry(
    response: Response,
    endpoint: string,
    options: RequestInit,
    buildHeaders: () => HeadersInit | undefined
): Promise<Response> {
    if (response.status !== 401) return response;

    const refreshed = await tryRefreshToken();
    if (!refreshed) {
        redirectToLogin();
        return response;
    }

    const headers = buildHeaders();
    return fetch(`${backendURL}${endpoint}`, { ...options, headers });
}

export async function authenticatedRequest(
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

    const response = await fetch(`${backendURL}${endpoint}`, { ...options, headers });
    return handleUnauthorizedWithRetry(response, endpoint, options, () => ({
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }));
}

export async function optionalAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    let headers = options.headers;
    const token = localStorage.getItem('jwt');
    if (token) {
        headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    const response = await fetch(`${backendURL}${endpoint}`, { ...options, headers });
    return handleUnauthorizedWithRetry(response, endpoint, options, () => {
        const freshToken = localStorage.getItem('jwt');
        if (freshToken) {
            return { ...options.headers, 'Authorization': `Bearer ${freshToken}` };
        }
        return options.headers;
    });
}
