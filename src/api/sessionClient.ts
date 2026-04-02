import { backendURL } from "@/constants";
import { authenticatedRequest } from "@/api/apiUtils";
import type { TokenPair } from "@/api/dto/userServiceDto";
import type { RefreshRequest, DeviceSessionDto } from "@/api/dto/sessionServiceDto";

export type { RefreshRequest, DeviceSessionDto };

// --- Refresh ---

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
    const body: RefreshRequest = { refreshToken };

    const response = await fetch(`${backendURL}/session/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json() as TokenPair;
}

// --- Active sessions ---

export async function getActiveSessions(): Promise<DeviceSessionDto[]> {
    const response = await authenticatedRequest('/session/active');

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json() as DeviceSessionDto[];
}

// --- Revoke ---

export async function revokeSession(sessionId: string): Promise<string> {
    const response = await authenticatedRequest(`/session/revoke/${sessionId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.text();
}

export async function revokeOtherSessions(): Promise<string> {
    const response = await authenticatedRequest('/session/revoke-others', {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.text();
}

export async function revokeAllSessions(): Promise<string> {
    const response = await authenticatedRequest('/session/revoke-all', {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.text();
}
