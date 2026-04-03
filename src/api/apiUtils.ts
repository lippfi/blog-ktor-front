import { backendURL } from "@/constants";
import type { TokenPair } from "@/api/dto/userServiceDto";

let refreshPromise: Promise<{ tokenPair: TokenPair | null; hardFailure: boolean }> | null = null;

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

async function tryRefreshToken(): Promise<{ success: boolean; hardFailure: boolean }> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return { success: false, hardFailure: true };

    try {
        if (!refreshPromise) {
            refreshPromise = fetch(`${backendURL}/session/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            }).then(async (response) => {
                if (!response.ok) {
                    // 4xx means the refresh token is truly invalid/expired
                    const hardFailure = response.status >= 400 && response.status < 500;
                    return { tokenPair: null, hardFailure };
                }
                return { tokenPair: await response.json() as TokenPair, hardFailure: false };
            });
        }

        const result = await refreshPromise;
        if (result.tokenPair) {
            setTokenPair(result.tokenPair);
            return { success: true, hardFailure: false };
        }
        return { success: false, hardFailure: result.hardFailure };
    } catch {
        // Network error or other transient failure — don't treat as hard failure
        return { success: false, hardFailure: false };
    } finally {
        refreshPromise = null;
    }
}

function redirectToLogin(): void {
    clearAuthData();
    const base = import.meta.env.BASE_URL || '/';
    window.location.href = `${base}login`;
}

async function handleUnauthorizedWithRetry(
    response: Response,
    endpoint: string,
    options: RequestInit,
    buildHeaders: () => HeadersInit | undefined,
    isOptional: boolean = false
): Promise<Response> {
    if (response.status !== 401) return response;

    const refreshResult = await tryRefreshToken();
    if (!refreshResult.success) {
        if (isOptional) {
            // For optional auth requests, just return the original response
            return response;
        }
        if (refreshResult.hardFailure) {
            // Refresh token is truly invalid — clear auth and redirect
            redirectToLogin();
        }
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
    }), false);
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
    }, true);
}
